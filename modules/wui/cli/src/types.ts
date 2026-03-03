export type Action = 'dev' | 'create' | 'build' | 'status' | 'clean';

export type DevMode = 'docs' | 'playground' | 'storybook' | 'custom';

export type CreateType = 'component' | 'composable' | 'plugin' | 'theme';

export type Category = 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages';

export type Feature = 'typescript' | 'tests' | 'stories' | 'docs';

export type BuildTarget = 'wui' | 'cli' | 'docs' | 'all';

export type BuildMode = 'development' | 'production' | 'analyze';

export type CleanTarget = 'node_modules' | 'dist' | 'cache' | 'logs';

export interface CommandResult {
  stdout: string;
  stderr: string;
}
