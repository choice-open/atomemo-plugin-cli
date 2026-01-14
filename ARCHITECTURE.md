# Automation Plugin CLI - Architecture

Choiceform Automation 平台的插件开发命令行工具。

## 概述

本项目是一个基于 [oclif](https://oclif.io/) 框架构建的 CLI 工具，用于创建、开发、打包和发布 Choiceform Automation 平台插件。

### 主要功能

| 功能 | 命令 | 状态 |
|------|------|------|
| 设备授权登录 | `automation auth login` | ✅ 完成 |
| 初始化插件项目 | `automation plugin init` | ✅ 完成 |
| 校验和计算 | `automation plugin checksum` | 🚧 待实现 |
| 打包插件 | `automation plugin pack` | 🚧 待实现 |
| 权限管理 | `automation plugin permission` | 🚧 待实现 |
| 本地运行 | `automation plugin run` | 🚧 待实现 |

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
automation-plugin-cli/
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
        AUTH["auth/login"]
        INIT["plugin/init"]
        OTHER["plugin/*"]
    end

    subgraph Utils["工具层"]
        CONFIG["config.ts"]
        GEN["generator.ts"]
        THEME["theme.ts"]
    end

    subgraph External["外部服务"]
        ONEAUTH["OneAuth API"]
        FS["文件系统"]
    end

    BIN --> OCLIF
    DEV --> OCLIF
    OCLIF --> DISCOVER
    DISCOVER --> PARSE
    PARSE --> Commands

    AUTH --> CONFIG
    AUTH --> ONEAUTH
    INIT --> GEN
    INIT --> THEME
    GEN --> FS
    CONFIG --> FS
```

### 模块依赖关系

```mermaid
flowchart LR
    subgraph Commands
        LOGIN["auth/login.ts"]
        INIT["plugin/init.ts"]
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
    INIT --> GEN
    INIT --> THEME
    GEN --> COMMON
    GEN --> TS
```

### 插件初始化流程

```mermaid
sequenceDiagram
    participant User
    participant CLI as plugin init
    participant Inquirer as @inquirer/*
    participant Generator
    participant Eta
    participant FS as 文件系统

    User->>CLI: automation plugin init
    
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

各模块详细说明请参阅对应目录的 OVERVIEW.md:

| 目录 | 文档 |
|------|------|
| `src/` | [src/OVERVIEW.md](src/OVERVIEW.md) |
| `src/commands/` | [src/commands/OVERVIEW.md](src/commands/OVERVIEW.md) |
| `src/commands/auth/` | [src/commands/auth/OVERVIEW.md](src/commands/auth/OVERVIEW.md) |
| `src/commands/plugin/` | [src/commands/plugin/OVERVIEW.md](src/commands/plugin/OVERVIEW.md) |
| `src/templates/` | [src/templates/OVERVIEW.md](src/templates/OVERVIEW.md) |
| `src/utils/` | [src/utils/OVERVIEW.md](src/utils/OVERVIEW.md) |
| `test/` | [test/OVERVIEW.md](test/OVERVIEW.md) |

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
    "bin": "automation",
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
- [ ] 实现 `auth status` - 查看当前的鉴权状态
- [ ] 添加 `elixir` 插件模板
- [ ] 添加 `python` 插件模板

### 测试完善

- [ ] 添加 `auth login` 命令测试 (需 mock 网络)
- [ ] 完善 `plugin init` 交互模式测试
- [ ] 添加 `generator.ts` 单元测试
- [ ] 添加集成测试验证完整流程

### 代码改进

- [ ] `views.ts` 已弃用，考虑移除
- [ ] `plugin init` 的 `init.test.ts` 第二个测试断言为空，需修复
- [ ] 考虑为 `TypeScriptPluginGenerator` 添加进度输出
- [ ] 统一错误处理策略

### 文档

- [ ] 添加用户使用文档
- [ ] 添加插件开发指南
- [ ] 添加 API 参考文档
