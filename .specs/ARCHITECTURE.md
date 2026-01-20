# Atomemo Plugin CLI - Architecture

Choiceform Atomemo 平台的插件开发命令行工具。

> **最后更新**: 2025-01-19

## 概述

本项目是一个基于 [oclif](https://oclif.io/) 框架构建的 CLI 工具，用于创建、开发、打包和发布 Choiceform Atomemo 平台插件。

### 主要功能

| 功能 | 命令 | 状态 |
|------|------|------|
| 设备授权登录 | `atomemo auth login` | ✅ 完成 |
| 鉴权状态查询 | `atomemo auth status` | ✅ 完成 |
| 初始化插件项目 | `atomemo plugin init` | ✅ 完成 |
| 刷新调试密钥 | `atomemo plugin refresh-key` | ✅ 完成 |
| 校验和计算 | `atomemo plugin checksum` | 🚧 待实现 |
| 打包插件 | `atomemo plugin pack` | 🚧 待实现 |
| 权限管理 | `atomemo plugin permission` | 🚧 待实现 |
| 本地运行 | `atomemo plugin run` | 🚧 待实现 |

### 技术栈

| 层级 | 技术 |
|------|------|
| CLI 框架 | oclif v4 |
| 语言 | TypeScript (ESM) |
| 模板引擎 | Eta |
| 交互组件 | @inquirer/* |
| 数据验证 | Zod |
| 测试 | Mocha + Chai |
| 代码质量 | Biome |

## 目录结构

```
atomemo-plugin-cli/
├── bin/                    # CLI 入口脚本
│   ├── run.js              # 生产入口
│   └── dev.js              # 开发入口 (ts-node)
├── src/                    # 源代码
│   ├── index.ts            # 主入口
│   ├── commands/           # oclif 命令
│   │   ├── auth/           # 认证命令组
│   │   └── plugin/         # 插件命令组
│   ├── templates/          # Eta 模板
│   │   ├── common/         # 通用模板
│   │   └── typescript/     # TS 插件模板
│   └── utils/              # 工具模块
├── test/                   # 单元测试
│   ├── commands/
│   └── utils/
└── dist/                   # 编译输出
```

## 架构图

### 命令执行流程

```mermaid
---
config:
  theme: "neutral"
  themeVariables:
    fontFamily: Iosevka NFM
    fontSize: 14
---
flowchart TB
    subgraph Entry["入口层"]
        BIN["bin/run.js"]
        DEV["bin/dev.js"]
    end

    subgraph Core["oclif 核心"]
        OCLIF["@oclif/core"]
        DISCOVER["命令发现"]
        PARSE["参数解析"]
    end

    subgraph Commands["命令层"]
        AUTH_LOGIN["auth/login"]
        AUTH_STATUS["auth/status"]
        INIT["plugin/init"]
        REFRESH["plugin/refresh-key"]
        OTHER["plugin/*"]
    end

    subgraph Utils["工具层"]
        CONFIG["config.ts"]
        GEN["generator.ts"]
        THEME["theme.ts"]
    end

    subgraph External["外部服务"]
        ONEAUTH["OneAuth API"]
        HUB["Plugin Hub API"]
        FS["文件系统"]
    end

    BIN --> OCLIF
    DEV --> OCLIF
    OCLIF --> DISCOVER
    DISCOVER --> PARSE
    PARSE --> Commands

    AUTH_LOGIN --> CONFIG
    AUTH_LOGIN --> ONEAUTH
    AUTH_STATUS --> CONFIG
    AUTH_STATUS --> ONEAUTH
    REFRESH --> CONFIG
    REFRESH --> HUB
    REFRESH --> FS
    INIT --> GEN
    INIT --> THEME
    GEN --> FS
    CONFIG --> FS
```

### 模块依赖关系

```mermaid
---
config:
  theme: "neutral"
  themeVariables:
    fontFamily: Iosevka NFM
    fontSize: 14
---
flowchart LR
    subgraph Commands
        LOGIN["auth/login.ts"]
        STATUS["auth/status.ts"]
        INIT["plugin/init.ts"]
        REFRESH_KEY["plugin/refresh-key.ts"]
    end

    subgraph Utils
        CONFIG["config.ts"]
        GEN["generator.ts"]
        THEME["theme.ts"]
    end

    subgraph Templates
        COMMON["common/"]
        TS["typescript/"]
    end

    LOGIN --> CONFIG
    STATUS --> CONFIG
    REFRESH_KEY --> CONFIG
    INIT --> GEN
    INIT --> THEME
    GEN --> COMMON
    GEN --> TS
```

### 插件初始化流程

```mermaid
---
config:
  theme: "dark"
  themeVariables:
    fontFamily: Iosevka NFM
    fontSize: 14
---
sequenceDiagram
    participant User
    participant CLI as plugin init
    participant Inquirer as @inquirer/*
    participant Generator
    participant Eta
    participant FS as 文件系统

    User->>CLI: atomemo plugin init
    
    alt 交互模式
        CLI->>Inquirer: 收集插件信息
        Inquirer->>User: name, description, author...
        User->>Inquirer: 输入响应
        Inquirer->>CLI: 返回 flags
    end

    CLI->>Generator: createPluginGenerator("typescript", context)
    Generator->>Generator: groupPermissions()
    Generator->>Eta: 配置模板引擎
    
    loop 遍历模板目录
        Generator->>Eta: render(template, props)
        Eta->>Generator: 渲染内容
        Generator->>FS: writeFile()
    end

    CLI->>User: 项目创建完成
```

### 设备授权登录流程

```mermaid
---
config:
  theme: "dark"
  themeVariables:
    fontFamily: Iosevka NFM
    fontSize: 14
---
sequenceDiagram
    participant User
    participant CLI as auth login
    participant Config as config.ts
    participant OneAuth as OneAuth API
    participant Browser

    CLI->>Config: load()
    Config->>CLI: { auth: { endpoint } }
    
    CLI->>OneAuth: POST /v1/auth/device/code
    OneAuth->>CLI: device_code, user_code, verification_uri

    CLI->>User: 显示验证码和 URL
    
    opt 自动打开浏览器
        CLI->>Browser: open(verification_uri_complete)
    end

    loop 轮询令牌
        CLI->>OneAuth: POST /v1/auth/device/token
        alt authorization_pending
            OneAuth->>CLI: { error: "authorization_pending" }
            Note over CLI: 等待 5s 继续轮询
        else success
            OneAuth->>CLI: { access_token }
        end
    end

    CLI->>Config: update({ auth: { access_token } })
    CLI->>OneAuth: GET /v1/auth/get-session
    OneAuth->>CLI: { user: { name, email } }
    CLI->>User: 欢迎回来, {name}!
```

## 模块详情

各模块详细说明请参阅对应目录的 README.md:

| 目录 | 文档 |
|------|------|
| `src/` | [src/README.md](src/README.md) |
| `src/commands/` | [src/commands/README.md](src/commands/README.md) |
| `src/commands/auth/` | [src/commands/auth/README.md](src/commands/auth/README.md) |
| `src/commands/plugin/` | [src/commands/plugin/README.md](src/commands/plugin/README.md) |
| `src/utils/` | [src/utils/README.md](src/utils/README.md) |
| `test/` | [test/README.md](test/README.md) |
| `test/commands/` | [test/commands/README.md](test/commands/README.md) |
| `test/utils/` | [test/utils/README.md](test/utils/README.md) |

## 设计模式

### 1. 命令模式 (Command Pattern)

oclif 框架采用命令模式，每个命令是一个继承 `Command` 基类的类：

```typescript
export default class MyCommand extends Command {
  static description = "..."
  static flags = { ... }
  async run() { ... }
}
```

### 2. 工厂模式 (Factory Pattern)

`generator.ts` 使用工厂函数创建不同语言的生成器：

```typescript
createPluginGenerator(type, context) // -> PluginGenerator
```

### 3. 策略模式 (Strategy Pattern)

`PluginGenerator` 接口定义统一行为，不同语言实现各自策略：

```typescript
interface PluginGenerator {
  generate(): Promise<void>
}
```

## 配置文件

### oclif 配置 (`package.json`)

```json
{
  "oclif": {
    "bin": "atomemo",
    "commands": "./dist/commands",
    "plugins": [
      "@oclif/plugin-autocomplete",
      "@oclif/plugin-help",
      "@oclif/plugin-version"
    ],
    "topicSeparator": " "
  }
}
```

### 本地配置 (`~/.choiceform/atomemo.json`)

```json
{
  "auth": {
    "endpoint": "https://oneauth.choiceform.io",
    "access_token": "eyJ..."
  },
  "hub": {
    "endpoint": "https://automation-plugin-api.choiceform.io"
  }
}
```

## 待办事项

### 功能实现

- [ ] 实现 `plugin checksum` - 计算插件包校验和
- [ ] 实现 `plugin pack` - 打包插件为发布格式
- [ ] 实现 `plugin permission` - 交互式权限配置
- [ ] 实现 `plugin run` - 本地开发服务器
- [ ] 添加 `elixir` 插件模板
- [ ] 添加 `python` 插件模板

### 测试完善

- [ ] 添加 `auth login` 命令测试 (需 mock 网络和浏览器打开)
- [ ] 完善 `plugin init` 交互模式测试 (需 mock 用户输入)
- [x] 添加 `generator.ts` 单元测试 (已完成)
- [ ] 添加集成测试验证完整流程
- [ ] 添加 `auth` 命令组入口测试

### 代码改进

- [ ] `views.ts` 已弃用，考虑移除
- [ ] 考虑为 `TypeScriptPluginGenerator` 添加进度输出
- [ ] 统一错误处理策略
- [ ] 完善 `plugin init` 非交互模式的完整参数验证

### 文档

- [ ] 添加用户使用文档
- [ ] 添加插件开发指南
- [ ] 添加 API 参考文档
