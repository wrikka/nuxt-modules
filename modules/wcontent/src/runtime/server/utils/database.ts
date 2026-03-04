import type { Database as BetterSQLite3Database } from "better-sqlite3";
import Database from "better-sqlite3";
import type { ParsedContent, QueryOptions, WhereOperator } from "../../shared/types/collection";

export interface DatabaseAdapter {
  init(): Promise<void>;
  insert(collection: string, content: ParsedContent): Promise<void>;
  update(collection: string, path: string, content: Partial<ParsedContent>): Promise<void>;
  delete(collection: string, path: string): Promise<void>;
  find(collection: string, options: QueryOptions): Promise<ParsedContent[]>;
  findOne(collection: string, path: string): Promise<ParsedContent | null>;
  count(collection: string, where?: QueryOptions["where"]): Promise<number>;
  search(query: string, collections?: string[]): Promise<ParsedContent[]>;
  close(): Promise<void>;
}

export function createDatabase(config: { type: "sqlite" | "memory"; path?: string }): DatabaseAdapter {
  if (config.type === "sqlite" || config.type === "memory") {
    return new SQLiteAdapter(config.path || ":memory:");
  }
  throw new Error(`Unsupported database type: ${config.type}`);
}

class SQLiteAdapter implements DatabaseAdapter {
  private db: BetterSQLite3Database | null = null;
  private ftsEnabled = false;

  constructor(private path: string) {}

