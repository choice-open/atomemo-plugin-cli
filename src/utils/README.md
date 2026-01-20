# Utils

工具函数和共享模块目录，提供 CLI 核心功能的基础设施。

## 目录结构

```
utils/
├── config.ts      # 配置文件管理
├── generator.ts   # 插件项目代码生成器
├── theme.ts       # Inquirer 交互组件主题
└── views.ts       # Eta 模板引擎实例（已弃用）
```

## 模块说明

### `config.ts` - 配置管理

管理 CLI 的本地配置文件 (`~/.choiceform/atomemo.json`)，提供配置的加载、保存和更新功能。

**核心功能**：
- 配置文件路径管理（支持环境变量覆盖）
- 配置 Schema 验证（使用 Zod）
- 深度合并更新配置（使用 es-toolkit）

**配置结构**：
```typescript
{
  auth?: {
    endpoint?: string      // 认证服务端点
    access_token?: string  // 访问令牌
  },
  hub?: {
    endpoint?: string      // Hub API 端点
  }
}
```

**API 函数**：
- `load()` - 加载配置，不存在则创建默认配置
- `save(config)` - 保存配置（带 Schema 验证）
- `update(partial)` - 深度合并更新配置

**环境变量**：
- `CHOICEFORM_CONFIG_DIR` - 自定义配置目录（默认：`~/.choiceform`）
- `NODE_ENV=production` - 使用生产环境端点

**依赖关系**：
- `zod` - Schema 验证
- `es-toolkit` - 对象深度合并

### `generator.ts` - 代码生成器

插件项目代码生成器，使用工厂模式创建不同语言的生成器实例。

**核心接口**：
```typescript
interface PluginGenerator {
  type: string
  context: { props: Record<string, unknown>, target: string }
  renderer: Eta
  generate(): Promise<void>
}
```

**工厂函数**：
- `createPluginGenerator(type, context)` - 创建生成器实例
  - 目前仅支持 `"typescript"` 类型
  - 其他类型（`elixir`, `python`）抛出错误

**TypeScriptPluginGenerator**：
- 遍历 `common/` 和 `typescript/` 模板目录
- `.eta` 文件通过 Eta 模板引擎渲染
- 其他文件直接复制到目标目录
- 自动将权限列表按 scope 分组（如 `["http:read", "fs:write"]` → `[{scope: "http", entries: ["read"]}, {scope: "fs", entries: ["write"]}]`）

**依赖关系**：
- `eta` - 模板引擎
- `node:fs/promises` - 文件系统操作

### `theme.ts` - 交互主题

为 `@inquirer/*` 组件提供自定义图标和样式配置。

**导出主题**：
- `checkboxTheme` - 复选框主题（自定义图标：✔︎、空格、→）
- `selectTheme` - 选择器主题（数字索引模式）

**使用场景**：
- `plugin init` 命令的交互式输入
- 提供统一的 CLI 视觉体验

### `views.ts` - 模板引擎（已弃用）

⚠️ **已弃用**：此模块已不再使用，功能已迁移至 `generator.ts` 中的 `TypeScriptPluginGenerator.renderer`。

**建议**：考虑在后续版本中移除此文件。

## 模块依赖图

```
config.ts
  ├── zod (schema validation)
  └── es-toolkit (object merge)

generator.ts
  ├── eta (template engine)
  └── node:fs/promises (file operations)

theme.ts
  └── @inquirer/* (consumed by commands)
```

## 测试覆盖

- ✅ `config.ts` - 完整测试覆盖（加载、保存、更新、验证）
- ✅ `generator.ts` - 完整测试覆盖（工厂函数、文件生成、权限分组）
- ❌ `theme.ts` - 无测试（纯配置导出）
- ❌ `views.ts` - 无测试（已弃用）

## 相关文档

- [src/OVERVIEW.md](../OVERVIEW.md) - 源代码目录概览
- [src/commands/OVERVIEW.md](../commands/OVERVIEW.md) - 命令实现概览
