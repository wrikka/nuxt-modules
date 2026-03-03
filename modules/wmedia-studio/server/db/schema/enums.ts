// =============================================================================
// Enums & Constants
// =============================================================================

export const projectTypes = ["designer", "audio-editor", "video-editor", "video-recording"] as const;
export type ProjectType = typeof projectTypes[number];

export const projectStatuses = ["draft", "active", "completed", "archived"] as const;
export type ProjectStatus = typeof projectStatuses[number];

export const mediaTypes = ["image", "audio", "video", "document"] as const;
export type MediaType = typeof mediaTypes[number];

export const elementTypes = ["text", "image", "video", "shape", "icon", "chart", "qr", "group"] as const;
export type ElementType = typeof elementTypes[number];

export const templateCategories = ["social-media", "presentation", "poster", "other"] as const;
export type TemplateCategory = typeof templateCategories[number];

export const shareRoles = ["owner", "admin", "editor", "viewer"] as const;
export type ShareRole = typeof shareRoles[number];

export const exportFormats = ["json", "pdf", "png", "mp4", "wav", "mp3"] as const;
export type ExportFormat = typeof exportFormats[number];

export const exportStatuses = ["pending", "processing", "completed", "failed"] as const;
export type ExportStatus = typeof exportStatuses[number];

export const entityTypes = ["project", "media", "comment"] as const;
export type EntityType = typeof entityTypes[number];
