# Publishing Your Plugin

## Pre-Publishing Checklist

Before submitting, verify:

1. **Metadata** — `package.json` has accurate `name`, `version`, `description`, `author`
2. **Code quality** — No debug logs, no linting errors
3. **Security** — No hardcoded API keys or secrets (use Credentials instead)
4. **README** — Clear explanation of what the plugin does and how to configure it
5. **Version** — Increment `version` in `package.json` for updates to existing plugins

## Build for Release

```bash
bun run release
```

This single command:
- Validates all manifests
- Builds and bundles the plugin
- Syncs version numbers automatically

Do not manually edit build artifacts.

## Submission Steps

### Step 1: Fork the official plugins repository

Go to: https://github.com/choice-open/atomemo-official-plugins

Fork it to your account.

### Step 2: Add your plugin

Clone your fork, then add your plugin directory:

```
atomemo-official-plugins/
└── plugins/
    └── your-plugin-name/       ← add this directory
        ├── package.json
        ├── src/
        │   ├── index.ts
        │   ├── tools/
        │   ├── models/
        │   └── credentials/
        └── README.md
```

### Step 3: Submit a Pull Request

- **Title format**: `feat(plugin): add <your-plugin-name>`
- **Description**: Brief overview of what the plugin does

### Step 4: Automated Review

GitHub Actions runs: Lint → Build → Manifest validation.

Once automated checks pass and the team reviews, your PR merges and the plugin
becomes discoverable in the Atomemo marketplace.

## Updating a Published Plugin

1. Increment `version` in `package.json`
2. Make your changes
3. Run `bun run release`
4. Submit a new PR with the updated plugin directory

The marketplace detects new versions automatically after merge.
