# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.1] - 2026-01-14

### Added

- `AGENTS.md` – Agent guidelines for working in this repository, including build, test, and code style conventions.
- `CLAUDE.md` – Claude Code guidelines, including project overview, common commands, and architecture notes.

### Changed

- Renamed the CLI command from `automation` to `atomemo`.
- Updated project description from "Automation Plugin" to "Atomemo Plugin".
- Updated dependencies:
  - `@inquirer/checkbox`: ^5.0.3 → ^5.0.4
  - `@inquirer/input`: ^5.0.3 → ^5.0.4
  - `@inquirer/select`: ^5.0.3 → ^5.0.4
  - `oclif`: ^4.22.63 → ^4.22.65
- Updated architecture documentation and README to reflect the new project name.

## [0.1.3] - 2026-01-14

### Added

- `auth status` command – Check the current authentication status of the device and display user name, email, and session validity.

### Changed

- Updated architecture documentation to include `auth status` and `plugin refresh-key` commands.

## [0.1.0] - 2026-01-13

### Added

- `plugin refresh-key` command – Fetch or refresh the plugin debug API key and automatically write it into the `.env` file.
- Project architecture documentation (`ARCHITECTURE.md`) and `OVERVIEW.md` documentation for each module.

### Fixed

- Fixed handling of `undefined` permissions argument in the `TypeScriptPluginGenerator` constructor.

## [0.0.1] - 2026-01-10

### Added

- `auth login` command – Device authorization login based on OAuth 2.0 Device Authorization Flow.
- `plugin init` command – Interactive wizard for initializing a new plugin project.
- TypeScript plugin template generator with support for:
  - Basic plugin metadata (name, description, author)
  - Permission configuration (HTTP, database, filesystem, etc.)
  - License selection
  - Privacy policy generation
- Local configuration storage (`~/.choiceform/atomemo.json`).

### Infrastructure

- CLI scaffold built on the oclif v4 framework.
- Project file generation using the Eta template engine.
- Interactive prompts implemented with the `@inquirer/*` component suite.
- Data validation with Zod.
- Testing with Mocha + Chai.
- Code quality checks with Biome.
- Automated release workflow via GitHub Actions.

[Unreleased]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.1.3...v0.2.1
[0.1.3]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.1.0...v0.1.3
[0.1.0]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/choice-open/atomemo-plugin-cli/releases/tag/v0.0.1
