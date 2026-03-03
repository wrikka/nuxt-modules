# Contributing

We welcome contributions to @wpackages/chart! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/chart.git
cd chart
```

3. Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

## Development Setup

### Development Server

Start the development server:

```bash
npm run dev
```

This will start a development build that watches for changes.

### Build the Module

Build the module for production:

```bash
npm run build
```

### Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

### Code Quality

Check and fix code quality:

```bash
# Lint code
npm run lint

# Format code
npm run format
```

The project uses:
- **TypeScript** for type safety
- **oxlint** for fast JavaScript/TypeScript linting
- **Biome** for code formatting and additional linting

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict type checking
- Avoid `any` types when possible
- Use proper type definitions for all exports

### Code Style

- Follow the existing code style
- Use consistent naming conventions
- Write descriptive variable and function names
- Keep functions small and focused

### Vue Components

- Use Vue 3 Composition API
- Use `<script setup lang="ts">` syntax
- Follow UnoCSS utility-first approach for styling
- Ensure components are reactive and performant

### Commit Messages

Use conventional commit format:

```bash
feat: add new chart type
fix: resolve tooltip positioning bug
docs: update API documentation
style: format code with biome
refactor: simplify data processing logic
test: add unit tests for new component
```

### Pull Request Process

1. Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and ensure:
   - All tests pass
   - Code is properly typed
   - Linting passes
   - Documentation is updated if needed

3. Commit your changes:

```bash
git commit -m "feat: description of your changes"
```

4. Push to your fork:

```bash
git push origin feature/your-feature-name
```

5. Create a Pull Request on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/videos for UI changes
   - Test coverage information

### Testing Guidelines

- Write unit tests for all new functions and components
- Include integration tests for complex features
- Test edge cases and error conditions
- Aim for high test coverage (>80%)
- Use descriptive test names

### Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Update TypeScript definitions
- Include code examples where helpful

### Breaking Changes

- Clearly document breaking changes
- Provide migration guides
- Update version numbers appropriately

## Project Structure

```
module/
├── src/
│   ├── runtime/          # Runtime components and composables
│   └── test/            # Test utilities
├── tests/               # Test files
├── package.json         # Module package configuration
├── nuxt.config.ts       # Nuxt configuration
├── tsconfig.json        # TypeScript configuration
├── uno.config.ts        # UnoCSS configuration
└── vitest.config.ts     # Vitest configuration
```

## Reporting Issues

When reporting bugs or requesting features:

1. Check existing issues first
2. Use issue templates when available
3. Provide clear reproduction steps
4. Include environment information (Node version, OS, etc.)
5. Add screenshots or code examples when relevant

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT).

## Code of Conduct

Please be respectful and inclusive in all interactions. We follow a code of conduct to ensure a positive community experience.

---

Thank you for contributing to @wpackages/chart! 🎉
