# WAccount

Account management platform for wrikka.com - A modern monorepo built with Nuxt 4, Turborepo, and Bun.

## Introduction

WAccount is a comprehensive account management platform designed for wrikka.com. It provides users with a complete suite of tools for authentication, profile management, billing, organization management, security settings, and more. Built as a monorepo using Turborepo and Bun, it follows modern best practices for type safety, performance, and developer experience.

## Features

- 🔐 **Authentication System** - Complete authentication flow with WorkOS and Lucia
- 👤 **Profile Management** - Edit profiles, avatar management, password changes
- 💳 **Billing & Subscriptions** - Stripe integration for payment processing
- 🏢 **Organization Management** - Team collaboration with role-based access
- 🛡️ **Security Features** - Session management, API keys, audit logs
- 🔗 **Third-party Integrations** - OAuth connections to external services
- 🔔 **Webhook Management** - Event-driven architecture with webhooks
- 📬 **Notification System** - Email, push, and in-app notifications
- 📊 **Usage Analytics** - Real-time metrics and usage tracking
- 🎨 **Modern UI** - Responsive design with dark mode support
- 🚀 **High Performance** - Cloudflare deployment with edge computing
- 🧪 **Comprehensive Testing** - Full test coverage with Vitest
- 📐 **Type Safety** - Strict TypeScript throughout the codebase

## Goal

- 🎯 Provide a seamless and secure account management experience
- 🎯 Support enterprise-grade features including organizations and billing
- 🎯 Ensure high performance and scalability with edge deployment
- 🎯 Maintain code quality with strict type safety and testing
- 🎯 Enable rapid development with modern tooling and automation

## Design Principles

- 🏗️ **Monorepo Architecture** - Shared code and dependencies across workspaces
- 🎨 **Component-Based Design** - Reusable components and modules
- 🔒 **Security First** - Built-in authentication and authorization
- ⚡ **Performance Optimized** - Edge deployment and caching strategies
- 🧪 **Test Coverage** - Comprehensive testing at all levels
- 📐 **Clean Code** - Strict linting, formatting, and code quality rules
- 🔄 **Developer Experience** - Hot module replacement, fast builds, excellent tooling

## Installation

### Prerequisites

- Bun 1.3.5 or higher
- PostgreSQL database
- WorkOS account (for authentication)
- Stripe account (for billing)
- Cloudflare account (for deployment)

### Setup

<details>
<summary>Clone and Install</summary>

```bash
# Clone the repository
git clone https://github.com/newkub/waccount.git
cd waccount

# Install dependencies
bun install

# Install git hooks
bun run prepare
```

</details>

<details>
<summary>Environment Variables</summary>

Create a `.env` file in `apps/web/`:

```env
# Base URL
NUXT_PUBLIC_BASE_URL=https://account.wrikka.com

# WorkOS Authentication
NUXT_WORKOS_API_KEY=your_workos_api_key
NUXT_WORKOS_CLIENT_ID=your_workos_client_id
NUXT_WORKOS_REDIRECT_URI=https://account.wrikka.com/auth/callback
NUXT_WORKOS_COOKIE_PASSWORD=your_cookie_password

# Lucia Session
NUXT_LUCIA_SESSION_PASSWORD=your_session_password

# Stripe Billing
NUXT_STRIPE_SECRET_KEY=your_stripe_secret_key

# Admin
NUXT_PUBLIC_ADMIN_EMAILS=admin@wrikka.com
```

</details>

<details>
<summary>Database Setup</summary>

```bash
# Generate migrations
bunx drizzle-kit generate

# Run migrations
bunx drizzle-kit migrate

# Push to database (development)
bunx drizzle-kit push
```

</details>

## Usage

### Development

```bash
# Start all workspaces in development mode
bun dev

# Start specific workspace
bun dev --filter=web
bun dev --filter=auth-dashboard

# Watch mode with UI
bun watch
```

### Build

```bash
# Build all workspaces
bun build

# Build specific workspace
bun build --filter=web
bun build --filter=auth-dashboard
```

### Testing

```bash
# Run all tests
bun test

# Run tests with coverage
bun test:coverage

# Run tests with UI
bun test:ui

# Run tests for specific workspace
bun test --filter=web
```

### Linting & Formatting

```bash
# Run linters
bun lint

# Format code
bun format

# Run ast-grep security scan
bun scan

# Check for unused dependencies
bun run check:modules
```

### Verification

```bash
# Run all checks (test, lint, build)
bun verify

# Update dependencies
bun install
```

## Examples

### Running the Web Application

```bash
# Start the web application
cd apps/web
bun dev

# The app will be available at http://localhost:3000
```

### Developing the Auth Dashboard Module

