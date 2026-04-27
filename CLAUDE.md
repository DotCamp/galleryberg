# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Development (watch mode)
pnpm start                   # All packages in parallel
pnpm run start:galleryberg   # Free block only
pnpm run start:pro           # Pro block only
pnpm run start:admin         # Admin UI only (uses Vite)

# Production build
pnpm run build:all           # Sequential: admin → free → pro (required for ZIPs)
pnpm run build:galleryberg
pnpm run build:pro
pnpm run build:admin

# Linting & formatting
pnpm run lint
pnpm run lint:js
pnpm run lint:css
pnpm run format

# Distribution
pnpm run zip:galleryberg     # Build and zip free version → releases/galleryberg-gallery-block.zip
pnpm run zip:pro             # Build and zip pro version → releases/galleryberg-gallery-block-pro.zip
pnpm run release             # lint + build:all + zip:both
```

## Architecture

This is a **pnpm monorepo** with four packages:

| Package | Path | Build tool | Purpose |
|---|---|---|---|
| `@galleryberg/galleryberg-gallery-block` | `packages/galleryberg-gallery-block/` | `@wordpress/scripts` (webpack) | Free WordPress plugin |
| `@galleryberg/galleryberg-gallery-block-pro` | `packages/galleryberg-gallery-block-pro/` | `@wordpress/scripts` (webpack) | Pro WordPress plugin |
| `@galleryberg/shared` | `packages/shared/` | `@wordpress/scripts` | Shared React components & utilities |
| `@galleryberg/admin` | `packages/galleryberg-admin/` | Vite | Admin settings page (React SPA) |

### Block structure

There are two registered blocks: **`galleryberg/gallery`** (container) and **`galleryberg/image`** (inner block). The gallery block uses `useInnerBlocksProps` — images are stored as real inner blocks, not an attribute array.

Each block has the typical `@wordpress/scripts` layout:
- `block.json` — block metadata, attributes, context, scripts
- `edit.js` — editor component
- `save.js` — serialized save (gallery delegates rendering to `render.php`)
- `render.php` — server-side render (gallery block)
- `inspector.js` — `InspectorControls` sidebar
- `view.js` — frontend script (lightbox initialization via GLightbox)

### Pro plugin extension pattern

The pro plugin (`packages/galleryberg-gallery-block-pro/src/index.js`) does **not** replace blocks — it extends them via WordPress filter hooks:

1. `blocks.registerBlockType` → `addProAttributes` adds extra attributes (`enableLazyLoading`, `enableThumbnails`, `mosaicSpanX/Y`, etc.) to both blocks.
2. `editor.BlockEdit` → `withProInspectorControls` wraps the edit component for `galleryberg/gallery` and `galleryberg/image`, injecting pro UI via render props (`EnableLazyLoading`, `EnableThumbnails`, etc. passed as JSX nodes).
3. PHP hooks (`galleryberg_pro_layouts`, `galleryberg_pro_gallery_classes`, `galleryberg_pro_gallery_data_attributes`) allow the pro plugin to extend the PHP render output.

Pro features are gated by `window.gallerybergSettings?.isPremium` on the JS side.

### Context passing (gallery → image)

The gallery block declares `providesContext` in `block.json` to push attributes (`layout`, `justifiedRowHeight`, `blockSpacing`, `imagesBorderRadius`, caption settings, hover effects, etc.) down to child image blocks. The image block reads these via `context` prop and applies them as fallbacks when the image-level attribute is empty.

### Styling utilities (`@galleryberg/shared`)

`packages/shared/src/utils/styling-helpers.js` exports functions used in both JS (editor) and mirrored in PHP (`Styling_Helpers.php`):
- `generateStyles` — filters out empty/undefined values before passing to `style` prop
- `getSpacingPresetCssVar` — converts `var:preset|spacing|N` tokens to `--wp--preset--spacing--N` CSS vars
- `getBorderCSS` / `getSingleSideBorderValue` — normalizes unified vs split-border objects
- `getBackgroundColorVar` — picks color or gradient for `background` CSS

The PHP class `Galleryberg\Helpers\Styling_Helpers` mirrors these functions for `render.php`.

### Admin UI

`packages/galleryberg-admin/` is a standalone React SPA built with Vite. Its output goes directly into `packages/galleryberg-gallery-block/includes/Admin/assets/`. It is **not** a WordPress block; it renders into a `<div>` on the admin settings page managed by `Galleryberg\Admin\Galleryberg_Admin`.

### Upsell / locked controls

`packages/galleryberg-gallery-block/src/components/upsell/LockedControl.js` wraps a disabled control with an upgrade prompt. In `inspector.js`, locked controls are shown when `proLayouts.length === 0 && !isPro` — this lets the free plugin display "teaser" controls for pro features.

### Lightbox

The frontend (`view.js`) initializes GLightbox after DOMContentLoaded. Lightbox instances are stored on `window.gallerybergLightboxes` (a `Map`) so the pro plugin can access them. Overlay captions (`.caption-type-full-overlay`, `.caption-type-bar-overlay`) get their own click handler to forward clicks to the lightbox since they sit above the image in the DOM.

### Responsive columns

Column counts (desktop/tablet/mobile) are stored in separate attributes (`columns`, `tabletColumns`, `mobileColumns`). In the editor, `edit.js` syncs with Gutenberg's device preview type via `@wordpress/editor`'s `getDeviceType`. In `render.php`, tablet/mobile values are emitted as CSS custom properties (`--galleryberg-tablet-columns`, `--galleryberg-mobile-columns`) for CSS-based responsive behaviour.

### Versioning

Version strings must be updated in sync across:
- `packages/galleryberg-gallery-block/package.json`
- `packages/galleryberg-gallery-block/galleryberg-gallery-block.php` (plugin header + `GALLERYBERG_BLOCKS_VERSION`)
- `packages/galleryberg-gallery-block-pro/package.json`
- `packages/galleryberg-gallery-block-pro/galleryberg-gallery-block-pro.php`
