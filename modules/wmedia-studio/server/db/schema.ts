// =============================================================================
// Database Schema - Main Export File
// =============================================================================
//
// This file re-exports all schema modules from the ./schema/ directory.
// Each domain is organized into separate files for better maintainability.
//
// Directory Structure:
// - schema/enums.ts           - Type-safe enums and constants
// - schema/helpers.ts         - Reusable column patterns (timestamps, softDelete, etc.)
// - schema/projects.ts        - Core tables (folders, projects)
// - schema/media.ts           - Media & Assets
// - schema/elements.ts        - Design Elements
// - schema/templates.ts       - Templates
// - schema/brands.ts          - Brand Kits (colors, fonts, logos)
// - schema/comments.ts        - Collaboration - Comments
// - schema/video-audio.ts     - Video & Audio Projects
// - schema/project-history.ts - Project History, Exports, Shares
// - schema/analytics.ts       - Analytics & Activity Log
//
// Usage:
//   import { projects, mediaItems } from '~/server/db/schema';
//   import { ProjectType, MediaType } from '~/server/db/schema';

// Enums & Types
export * from "./schema/enums";

// Reusable Column Patterns (useful for extending schemas)
export { softDelete, timestamps, userTracking } from "./schema/helpers";

// Core Tables
export { folders, projects } from "./schema/projects";

// Media & Assets
export { mediaItems } from "./schema/media";

// Design Elements
export { elements } from "./schema/elements";

// Templates
export { templates } from "./schema/templates";

// Brand Kits
export { brandColors, brandFonts, brandKits, brandLogos } from "./schema/brands";

// Collaboration - Comments
export { commentReplies, comments } from "./schema/comments";

// Video & Audio Projects
export { audioProjects, videoProjects } from "./schema/video-audio";

// Project Management
export { projectExports, projectHistory, projectShares } from "./schema/project-history";

// Analytics & Activity
export { activityLog, mediaStats, projectStats } from "./schema/analytics";