  async init(): Promise<void> {
    this.db = new Database(this.path);
    
    // Enable WAL mode for better concurrency
    this.db.pragma("journal_mode = WAL");
    
    // Create content table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collection TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        dir TEXT,
        file TEXT,
        extension TEXT,
        draft BOOLEAN DEFAULT 0,
        partial BOOLEAN DEFAULT 0,
        title TEXT,
        description TEXT,
        body TEXT,
        raw JSON,
        meta JSON,
        created_at TEXT,
        updated_at TEXT,
        word_count INTEGER DEFAULT 0,
        reading_time INTEGER DEFAULT 0
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_content_collection ON content(collection);
      CREATE INDEX IF NOT EXISTS idx_content_path ON content(path);
      CREATE INDEX IF NOT EXISTS idx_content_draft ON content(draft);
      CREATE INDEX IF NOT EXISTS idx_content_created ON content(created_at);
    `);

    // Enable FTS5 for full-text search
    try {
      this.db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
          path,
          title,
          body,
          description,
          content='content',
          content_rowid='id'
        )
      `);
      this.ftsEnabled = true;
    } catch {
      console.warn("FTS5 not available, falling back to basic search");
    }
  }

  async insert(collection: string, content: ParsedContent): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const now = new Date().toISOString();
    const wordCount = content.body ? content.body.split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200); // 200 wpm average

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO content (
        collection, path, dir, file, extension, draft, partial,
        title, description, body, raw, meta, created_at, updated_at,
        word_count, reading_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      collection,
      content._path,
      content._dir,
      content._file,
      content._extension,
      content._draft ? 1 : 0,
      content._partial ? 1 : 0,
      content.title || null,
      content.description || null,
      content.body || null,
      JSON.stringify(content._raw || {}),
      JSON.stringify(this.extractMeta(content)),
      content.createdAt || now,
      content.updatedAt || now,
      wordCount,
      readingTime
    );

    // Update FTS index if enabled
    if (this.ftsEnabled) {
      this.db.prepare(`
        INSERT OR REPLACE INTO content_fts (path, title, body, description)
        VALUES (?, ?, ?, ?)
      `).run(
        content._path,
        content.title || "",
        content.body || "",
        content.description || ""
      );
    }
  }

  async update(collection: string, path: string, content: Partial<ParsedContent>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const fields: string[] = [];
    const values: any[] = [];

    if (content.title !== undefined) {
      fields.push("title = ?");
      values.push(content.title);
    }
    if (content.description !== undefined) {
      fields.push("description = ?");
      values.push(content.description);
    }
    if (content.body !== undefined) {
      fields.push("body = ?");
      values.push(content.body);
      fields.push("word_count = ?");
      values.push(content.body.split(/\s+/).length);
      fields.push("reading_time = ?");
      values.push(Math.ceil(content.body.split(/\s+/).length / 200));
    }
    if (content._draft !== undefined) {
      fields.push("draft = ?");
      values.push(content._draft ? 1 : 0);
    }

    fields.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(collection);
    values.push(path);

    const stmt = this.db.prepare(`
      UPDATE content SET ${fields.join(", ")} WHERE collection = ? AND path = ?
    `);
    stmt.run(...values);
  }

  async delete(collection: string, path: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    
    this.db.prepare("DELETE FROM content WHERE collection = ? AND path = ?").run(collection, path);
    
    if (this.ftsEnabled) {
      this.db.prepare("DELETE FROM content_fts WHERE path = ?").run(path);
    }
  }

  async find(collection: string, options: QueryOptions): Promise<ParsedContent[]> {
    if (!this.db) throw new Error("Database not initialized");

    let sql = "SELECT * FROM content WHERE collection = ?";
    const params: any[] = [collection];

    // Apply where clauses
    if (options.where) {
      const whereClause = this.buildWhereClause(options.where, params);
      if (whereClause) {
        sql += ` AND ${whereClause}`;
      }
    }

    // Apply sorting
    if (options.sort && options.sort.length > 0) {
      const orderBy = options.sort.map(s => {
        const field = this.mapField(s.field);
        return `${field} ${s.direction?.toUpperCase() || "ASC"}`;
      }).join(", ");
      sql += ` ORDER BY ${orderBy}`;
    } else {
      sql += " ORDER BY path ASC";
    }

    // Apply pagination
    if (options.limit !== undefined) {
      sql += " LIMIT ?";
      params.push(options.limit);
    }
    if (options.skip !== undefined) {
      sql += " OFFSET ?";
      params.push(options.skip);
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];

    return rows.map(row => this.rowToContent(row, options.only, options.without));
  }

  async findOne(collection: string, path: string): Promise<ParsedContent | null> {
    if (!this.db) throw new Error("Database not initialized");

    const stmt = this.db.prepare("SELECT * FROM content WHERE collection = ? AND path = ?");
    const row = stmt.get(collection, path) as any;

    return row ? this.rowToContent(row) : null;
  }

  async count(collection: string, where?: QueryOptions["where"]): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");

    let sql = "SELECT COUNT(*) as count FROM content WHERE collection = ?";
    const params: any[] = [collection];

    if (where) {
      const whereClause = this.buildWhereClause(where, params);
      if (whereClause) {
        sql += ` AND ${whereClause}`;
      }
    }

    const stmt = this.db.prepare(sql);
    const result = stmt.get(...params) as { count: number };
    return result.count;
  }

  async search(query: string, collections?: string[]): Promise<ParsedContent[]> {
    if (!this.db) throw new Error("Database not initialized");

    let sql: string;
    let params: any[];

    if (this.ftsEnabled) {
      // Use FTS5 for full-text search
      sql = `
        SELECT c.* FROM content c
        JOIN content_fts fts ON c.path = fts.path
        WHERE content_fts MATCH ?
      `;
      params = [query];

      if (collections && collections.length > 0) {
        sql += ` AND c.collection IN (${collections.map(() => "?").join(",")})`;
        params.push(...collections);
      }

      sql += " ORDER BY rank";
    } else {
      // Fallback to LIKE search
      sql = "SELECT * FROM content WHERE (title LIKE ? OR body LIKE ? OR description LIKE ?)";
      params = [`%${query}%`, `%${query}%`, `%${query}%`];

      if (collections && collections.length > 0) {
        sql += ` AND collection IN (${collections.map(() => "?").join(",")})`;
        params.push(...collections);
      }
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];

    return rows.map(row => this.rowToContent(row));
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  private buildWhereClause(where: Record<string, WhereOperator | any>, params: any[]): string {
    const conditions: string[] = [];

    for (const [key, value] of Object.entries(where)) {
      const field = this.mapField(key);

      if (typeof value === "object" && value !== null) {
        // Operator-based query
        if (value.$eq !== undefined) {
          conditions.push(`${field} = ?`);
          params.push(value.$eq);
        }
        if (value.$ne !== undefined) {
          conditions.push(`${field} != ?`);
          params.push(value.$ne);
        }
        if (value.$gt !== undefined) {
          conditions.push(`${field} > ?`);
          params.push(value.$gt);
        }
        if (value.$gte !== undefined) {
          conditions.push(`${field} >= ?`);
          params.push(value.$gte);
        }
        if (value.$lt !== undefined) {
          conditions.push(`${field} < ?`);
          params.push(value.$lt);
        }
        if (value.$lte !== undefined) {
          conditions.push(`${field} <= ?`);
          params.push(value.$lte);
        }
        if (value.$in !== undefined && Array.isArray(value.$in)) {
          conditions.push(`${field} IN (${value.$in.map(() => "?").join(",")})`);
          params.push(...value.$in);
        }
        if (value.$nin !== undefined && Array.isArray(value.$nin)) {
          conditions.push(`${field} NOT IN (${value.$nin.map(() => "?").join(",")})`);
          params.push(...value.$nin);
        }
        if (value.$contains !== undefined) {
          conditions.push(`${field} LIKE ?`);
          params.push(`%${value.$contains}%`);
        }
        if (value.$startsWith !== undefined) {
          conditions.push(`${field} LIKE ?`);
          params.push(`${value.$startsWith}%`);
        }
        if (value.$endsWith !== undefined) {
          conditions.push(`${field} LIKE ?`);
          params.push(`%${value.$endsWith}`);
        }
      } else {
        // Direct equality
        conditions.push(`${field} = ?`);
        params.push(value);
      }
    }

    return conditions.join(" AND ");
  }

  private mapField(field: string): string {
    const fieldMap: Record<string, string> = {
      _path: "path",
      _dir: "dir",
      _file: "file",
      _extension: "extension",
      _draft: "draft",
      _partial: "partial",
    };
    return fieldMap[field] || field;
  }

  private rowToContent(row: any, only?: string[], without?: string[]): ParsedContent {
    const content: ParsedContent = {
      _path: row.path,
      _dir: row.dir,
      _file: row.file,
      _extension: row.extension,
      _draft: Boolean(row.draft),
      _partial: Boolean(row.partial),
      _collection: row.collection,
      title: row.title,
      description: row.description,
      body: row.body,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      wordCount: row.word_count,
      readingTime: row.reading_time,
      ...JSON.parse(row.meta || "{}"),
      _raw: JSON.parse(row.raw || "{}"),
    };

    // Apply field filtering
    if (only && only.length > 0) {
      const filtered: any = {};
      for (const key of only) {
        if (key in content) {
          filtered[key] = content[key];
        }
      }
      return filtered;
    }

    if (without && without.length > 0) {
      for (const key of without) {
        delete content[key];
      }
    }

    return content;
  }

  private extractMeta(content: ParsedContent): Record<string, any> {
    const meta: Record<string, any> = {};
    const excludeKeys = [
      "_path", "_dir", "_file", "_extension", "_draft", "_partial",
      "_collection", "title", "description", "body", "_raw",
      "createdAt", "updatedAt", "wordCount", "readingTime",
    ];

    for (const [key, value] of Object.entries(content)) {
      if (!excludeKeys.includes(key) && !key.startsWith("_")) {
        meta[key] = value;
      }
    }

    return meta;
  }
}
