# Source Code (src/)

CLI 主要源代码目录。

## 目录结构

```
src/
├── index.ts          # CLI 入口点
├── commands/         # oclif 命令实现
│   ├── auth/        # 认证命令
│   └── plugin/      # 插件管理命令
└── utils/            # 共享工具模块
```

## 入口文件

`index.ts` 极其简洁，仅重导出 oclif 的 `run` 函数：

```typescript
export { run } from "@oclif/core"
```

实际命令发现和路由由 oclif 框架基于 `commands/` 目录结构自动处理。

## 子目录

| 目录 | 描述 | 详情 |
|------|------|------|
| [`commands/`](./commands/README.md) | CLI 命令实现 | oclif 约定式命令 |
| [`utils/`](./utils/README.md) | 工具函数 | 配置、生成器、主题 |

## 构建输出

通过 `tsc` 编译输出到 `dist/`，结构与 `src/` 镜像。

oclif 配置 (`package.json`):
```json
{
  "oclif": {
    "commands": "./dist/commands"
  }
}
```

## 模块依赖图

```
index.ts
    │
    └──> @oclif/core (run)
    
commands/
    ├── auth/
    │   ├── login.ts ──> utils/config.ts
    │   └── status.ts ──> utils/config.ts
    └── plugin/
        ├── init.ts ──> utils/generator.ts
        │              utils/theme.ts
        └── refresh-key.ts ──> utils/config.ts
                               │
                               └──> templates/ (via generator)
```

## 设计模式

### 命令模式 (Command Pattern)

oclif 框架采用命令模式，每个命令是一个继承 `Command` 基类的类。

### 工厂模式 (Factory Pattern)

`generator.ts` 使用工厂函数创建不同语言的生成器：
```typescript
createPluginGenerator(type, context) // -> PluginGenerator
```

### 策略模式 (Strategy Pattern)

`PluginGenerator` 接口定义统一行为，不同语言实现各自策略。

## 相关文档

- [commands/README.md](./commands/README.md) - 命令实现详情
- [utils/README.md](./utils/README.md) - 工具模块详情
- [../ARCHITECTURE.md](../ARCHITECTURE.md) - 项目架构文档
