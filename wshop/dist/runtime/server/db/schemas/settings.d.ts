export declare const settings: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "settings";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "settings";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        activeTheme: import("drizzle-orm/pg-core").PgColumn<{
            name: "active_theme";
            tableName: "settings";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        themeConfig: import("drizzle-orm/pg-core").PgColumn<{
            name: "theme_config";
            tableName: "settings";
            dataType: "json";
            columnType: "PgJsonb";
            data: Record<string, any>;
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: Record<string, any>;
        }>;
    };
    dialect: "pg";
}>;
//# sourceMappingURL=settings.d.ts.map