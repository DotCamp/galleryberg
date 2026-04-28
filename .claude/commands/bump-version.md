Bump the plugin version to $ARGUMENTS and update the changelogs in both readme.txt files.

Follow these steps exactly:

## Step 1 — Validate the version

The new version is: **$ARGUMENTS**

Check that it matches the semver pattern `X.Y.Z` (digits only, three parts). If it doesn't, stop and tell the user the version format is invalid.

## Step 2 — Find commits since the last version bump

Run:
```
git log --oneline
```

Find the first (most recent) line that contains "bump version" — note its commit hash. Then collect all commit subjects since that hash:
```
git log --format="%s" <hash>..HEAD
```

From this list, remove any lines that contain:
- "bump version"
- "update changelog"
- "update readme"

These are the unreleased changes to include in the changelog.

## Step 3 — Read the current changelog for style reference

Read `packages/galleryberg-gallery-block/readme.txt` and look at the `== Changelog ==` section to see the existing entries. Use them as the exact style and tone reference.

The format is:
```
= X.Y.Z =

* FIX: Short description of a bug fix
* NEW: Short description of a new feature
* IMPROVE: Short description of an improvement
```

## Step 4 — Generate polished changelog entries

Using the raw commit messages from Step 2 and the style reference from Step 3, write a new changelog block for version $ARGUMENTS.

Rules:
- Use `* FIX:` for bug fixes (commits mentioning "fix", "Fixed", "broken", "not working", "issue", "bug")
- Use `* NEW:` for new features (commits starting with "add", "Added", "new", "introduce")
- Use `* IMPROVE:` for everything else (updates, changes, removals, refactors, improvements)
- Merge closely related commits into a single entry when they describe the same change
- Each entry must be concise — 10 words or fewer after the prefix
- Capitalize the first letter after the colon
- No trailing period
- If there are no commits (nothing since last bump), write a single `* IMPROVE: Minor improvements and fixes` entry

## Step 5 — Update all version files

Update these 6 files using the Edit tool. Replace the OLD version string with `$ARGUMENTS` in each location:

**1. `packages/galleryberg-gallery-block/package.json`**
- Change `"version": "X.X.X"` → `"version": "$ARGUMENTS"`

**2. `packages/galleryberg-gallery-block/galleryberg-gallery-block.php`**
- Change `Version: X.X.X` → `Version: $ARGUMENTS` (in the plugin header comment)
- Change `GALLERYBERG_BLOCKS_VERSION', 'X.X.X'` → `GALLERYBERG_BLOCKS_VERSION', '$ARGUMENTS'` (in the define call)

**3. `packages/galleryberg-gallery-block/readme.txt`**
- Change `Stable tag: X.X.X` → `Stable tag: $ARGUMENTS`
- Find `== Changelog ==` and insert the new changelog block (from Step 4) immediately after it, followed by a blank line before the next existing entry

**4. `packages/galleryberg-gallery-block-pro/package.json`**
- Change `"version": "X.X.X"` → `"version": "$ARGUMENTS"`

**5. `packages/galleryberg-gallery-block-pro/galleryberg-gallery-block-pro.php`**
- Change `Version: X.X.X` → `Version: $ARGUMENTS` (in the plugin header comment)

**6. `packages/galleryberg-gallery-block-pro/readme.txt`**
- Change `Stable tag: X.X.X` → `Stable tag: $ARGUMENTS`
- Find `== Changelog ==` and insert the same changelog block (from Step 4) immediately after it, followed by a blank line before the next existing entry

## Step 6 — Commit

Stage all 6 changed files and create a commit:
```
git add packages/galleryberg-gallery-block/package.json \
        packages/galleryberg-gallery-block/galleryberg-gallery-block.php \
        packages/galleryberg-gallery-block/readme.txt \
        packages/galleryberg-gallery-block-pro/package.json \
        packages/galleryberg-gallery-block-pro/galleryberg-gallery-block-pro.php \
        packages/galleryberg-gallery-block-pro/readme.txt
git commit -m "bump version to $ARGUMENTS and update changelog"
```

## Step 7 — Confirm

Print a summary showing:
- The new version: $ARGUMENTS
- The changelog entries that were added
- Confirmation that all 6 files were updated
- The git commit hash
