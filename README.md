automation-plugin-cli
=================

A command-line utility for building and publishing Choiceform Automation Plugin.


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
$ automation COMMAND
running command...
$ automation (--version)
@choiceopen/automation-plugin-cli/0.1.2 linux-x64 node-v20.19.6
$ automation --help [COMMAND]
USAGE
  $ automation COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`automation autocomplete [SHELL]`](#automation-autocomplete-shell)
* [`automation help [COMMAND]`](#automation-help-command)
* [`automation version`](#automation-version)

## `automation autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ automation autocomplete [SHELL] [-r]

ARGUMENTS
  [SHELL]  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ automation autocomplete

  $ automation autocomplete bash

  $ automation autocomplete zsh

  $ automation autocomplete powershell

  $ automation autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.39/src/commands/autocomplete/index.ts)_

## `automation help [COMMAND]`

Display help for automation.

```
USAGE
  $ automation help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for automation.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.36/src/commands/help.ts)_

## `automation version`

```
USAGE
  $ automation version [--json] [--verbose]

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
