# Atomemo Plugin CLI

> A command-line utility for building and publishing Choiceform Atomemo plugins.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@choiceopen/atomemo-plugin-cli.svg)](https://npmjs.org/package/@choiceopen/atomemo-plugin-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@choiceopen/atomemo-plugin-cli.svg)](https://npmjs.org/package/@choiceopen/atomemo-plugin-cli)
[![License](https://img.shields.io/npm/l/@choiceopen/atomemo-plugin-cli.svg)](https://github.com/choice-open/atomemo-plugin-cli/blob/main/LICENSE)

## Features

- 🔐 **Authentication**: Device authorization flow for secure login
- 🚀 **Plugin Initialization**: Interactive setup for new Atomemo plugins
- 🔑 **API Key Management**: Refresh debug API keys for development
- 📦 **Plugin Management**: Create, develop, and manage Atomemo plugins
- 🌍 **Multi-language Support**: Support for TypeScript, Python, and Elixir (coming soon)

## Installation

```bash
npm install -g @choiceopen/atomemo-plugin-cli
```

Or using other package managers:

```bash
# Using yarn
yarn global add @choiceopen/atomemo-plugin-cli

# Using pnpm
pnpm add -g @choiceopen/atomemo-plugin-cli
```

## Quick Start

1. **Login to your Choiceform account**:
   ```bash
   atomemo auth login
   ```

2. **Create a new plugin**:
   ```bash
   atomemo plugin init
   ```

3. **Get your debug API key**:
   ```bash
   atomemo plugin refresh-key
   ```

## Usage

```sh-session
$ atomemo COMMAND
running command...
$ atomemo (--version)
@choiceopen/atomemo-plugin-cli/0.2.5 darwin-arm64 node-v24.13.0
$ atomemo --help [COMMAND]
USAGE
  $ atomemo COMMAND
...
```

## Commands

<!-- commands -->
* [`atomemo autocomplete [SHELL]`](#atomemo-autocomplete-shell)
* [`atomemo help [COMMAND]`](#atomemo-help-command)
* [`atomemo version`](#atomemo-version)

## `atomemo autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ atomemo autocomplete [SHELL] [-r]

ARGUMENTS
  [SHELL]  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ atomemo autocomplete

  $ atomemo autocomplete bash

  $ atomemo autocomplete zsh

  $ atomemo autocomplete powershell

  $ atomemo autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.39/src/commands/autocomplete/index.ts)_

## `atomemo help [COMMAND]`

Display help for atomemo.

```
USAGE
  $ atomemo help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for atomemo.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.36/src/commands/help.ts)_

## `atomemo version`

```
USAGE
  $ atomemo version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.36/src/commands/version.ts)_
<!-- commandsstop -->

## Requirements

- Node.js >= 20.0.0
- npm, yarn, or pnpm

## Development

```bash
# Clone the repository
git clone https://github.com/choice-open/atomemo-plugin-cli.git
cd atomemo-plugin-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run the CLI in development mode
./bin/dev.js <command>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

- [Architecture Documentation](src/README.md)
- [Command Documentation](src/commands/README.md)
- [Changelog](CHANGELOG.md)

## License

MIT © [Choiceform](https://github.com/choice-open)

## Related Projects

- [Choiceform Atomemo Platform](https://atomemo.choiceform.io)

## Support

- 📖 [Documentation](https://github.com/choice-open/atomemo-plugin-cli)
- 🐛 [Issue Tracker](https://github.com/choice-open/atomemo-plugin-cli/issues)
- 💬 [Discussions](https://github.com/choice-open/atomemo-plugin-cli/discussions)
