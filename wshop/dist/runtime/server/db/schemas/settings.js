import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("global"),
  activeTheme: text("active_theme").default("default"),
  themeConfig: jsonb("theme_config").$type()
});
