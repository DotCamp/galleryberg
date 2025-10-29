# Galleryberg Gallery Block - Monorepo

A customizable gallery block for WordPress with both free and pro versions.

## 📦 Packages

This is a **monorepo** containing multiple packages managed with npm workspaces:

- **`@galleryberg/galleryberg-gallery-block`** (`packages/galleryberg-gallery-block/`) - Free version with tiles, masonry, justified, and square layouts
- **`@galleryberg/galleryberg-gallery-block-pro`** (`packages/galleryberg-gallery-block-pro/`) - Pro version with mosaic layout and premium features
- **`@galleryberg/shared`** (`packages/shared/`) - Shared components and utilities used by both versions

## 🚀 Quick Start

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install all dependencies and link workspace packages
pnpm install

# Start development for all workspaces (parallel)
pnpm start

# Start development for free version only
pnpm run start:galleryberg

# Start development for pro version only
pnpm run start:pro

# Build both versions
pnpm run build:all
```

## 📋 Available Commands

### Development

```bash
pnpm start                   # Start dev mode for all workspaces (parallel)
pnpm run start:galleryberg   # Start dev mode for free version only
pnpm run start:pro           # Start dev mode for pro version only
```

### Building

```bash
pnpm build                   # Build all workspaces (parallel)
pnpm run build:galleryberg   # Build free version only
pnpm run build:pro           # Build pro version only
pnpm run build:all           # Build both free and pro sequentially
```

### Linting & Formatting

```bash
pnpm run lint                # Lint all workspaces
pnpm run lint:js             # Lint JavaScript in all workspaces
pnpm run lint:css            # Lint CSS/SCSS in all workspaces
pnpm run format              # Format code in all workspaces
```

### Distribution

```bash
pnpm run zip:galleryberg     # Build and create ZIP for free version
pnpm run zip:pro             # Build and create ZIP for pro version
pnpm run zip:both            # Build and create ZIPs for both versions
pnpm run release             # Lint, build, and create ZIPs (full release)
```

ZIPs are created in the `releases/` folder:

- `galleryberg-gallery-block.zip` (Free version)
- `galleryberg-gallery-block-pro.zip` (Pro version)

### Cleanup

```bash
pnpm run clean               # Remove all node_modules, build folders, and pnpm-lock.yaml
pnpm run clean:build         # Remove only build folders
pnpm run clean:zip           # Remove ZIP files
```

## 🏗️ Project Structure

```
galleryberg-gallery-block/              # Monorepo root
├── packages/
│   ├── galleryberg-gallery-block/      # Free version
│   │   ├── src/
│   │   │   ├── gallery/                # Gallery block
│   │   │   └── image/                  # Image block
│   │   ├── assets/                     # Lightbox assets
│   │   ├── build/                      # Compiled files
│   │   ├── includes/                   # PHP helpers
│   │   ├── galleryberg-gallery-block.php
│   │   ├── readme.txt
│   │   └── package.json
│   │
│   ├── galleryberg-gallery-block-pro/  # Pro version
│   │   ├── src/
│   │   │   └── index.js                # Pro entry point
│   │   ├── includes/
│   │   │   ├── bootstrap.php           # Pro initialization
│   │   │   └── class-pro-features.php  # Pro features manager
│   │   ├── galleryberg-gallery-block-pro.php  # Pro main plugin file
│   │   └── package.json
│   │
│   └── shared/                         # Shared code
│       ├── src/
│       │   ├── components/             # Reusable UI components
│       │   ├── utils/                  # Styling helpers
│       │   └── index.js                # Shared exports
│       └── package.json
│
├── releases/                           # Distribution ZIPs
├── package.json                        # Root package.json
└── README.md                           # This file
```

## 🔧 How Workspaces Work

pnpm workspaces automatically link packages together:

```javascript
// In packages/galleryberg-gallery-block/src/gallery/inspector.js
import { BorderControl, ColorSettings } from "@galleryberg/shared";
// ↑ Automatically resolves to packages/shared/src/
```

When you run `pnpm install`:

1. All workspace dependencies are installed
2. Packages are symlinked together using `workspace:*` protocol
3. Shared dependencies are stored in a global content-addressable store
4. Hard links are created to save disk space

## 📝 Development Workflow

### Working on Free Version

```bash
# Start dev server
pnpm run start:galleryberg

# Make changes in packages/galleryberg-gallery-block/src/

# Build for production
pnpm run build:galleryberg

# Create distribution ZIP
pnpm run zip:galleryberg
```

### Working on Pro Version

```bash
# Start dev server
pnpm run start:pro

# Make changes in packages/galleryberg-gallery-block-pro/src/

# Build for production
pnpm run build:pro

# Create distribution ZIP
pnpm run zip:pro
```

### Adding Shared Components

1. Create component in `packages/shared/src/components/`
2. Export it in `packages/shared/src/index.js`
3. Use it in free or pro packages: `import { MyComponent } from '@galleryberg/shared'`

## 🔌 WordPress Integration

### Free Version Location

```
wp-content/plugins/galleryberg-gallery-block/
```

### Pro Version Location (when activated)

```
wp-content/plugins/galleryberg-gallery-block-pro/
```

### Symlinking for Development

You can symlink the packages to your WordPress plugins folder:

```bash
# Free version
ln -s /path/to/galleryberg-gallery-block/packages/galleryberg-gallery-block /path/to/wordpress/wp-content/plugins/galleryberg-gallery-block

# Pro version
ln -s /path/to/galleryberg-gallery-block/packages/galleryberg-gallery-block-pro /path/to/wordpress/wp-content/plugins/galleryberg-gallery-block-pro
```

## 📄 License

GPL-2.0-or-later

## 🤝 Contributing

1. Make changes in appropriate package
2. Run `npm run lint` to check for errors
3. Run `npm run build:all` to test builds
4. Create pull request

---

**Happy coding!** 🚀
