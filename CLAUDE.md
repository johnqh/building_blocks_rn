# CLAUDE.md

## Project Overview

**@sudobility/building_blocks_rn** - Higher-level shared UI building blocks for Sudobility React Native apps.

- **Type**: React Native component library
- **License**: BUSL-1.1

## Package Manager

**This project uses Bun as the package manager.** Always use `bun` commands instead of `npm`:

```bash
# Install dependencies
bun install

# Run any script
bun run <script-name>
```

## Development Commands

```bash
bun run build        # Build TypeScript to dist/
bun run dev          # Watch mode build
bun run clean        # Remove dist/
bun run typecheck    # TypeScript check (no emit)
bun run test         # Run tests
bun run prepublishOnly  # Build before publish
```

## Architecture

- **Language**: TypeScript with React Native
- **Build**: TypeScript compiler (`tsc`)
- **Output**: ESM (`dist/`)
- **Exports**: Main entry (`index.ts`) and Firebase entry (`firebase.ts`)

### Key Modules

- `src/app/` - App shell components (SudobilityAppRN)
- `src/components/header/` - App header
- `src/components/footer/` - App footer
- `src/components/layout/` - Screen layout components
- `src/components/pages/` - Login, text screens
- `src/components/settings/` - Appearance, language, settings list
- `src/components/subscription/` - Subscription management
- `src/components/toast/` - Toast notifications
- `src/hooks/` - Custom hooks (useResponsive)
- `src/theme/` - Theme context, colors, spacing, typography
- `src/i18n/` - Internationalization setup
- `src/api/` - API context

### Peer Dependencies

React, React Native, React Navigation, i18next, and AsyncStorage are peer dependencies - they must be provided by the consuming app.
