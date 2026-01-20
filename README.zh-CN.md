# Atomemo Plugin CLI

> 用于构建和发布 Choiceform Atomemo 插件的命令行工具。

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@choiceopen/atomemo-plugin-cli.svg)](https://npmjs.org/package/@choiceopen/atomemo-plugin-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@choiceopen/atomemo-plugin-cli.svg)](https://npmjs.org/package/@choiceopen/atomemo-plugin-cli)
[![License](https://img.shields.io/npm/l/@choiceopen/atomemo-plugin-cli.svg)](https://github.com/choice-open/atomemo-plugin-cli/blob/main/LICENSE)

**语言**: [English](README.md) | [简体中文](README.zh-CN.md)

## 功能特性

- 🔐 **身份认证**: 设备授权流程，安全登录
- 🚀 **插件初始化**: 交互式创建新的 Atomemo 插件
- 🔑 **API 密钥管理**: 刷新开发调试用的 API 密钥
- 📦 **插件管理**: 创建、开发和管理 Atomemo 插件
- 🌍 **多语言支持**: 支持 TypeScript、Python 和 Elixir（即将推出）

## 安装

```bash
npm install -g @choiceopen/atomemo-plugin-cli
```

或使用其他包管理器：

```bash
# 使用 yarn
yarn global add @choiceopen/atomemo-plugin-cli

# 使用 pnpm
pnpm add -g @choiceopen/atomemo-plugin-cli
```

## 快速开始

1. **登录您的 Choiceform 账户**:
   ```bash
   atomemo auth login
   ```

2. **创建新插件**:
   ```bash
   atomemo plugin init
   ```

3. **获取调试 API 密钥**:
   ```bash
   atomemo plugin refresh-key
   ```

## 使用方法

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

## 命令

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

使用设备授权流程登录您的 Choiceform 账户，步骤如下：

```
USAGE
  $ atomemo auth login

DESCRIPTION
  使用设备授权流程登录您的 Choiceform 账户，步骤如下：

  1. 自动请求验证码
  2. 向用户显示验证码和验证 URL
  3. 在用户的浏览器中打开验证 URL 并粘贴验证码
  4. 提交验证码以完成设备授权流程

EXAMPLES
  使用设备授权流程登录

    $ atomemo auth login
```

_查看代码: [src/commands/auth/login.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/auth/login.ts)_

## `atomemo auth status`

显示当前的身份认证状态。

```
USAGE
  $ atomemo auth status

DESCRIPTION
  显示当前的身份认证状态。

  如果已认证，显示用户信息和会话详情，
  如果尚未认证，则提示登录。

EXAMPLES
  检查当前身份认证状态

    $ atomemo auth status
```

_查看代码: [src/commands/auth/status.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/auth/status.ts)_

## `atomemo autocomplete [SHELL]`

显示自动补全安装说明。

```
USAGE
  $ atomemo autocomplete [SHELL] [-r]

ARGUMENTS
  [SHELL]  (zsh|bash|powershell) Shell 类型

FLAGS
  -r, --refresh-cache  刷新缓存（忽略显示说明）

DESCRIPTION
  显示自动补全安装说明。

EXAMPLES
  $ atomemo autocomplete

  $ atomemo autocomplete bash

  $ atomemo autocomplete zsh

  $ atomemo autocomplete powershell

  $ atomemo autocomplete --refresh-cache
```

_查看代码: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.39/src/commands/autocomplete/index.ts)_

## `atomemo help [COMMAND]`

显示 atomemo 的帮助信息。

```
USAGE
  $ atomemo help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  要显示帮助的命令。

FLAGS
  -n, --nested-commands  在输出中包含所有嵌套命令。

DESCRIPTION
  显示 atomemo 的帮助信息。
```

_查看代码: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.36/src/commands/help.ts)_

## `atomemo plugin checksum [FILE]`

描述命令内容

```
USAGE
  $ atomemo plugin checksum [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  要读取的文件

FLAGS
  -f, --force
  -n, --name=<value>  要打印的名称

DESCRIPTION
  描述命令内容

EXAMPLES
  $ atomemo plugin checksum
```

_查看代码: [src/commands/plugin/checksum.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/plugin/checksum.ts)_

## `atomemo plugin init`

使用分步交互式说明初始化新插件。

```
USAGE
  $ atomemo plugin init [-i] [-n my-awesome-plugin] [-d Descriptive text...]
    [-a John Doe] [-e john.doe@example.com] [-u <value>] [--locales en_US|zh_Hans|ja_JP...] [-l
    elixir|python|typescript] [-t extension|llm|tool|trigger]

FLAGS
  -a, --author=John Doe                  作者名称
  -d, --description=Descriptive text...  简短描述
  -e, --email=john.doe@example.com       作者邮箱地址
  -i, --[no-]interactive                 使用交互模式（默认）
  -l, --language=<option>                用于插件开发的编程语言
                                         <选项: elixir|python|typescript>
  -n, --name=my-awesome-plugin           插件名称
  -t, --type=<option>                    插件类型
                                         <选项: extension|llm|tool|trigger>
  -u, --url=<value>                      仓库 URL
      --locales=<option>...              提供哪些语言的 README
                                         <选项: en_US|zh_Hans|ja_JP>

DESCRIPTION
  使用分步交互式说明初始化新插件。

  提供必需的 flags 可跳过交互流程并一次性完成初始化。

EXAMPLES
  开始交互式初始化：

    $ atomemo plugin init
```

_查看代码: [src/commands/plugin/init.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/plugin/init.ts)_

## `atomemo plugin pack [FILE]`

描述命令内容

```
USAGE
  $ atomemo plugin pack [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  要读取的文件

FLAGS
  -f, --force
  -n, --name=<value>  要打印的名称

DESCRIPTION
  描述命令内容

EXAMPLES
  $ atomemo plugin pack
```

_查看代码: [src/commands/plugin/pack.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/plugin/pack.ts)_

## `atomemo plugin permission [FILE]`

描述命令内容

```
USAGE
  $ atomemo plugin permission [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  要读取的文件

FLAGS
  -f, --force
  -n, --name=<value>  要打印的名称

DESCRIPTION
  描述命令内容

EXAMPLES
  $ atomemo plugin permission
```

_查看代码: [src/commands/plugin/permission.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/plugin/permission.ts)_

## `atomemo plugin refresh-key`

刷新或创建用于开发阶段的插件调试 API 密钥。

```
USAGE
  $ atomemo plugin refresh-key

DESCRIPTION
  刷新或创建用于开发阶段的插件调试 API 密钥。

EXAMPLES
  $ atomemo plugin refresh-key
```

_查看代码: [src/commands/plugin/refresh-key.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/plugin/refresh-key.ts)_

## `atomemo plugin run [FILE]`

描述命令内容

```
USAGE
  $ atomemo plugin run [FILE] [-f] [-n <value>]

ARGUMENTS
  [FILE]  要读取的文件

FLAGS
  -f, --force
  -n, --name=<value>  要打印的名称

DESCRIPTION
  描述命令内容

EXAMPLES
  $ atomemo plugin run
```

_查看代码: [src/commands/plugin/run.ts](https://github.com/choice-open/atomemo-plugin-cli/blob/v0.3.0/src/commands/plugin/run.ts)_

## `atomemo version`

```
USAGE
  $ atomemo version [--json] [--verbose]

FLAGS
  --verbose  显示 CLI 的附加信息。

GLOBAL FLAGS
  --json  以 json 格式输出。

FLAG DESCRIPTIONS
  --verbose  显示 CLI 的附加信息。

    此外还显示架构、node 版本、操作系统以及 CLI 使用的插件版本。
```

_查看代码: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.36/src/commands/version.ts)_
<!-- commandsstop -->

## 系统要求

- Node.js >= 20.0.0
- npm、yarn 或 pnpm

## 开发

```bash
# 克隆仓库
git clone https://github.com/choice-open/atomemo-plugin-cli.git
cd atomemo-plugin-cli

# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
npm test

# 以开发模式运行 CLI
./bin/dev.js <command>
```

## 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m '添加一些很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 文档

- [架构文档](src/README.md)
- [命令文档](src/commands/README.md)
- [Changelog](CHANGELOG.md)

## 许可证

MIT © [Choiceform](https://github.com/choice-open)

## 相关项目

- [Choiceform Atomemo Platform](https://atomemo.choiceform.io)

## 支持

- 📖 [文档](https://github.com/choice-open/atomemo-plugin-cli)
- 🐛 [问题追踪](https://github.com/choice-open/atomemo-plugin-cli/issues)
- 💬 [讨论](https://github.com/choice-open/atomemo-plugin-cli/discussions)
