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
@choiceopen/automation-plugin-cli/0.2.2 linux-x64 node-v20.19.6
$ atomemo --help [COMMAND]
USAGE
  $ atomemo COMMAND
...
```
<!-- usagestop -->
# Commands
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
