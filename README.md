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
@choiceopen/automation-plugin-cli/0.0.1-2 darwin-arm64 node-v24.12.0
$ automation --help [COMMAND]
USAGE
  $ automation COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`automation auth login`](#automation-auth-login)
* [`automation autocomplete [SHELL]`](#automation-autocomplete-shell)
* [`automation help [COMMAND]`](#automation-help-command)
* [`automation plugin checksum [FILE]`](#automation-plugin-checksum-file)
* [`automation plugin init`](#automation-plugin-init)
* [`automation plugin pack [FILE]`](#automation-plugin-pack-file)
* [`automation plugin permission [FILE]`](#automation-plugin-permission-file)
* [`automation plugin run [FILE]`](#automation-plugin-run-file)
* [`automation version`](#automation-version)

## `automation auth login`

Uses device authorization flow to login with your Choiceform account by following these steps:

```
USAGE
  $ automation auth login

DESCRIPTION
  Uses device authorization flow to login with your Choiceform account by following these steps:

  1. Request a validation code automatically
  2. Show the validation code and a verification URL to the user
  3. Open the verification URL in the user's browser and paste the verification code
  4. Submit the validation code to complete the device authorization flow

EXAMPLES
  Login by using device authorization flow

    $ automation auth login
```

_See code: [src/commands/auth/login.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.1-2/src/commands/auth/login.ts)_

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

## `automation plugin checksum [FILE]`

describe the command here

```
USAGE
  $ automation plugin checksum [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ automation plugin checksum
```

_See code: [src/commands/plugin/checksum.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.1-2/src/commands/plugin/checksum.ts)_

## `automation plugin init`

Initialize a new plugin with step-by-step interactive instructions.

```
USAGE
  $ automation plugin init [-i] [-n my-awesome-plugin] [-d Descriptive
    text...] [-a John Doe] [-e john.doe@example.com] [-u <value>] [--locales en_US|zh_Hans|ja_JP...] [-l
    elixir|python|typescript] [-t extension|llm|tool|trigger] [-p endpoints:register|model:call_llm|model:call_embedding
    |model:call_moderation|model:call_rerank|model:call_stt|model:call_tts|storage:kv|tools:invoke...]

FLAGS
  -a, --author=John Doe                  Author name
  -d, --description=Descriptive text...  Short description
  -e, --email=john.doe@example.com       Author email address
  -i, --[no-]interactive                 Use interactive mode (by default)
  -l, --language=<option>                Programming language to use for plugin development
                                         <options: elixir|python|typescript>
  -n, --name=my-awesome-plugin           Plugin name
  -p, --permissions=<option>...          Permissions required by the plugin
                                         <options:
                                         endpoints:register|model:call_llm|model:call_embedding|model:call_moderation|mo
                                         del:call_rerank|model:call_stt|model:call_tts|storage:kv|tools:invoke>
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

    $ automation plugin init
```

_See code: [src/commands/plugin/init.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.1-2/src/commands/plugin/init.ts)_

## `automation plugin pack [FILE]`

describe the command here

```
USAGE
  $ automation plugin pack [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ automation plugin pack
```

_See code: [src/commands/plugin/pack.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.1-2/src/commands/plugin/pack.ts)_

## `automation plugin permission [FILE]`

describe the command here

```
USAGE
  $ automation plugin permission [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ automation plugin permission
```

_See code: [src/commands/plugin/permission.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.1-2/src/commands/plugin/permission.ts)_

## `automation plugin run [FILE]`

describe the command here

```
USAGE
  $ automation plugin run [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ automation plugin run
```

_See code: [src/commands/plugin/run.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.1-2/src/commands/plugin/run.ts)_

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
