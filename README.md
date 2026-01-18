atomemo-plugin-cli
=================

A command-line utility for building and publishing Choiceform Atomemo Plugin.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/automation-plugin-cli.svg)](https://npmjs.org/package/automation-plugin-cli)
[![Downloads/week](https://img.shields.io/npm/dw/automation-plugin-cli.svg)](https://npmjs.org/package/automation-plugin-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @choiceopen/automation-plugin-cli
$ atomemo COMMAND
running command...
$ atomemo (--version)
@choiceopen/automation-plugin-cli/0.2.3 darwin-arm64 node-v24.13.0
$ atomemo --help [COMMAND]
USAGE
  $ atomemo COMMAND
...
```
<!-- usagestop -->
# Commands
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

_See code: [src/commands/auth/login.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/auth/login.ts)_

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

_See code: [src/commands/auth/status.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/auth/status.ts)_

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

_See code: [src/commands/plugin/checksum.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/plugin/checksum.ts)_

## `atomemo plugin init`

Initialize a new plugin with step-by-step interactive instructions.

```
USAGE
  $ atomemo plugin init [-i] [-n my-awesome-plugin] [-d Descriptive text...]
    [-a John Doe] [-e john.doe@example.com] [-u <value>] [--locales en_US|zh_Hans|ja_JP...] [-l
    elixir|python|typescript] [-t extension|llm|tool|trigger]

FLAGS
  -a, --author=John Doe                  Author name
  -d, --description=Descriptive text...  Short description
  -e, --email=john.doe@example.com       Author email address
  -i, --[no-]interactive                 Use interactive mode (by default)
  -l, --language=<option>                Programming language to use for plugin development
                                         <options: elixir|python|typescript>
  -n, --name=my-awesome-plugin           Plugin name
  -t, --type=<option>                    Plugin type
                                         <options: extension|llm|tool|trigger>
  -u, --url=<value>                      Repository URL
      --locales=<option>...              Provide READMEs in which languages
                                         <options: en_US|zh_Hans|ja_JP>

DESCRIPTION
  Initialize a new plugin with step-by-step interactive instructions.

  Providing required flags skips interactive flow and completes initialization in one go.

EXAMPLES
  Start with interactive initialization:

    $ atomemo plugin init
```

_See code: [src/commands/plugin/init.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/plugin/init.ts)_

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

_See code: [src/commands/plugin/pack.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/plugin/pack.ts)_

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

_See code: [src/commands/plugin/permission.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/plugin/permission.ts)_

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

_See code: [src/commands/plugin/refresh-key.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/plugin/refresh-key.ts)_

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

_See code: [src/commands/plugin/run.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.2.3/src/commands/plugin/run.ts)_

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