```bash
# Start the playground
cd packages/auth-dashboard
bun dev

# Build the module
bun build
```

### Using Turborepo Filters

```bash
# Run task in all workspaces
bun run lint

# Run task in specific workspace
bun run lint --filter=web

# Run task in workspace and its dependencies
bun run build --filter=web...
```

## Project Structure

```
waccount/
├── apps/                     # Applications
│   └── web/                  # Nuxt 4 web application
│       ├── app/              # App Router pages and components
│       ├── server/           # Server-side API and logic
│       ├── shared/           # Shared schemas, types, utils
│       └── public/           # Public assets
├── packages/                 # Workspace packages
│   └── auth-dashboard/       # Auth dashboard Nuxt module
│       ├── runtime/          # Runtime components and composables
│       ├── examples/         # Usage examples
│       └── playground/       # Development playground
├── rules/                    # Code quality rules
│   ├── ast-grep/             # ast-grep rules
│   ├── functional/           # Functional programming rules
│   ├── package-json/         # package.json rules
│   ├── typescript/           # TypeScript rules
│   └── turborepo/            # Turborepo rules
├── .gitignore                # Git ignore rules
├── .gitmodules               # Git submodules
├── bun.lock                  # Bun lockfile
├── dprint.json               # dprint configuration
├── lefthook.yml              # Git hooks configuration
├── package.json              # Root package.json
├── sgconfig.yml              # ast-grep configuration
├── turbo.json                # Turborepo configuration
└── vitest.config.ts          # Vitest configuration
```

## Tech Stack

### Core

- **Package Manager**: Bun 1.3.5
- **Monorepo**: Turborepo
- **Language**: TypeScript (strict mode)

### Web Application (apps/web)

- **Framework**: Nuxt 4 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Lucia + WorkOS
- **State Management**: Pinia
- **Styling**: UnoCSS
- **Validation**: Zod
- **Testing**: Vitest
- **Linting**: oxlint, vue-tsc
- **Formatting**: dprint
- **Deployment**: Cloudflare Module

### Auth Dashboard Module (packages/auth-dashboard)

- **Framework**: Nuxt Module
- **Compatibility**: Nuxt 4
- **Build Tool**: @nuxt/module-builder
- **Testing**: Vitest + @nuxt/test-utils

### Development Tools

- **Git Hooks**: Lefthook
- **Code Scanning**: ast-grep
- **Module Inspector**: node-modules-inspector
- **Dependency Updates**: taze

## Scripts

### Root Scripts

- `bun dev` - Start all workspaces in development mode
- `bun watch` - Watch mode with TUI
- `bun build` - Build all workspaces
- `bun test` - Run all tests
- `bun lint` - Run all linters
- `bun format` - Format all code
- `bun scan` - Run ast-grep security scan
- `bun verify` - Run all checks (test, lint, build)
- `bun run prepare` - Install git hooks
- `bun run check:modules` - Check for unused dependencies

### Workspace Scripts

Each workspace has its own set of scripts:

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun test` - Run tests
- `bun test:coverage` - Run tests with coverage
- `bun test:ui` - Run tests with UI
- `bun lint` - Run linters
- `bun format` - Format code
- `bun scan` - Run ast-grep scan

## Workspaces

### apps/web

The main web application for account management. See [`apps/web/README.md`](apps/web/README.md) for detailed documentation.

### packages/auth-dashboard

Reusable Nuxt module for authentication and dashboard layout. See [`packages/auth-dashboard/README.md`](packages/auth-dashboard/README.md) for detailed documentation.

## Code Quality

This project enforces strict code quality standards:

- **Type Safety**: Strict TypeScript with type checking
- **Linting**: oxlint for fast linting, vue-tsc for Vue components
- **Formatting**: dprint for consistent code formatting
- **Security Scanning**: ast-grep for security and best practices
- **Git Hooks**: Lefthook for pre-commit checks
- **Testing**: Comprehensive test coverage with Vitest

### Rules

The project includes custom rules in the `rules/` directory:

- **ast-grep**: Structural code patterns
- **functional**: Functional programming best practices
- **package-json**: package.json standards
- **typescript**: TypeScript conventions
- **turborepo**: Turborepo configuration rules

## Deployment

### Cloudflare

The web application is deployed on Cloudflare using the Cloudflare Module preset:

```bash
# Build for production
bun build

# Deploy with Wrangler
bunx wrangler deploy
```

### Environment

- **Preset**: Cloudflare Module
- **Domain**: account.wrikka.com
- **Node Compat**: Enabled

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`bun verify`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT

## Support

For support, please open an issue in the GitHub repository or contact the team at admin@wrikka.com.
