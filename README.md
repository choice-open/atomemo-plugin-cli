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
* [`atomemo auth login`](#atomemo-auth-login)
* [`atomemo auth status`](#atomemo-auth-status)
* [`atomemo autocomplete [SHELL]`](#atomemo-autocomplete-shell)
* [`atomemo help [COMMAND]`](#atomemo-help-command)
* [`atomemo plugin checksum [FILE]`](#atomemo-plugin-checksum-file)
* [`atomemo plugin init`](#atomemo-plugin-init)
* [`atomemo plugin pack [FILE]`](#atomemo-plugin-pack-file)
* [`atomemo plugin permission [FILE]`](#atomemo-plugin-permission-file)
* [`atomemo plugin refresh-key`](#atomemo-plugin-refresh-key)
* [`atomemo plugin run [FILE]`](#atomemo-plugin-run-file)
* [`atomemo version`](#atomemo-version)

## `atomemo auth login`

Uses device authorization flow to login with your Choiceform account by following these steps:

```
USAGE
  $ atomemo auth login

DESCRIPTION
  Uses device authorization flow to login with your Choiceform account by following these steps:

  1. Request a validation code automatically
  2. Show the validation code and a verification URL to the user
  3. Open the verification URL in the user's browser and paste the verification code
  4. Submit the validation code to complete the device authorization flow

EXAMPLES
  Login by using device authorization flow

    $ atomemo auth login
```

_See code: [src/commands/auth/login.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/auth/login.ts)_

## `atomemo auth status`

Display the current authentication status.

```
USAGE
  $ atomemo auth status

DESCRIPTION
  Display the current authentication status.

  Shows user information and session details if authenticated,
  or prompts to login if not yet authenticated.

EXAMPLES
  Check current authentication status

    $ atomemo auth status
```

_See code: [src/commands/auth/status.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/auth/status.ts)_

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

## `atomemo plugin checksum [FILE]`

describe the command here

```
USAGE
  $ atomemo plugin checksum [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ atomemo plugin checksum
```

_See code: [src/commands/plugin/checksum.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/plugin/checksum.ts)_

## `atomemo plugin init`

Initialize a new plugin with step-by-step interactive instructions.

```
USAGE
  $ atomemo plugin init [-i] [-n my-awesome-plugin] [-d Descriptive text...]
    [-u <value>] [-l elixir|python|typescript]

FLAGS
  -d, --description=Descriptive text...  Short description
  -i, --[no-]interactive                 Use interactive mode (by default)
  -l, --language=<option>                Programming language to use for plugin development
                                         <options: elixir|python|typescript>
  -n, --name=my-awesome-plugin           Plugin name
  -u, --url=<value>                      Repository URL

DESCRIPTION
  Initialize a new plugin with step-by-step interactive instructions.

  Providing required flags skips interactive flow and completes initialization in one go.

EXAMPLES
  Start with interactive initialization:

    $ atomemo plugin init
```

_See code: [src/commands/plugin/init.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/plugin/init.ts)_

## `atomemo plugin pack [FILE]`

describe the command here

```
USAGE
  $ atomemo plugin pack [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ atomemo plugin pack
```

_See code: [src/commands/plugin/pack.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/plugin/pack.ts)_

## `atomemo plugin permission [FILE]`

describe the command here

```
USAGE
  $ atomemo plugin permission [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ atomemo plugin permission
```

_See code: [src/commands/plugin/permission.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/plugin/permission.ts)_

## `atomemo plugin refresh-key`

Refresh or create API Key for plugin debugging in development stage.

```
USAGE
  $ atomemo plugin refresh-key

DESCRIPTION
  Refresh or create API Key for plugin debugging in development stage.

EXAMPLES
  $ atomemo plugin refresh-key
```

_See code: [src/commands/plugin/refresh-key.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/plugin/refresh-key.ts)_

## `atomemo plugin run [FILE]`

describe the command here

```
USAGE
  $ atomemo plugin run [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ atomemo plugin run
```

_See code: [src/commands/plugin/run.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.5.7/src/commands/plugin/run.ts)_

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
