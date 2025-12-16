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
$ npm install -g automation-plugin-cli
$ automation COMMAND
running command...
$ automation (--version)
automation-plugin-cli/0.0.0 darwin-arm64 node-v24.12.0
$ automation --help [COMMAND]
USAGE
  $ automation COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`automation hello PERSON`](#automation-hello-person)
* [`automation hello world`](#automation-hello-world)
* [`automation help [COMMAND]`](#automation-help-command)
* [`automation plugins`](#automation-plugins)
* [`automation plugins add PLUGIN`](#automation-plugins-add-plugin)
* [`automation plugins:inspect PLUGIN...`](#automation-pluginsinspect-plugin)
* [`automation plugins install PLUGIN`](#automation-plugins-install-plugin)
* [`automation plugins link PATH`](#automation-plugins-link-path)
* [`automation plugins remove [PLUGIN]`](#automation-plugins-remove-plugin)
* [`automation plugins reset`](#automation-plugins-reset)
* [`automation plugins uninstall [PLUGIN]`](#automation-plugins-uninstall-plugin)
* [`automation plugins unlink [PLUGIN]`](#automation-plugins-unlink-plugin)
* [`automation plugins update`](#automation-plugins-update)

## `automation hello PERSON`

Say hello

```
USAGE
  $ automation hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ automation hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `automation hello world`

Say hello world

```
USAGE
  $ automation hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ automation hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/choice-open/automation-plugin-cli/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `automation plugins`

List installed plugins.

```
USAGE
  $ automation plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ automation plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/index.ts)_

## `automation plugins add PLUGIN`

Installs a plugin into automation.

```
USAGE
  $ automation plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into automation.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the AUTOMATION_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AUTOMATION_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ automation plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ automation plugins add myplugin

  Install a plugin from a github url.

    $ automation plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ automation plugins add someuser/someplugin
```

## `automation plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ automation plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ automation plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/inspect.ts)_

## `automation plugins install PLUGIN`

Installs a plugin into automation.

```
USAGE
  $ automation plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into automation.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the AUTOMATION_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AUTOMATION_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ automation plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ automation plugins install myplugin

  Install a plugin from a github url.

    $ automation plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ automation plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/install.ts)_

## `automation plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ automation plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ automation plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/link.ts)_

## `automation plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ automation plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ automation plugins unlink
  $ automation plugins remove

EXAMPLES
  $ automation plugins remove myplugin
```

## `automation plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ automation plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/reset.ts)_

## `automation plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ automation plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ automation plugins unlink
  $ automation plugins remove

EXAMPLES
  $ automation plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/uninstall.ts)_

## `automation plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ automation plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ automation plugins unlink
  $ automation plugins remove

EXAMPLES
  $ automation plugins unlink myplugin
```

## `automation plugins update`

Update installed plugins.

```
USAGE
  $ automation plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/update.ts)_
<!-- commandsstop -->
