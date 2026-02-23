# Project Architecture

This project is a monorepo managed with Bun and Turborepo. It consists of a Nuxt frontend application and several local packages for shared logic.

## Data Flow

1.  **User Interaction**: The user interacts with the UI components in `apps/web/app/components` (e.g., `SpreadsheetGrid.vue`, `FormulaBar.vue`).
2.  **State Management**: UI events are handled by the `useSpreadsheet.ts` composable, which manages the application's state, such as the grid data, selected cells, and editing state.
3.  **Formula Calculation**:
    *   When a cell value starting with `=` is entered, the `useSpreadsheet.ts` composable passes the grid data to the `useFormulaParser.ts` composable.
    *   `useFormulaParser.ts` uses the `hot-formula-parser` library to parse and compute the formula's result.
    *   It handles dependencies on other cells by calling back to the grid to fetch their values.
4.  **Display Update**: The `displayedGrid` computed property in `useFormulaParser.ts` updates with the calculated results. This change is reactively propagated back to the `SpreadsheetGrid.vue` component, which re-renders to show the new values to the user.

## Core Packages

*   `apps/web`: The main Nuxt 3 application that serves as the user interface.
*   `packages/formula-engine`: (Currently seems unused, but intended for formula logic). Should be integrated with the parser.
*   `packages/formula-parser`: (Currently seems unused, but intended for formula parsing). Should be integrated with the engine.
