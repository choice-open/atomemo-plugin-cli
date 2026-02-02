# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.5.11] - 2026-02-02

### Changed

- 更新插件模板依赖版本：
  - `zod`: ^4.3.5 → ^4.3.6
  - `@biomejs/biome`: ^2.3.11 → ^2.3.13
  - `@types/bun`: ^1.3.6 → ^1.3.8
  - `tsdown`: ^0.19.0 → ^0.20.1
  - `vitest`: ^4.0.17 → ^4.0.18

## [0.5.10] - 2026-02-02

### Changed

- 优化 README.md 文档，增加详细的命令说明和使用示例

## [0.5.9] - 2026-02-02

### Changed

- 模板重构：`demoTool` 的 `invoke` 方法改为使用结构化的 `ToolArgs` 接口，提升类型安全性

## [0.5.8] - 2026-02-02

### Added

- `plugin init` 命令现在会自动从用户会话中获取 `organizationId` 并写入 `.env` 文件
- 插件模板新增 `lang` 属性配置
- 新增 `.env.eta` 模板，包含 `HUB_WS_URL` 默认值

### Changed

- 环境变量重命名：
  - `DEBUG_API_KEY` → `HUB_DEBUG_API_KEY`
  - `ORGANIZATION_ID` → `HUB_ORGANIZATION_ID`

### Breaking Changes

- 环境变量名称已更改，使用旧版本创建的插件需要手动更新 `.env` 文件中的变量名

## [0.5.7] - 2026-01-21

### Added

- `plugin init` 命令现在会在创建插件前检查当前路径下是否存在同名文件夹
- 如果文件夹已存在，会显示红色警告信息并停止操作，防止意外覆盖已存在的文件

## [0.5.6] - 2026-01-21

### Fixed

- 更新 `createPlugin` 调用为异步方法（添加 `await` 关键字）
- 移除 tsdown 配置中未使用的 `platform: "neutral"` 选项

## [0.5.5] - 2026-01-21

### Fixed

- 修复模板中 `repo` 字段缺少引号的问题

### Changed

- 更新 README.md，添加完整的命令文档

## [0.5.4] - 2026-01-21

### Changed

- 更新 README.md，添加完整的命令文档
- 提升版本号至 0.5.4

## [0.5.3] - 2026-01-21

### Changed

- 重命名 SDK 从 `@choiceopen/automation-plugin-sdk-js` 到 `@choiceopen/atomemo-plugin-sdk-js`
- 优化插件初始化命令交互流程
- 简化 package.json 模板配置
- 增强会话管理和认证机制
- 更新插件元数据配置选项

## [0.5.2] - 2026-01-21

### Fixed

- Build script now removes `tsconfig.tsbuildinfo` file before compilation to ensure clean builds
- Updated project architecture documentation date in template from 2026-01-18 to 2026-01-01

## [0.5.1] - 2026-01-21

### Changed

- Updated template package URLs to use `props.url` instead of constructing from `props.author` and `props.name`
- Changed `@choiceopen/atomemo-plugin-sdk-js` dependency version from `^0.1.0` to `latest` in template
- Updated template architecture documentation to reflect SDK name change from `automation` to `atomemo`

## [0.5.0] - 2026-01-21

### Added

- `plugin init` command now automatically fetches author name and email from authenticated user session

### Changed

- `plugin init` command now requires authentication before generating templates
- Removed interactive prompts for author name and email (now automatically populated from session)
- Removed command-line flags: `--author`, `--email`, `--locales`, `--type`
- Simplified template generation workflow by removing redundant user inputs
- Updated template documents structure (moved `src/README.md.eta` to `src/README.md`)

### Breaking Changes

- `plugin init` command now requires a valid authenticated session. Users must run `auth login` before using this command.
- Command-line flags (`--author`, `--email`, `--locales`, `--type`) have been removed and will no longer be accepted.

## [0.4.0] - 2026-01-20

### Added

- `plugin refresh-key` command now fetches user session information from OneAuth API
- `plugin refresh-key` command now writes `ORGANIZATION_ID` to `.env` file along with `DEBUG_API_KEY`
- Error handling for missing `inherentOrganizationId` with user-friendly message directing to Discord support channel
- Comprehensive test coverage for new functionality including session fetching and organization ID validation

### Changed

- `plugin refresh-key` command now validates user's `inherentOrganizationId` before fetching debug API key
- `updateEnvFile` method now handles both `DEBUG_API_KEY` and `ORGANIZATION_ID` environment variables

### Breaking Changes

- `plugin refresh-key` command now requires `inherentOrganizationId` to be present in the user session. If it's missing, the command will exit with an error message directing users to the Choiceform Discord channel for support.

## [0.3.0] - 2026-01-20

### Added

- Comprehensive documentation structure with README files for all modules
- Chinese language README (`README.zh-CN.md`) for better localization support
- Module-level documentation:
  - `src/README.md` – Architecture documentation
  - `src/commands/README.md` – Command documentation
  - `src/commands/auth/README.md` – Authentication commands documentation
  - `src/commands/plugin/README.md` – Plugin commands documentation
  - `src/utils/README.md` – Utility functions documentation
  - `test/README.md` – Testing documentation
  - `test/commands/README.md` – Command tests documentation
  - `test/utils/README.md` – Utility tests documentation

### Changed

- Moved architecture documentation from `ARCHITECTURE.md` to `.specs/ARCHITECTURE.md`
- Moved specification files from `specs/` to `.specs/` directory
- Renamed template files to remove `.md` suffix:
  - `LICENSE.md.eta` → `LICENSE.eta`
  - `PRIVACY.md.eta` → `PRIVACY.eta`
- Updated TypeScript template configuration files
- Enhanced README with comprehensive command documentation

### Removed

- `AGENTS.md` – Agent guidelines (consolidated into other documentation)
- `CLAUDE.md` – Claude Code guidelines (consolidated into other documentation)

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

[Unreleased]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.11...HEAD
[0.5.11]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.10...v0.5.11
[0.5.10]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.9...v0.5.10
[0.5.9]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.8...v0.5.9
[0.5.8]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.7...v0.5.8
[0.5.7]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.6...v0.5.7
[0.5.6]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.5...v0.5.6
[0.5.5]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.4...v0.5.5
[0.5.4]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.3...v0.5.4
[0.5.3]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.1.3...v0.2.1
[0.1.3]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.1.0...v0.1.3
[0.1.0]: https://github.com/choice-open/atomemo-plugin-cli/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/choice-open/atomemo-plugin-cli/releases/tag/v0.0.1
