# Plugin Commands

插件管理命令模块，提供插件完整生命周期管理功能。

## 目录结构

```
plugin/
├── index.ts         # 命令组入口（隐藏命令，显示帮助信息）
├── init.ts          # 初始化插件项目 ✅
├── refresh-key.ts   # 刷新调试 API Key ✅
├── checksum.ts      # 计算插件包校验和 🚧
├── pack.ts          # 打包插件 🚧
├── permission.ts    # 管理插件权限 🚧
└── run.ts           # 本地运行/调试插件 🚧
```

## 模块说明

### `index.ts` - 命令组入口

隐藏命令，用于显示 `plugin` 命令组的帮助信息。用户执行 `atomemo plugin` 时会显示子命令列表。

**特性**：
- 支持 JSON 输出（`--json` flag）
- 自动调用 `help plugin` 显示子命令帮助

### `init.ts` - 插件初始化

交互式和非交互式两种模式创建新插件项目。

**交互模式**（默认）：
1. 收集插件信息：
   - `name` - 插件名称（4-64字符，小写字母开头，正则：`/^[a-z][a-z0-9_-]{2,62}[a-z0-9]$/`）
   - `description` - 简短描述（16-256字符）
   - `url` - 仓库地址（可选，URL 格式验证）
   - `language` - 开发语言（单选：elixir/python/typescript）

2. **自动获取用户信息**：
   - `author` 和 `email` 通过调用 `/v1/auth/get-session` API 自动获取
   - 如果获取失败（未登录或 token 无效），提示用户执行 `atomemo auth login` 并退出

3. **非交互模式**：
   - 通过命令行 flags 提供所有必需信息
   - 如果提供了有效的 `--name`，自动禁用交互模式
   - 如果未提供有效信息且禁用交互模式，显示错误并退出

4. **代码生成**：
   - 在生成代码前，调用 `fetchSession()` 获取用户信息
   - 将 `user.name` 作为 `author`，`user.email` 作为 `email` 添加到 props
   - 使用 `createPluginGenerator()` 创建生成器
   - 添加时间戳和日期信息到 props
   - 调用 `generator.generate()` 生成项目文件

**依赖关系**：
- `../../utils/generator.js` - 代码生成器
- `../../utils/config.js` - 配置加载（获取 access_token）
- `../../utils/theme.js` - 交互主题
- `@inquirer/*` - 交互式输入组件
- `zod` - URL 验证

### `refresh-key.ts` - 刷新调试 API Key

获取或刷新插件开发调试所需的 API Key，并更新到项目的 `.env` 文件中。

**执行流程**：

1. **检查认证状态**
   - 验证本地配置中是否存在 `access_token`
   - 未认证时提示用户先执行 `atomemo auth login`

2. **获取用户会话信息**
   - 调用 `/v1/auth/get-session` 获取当前用户会话
   - 使用 Bearer Token 认证
   - 处理 401 错误（令牌无效）
   - 检查用户的 `inherentOrganizationId` 是否存在
   - 如果 `inherentOrganizationId` 不存在，显示错误消息并提示用户去 Choiceform Discord 频道提交问题报告，然后退出

3. **获取 API Key**
   - 调用 `/api/v1/debug_api_key` 获取调试 API Key
   - 使用 Bearer Token 认证
   - 处理 401 错误（令牌无效）

4. **更新 .env 文件**
   - 检查当前目录是否存在 `.env` 文件
   - 如果存在 `DEBUG_API_KEY`，替换其值；否则追加
   - 如果存在 `ORGANIZATION_ID`，替换其值；否则追加
   - 处理文件权限错误

5. **显示结果**
   - 显示成功消息
   - 显示 `DEBUG_API_KEY` 和 `ORGANIZATION_ID` 已更新的提示
   - 显示 API Key 预览（前4位 + ... + 后4位）

**依赖关系**：
- `../../utils/config.js` - 配置加载
- `node:fs/promises` - 文件系统操作

### `checksum.ts` - 计算插件包校验和 🚧

**状态**：待实现（当前为占位符实现）

**预期功能**：
- 计算插件包的校验和（SHA-256）
- 用于验证插件包的完整性

### `pack.ts` - 打包插件 🚧

**状态**：待实现（当前为占位符实现）

**预期功能**：
- 将插件项目打包为发布格式
- 生成插件清单文件
- 压缩为可分发的包文件

### `permission.ts` - 管理插件权限 🚧

**状态**：待实现（当前为占位符实现）

**预期功能**：
- 交互式配置插件权限
- 管理权限列表（scope:entry 格式）
- 更新插件清单中的权限声明

### `run.ts` - 本地运行/调试插件 🚧

**状态**：待实现（当前为占位符实现）

**预期功能**：
- 启动本地开发服务器
- 连接到 Plugin Hub 服务
- 支持热重载和调试

## 命令映射

| 命令 | 文件 | 状态 | 描述 |
|------|------|------|------|
| `atomemo plugin` | `index.ts` | ✅ | 显示 plugin 命令组帮助 |
| `atomemo plugin init` | `init.ts` | ✅ | 交互式创建新插件 |
| `atomemo plugin refresh-key` | `refresh-key.ts` | ✅ | 刷新调试 API Key |
| `atomemo plugin checksum` | `checksum.ts` | 🚧 | 计算插件包校验和 |
| `atomemo plugin pack` | `pack.ts` | 🚧 | 打包插件 |
| `atomemo plugin permission` | `permission.ts` | 🚧 | 管理插件权限 |
| `atomemo plugin run` | `run.ts` | 🚧 | 本地运行/调试插件 |

## API 端点

### OneAuth API

- `GET /v1/auth/get-session` - 获取用户会话信息
  - 认证：Bearer Token
  - 返回：`{ user: { name: string, email: string, inherentOrganizationId?: string }, session: {...} }`
  - 用途：
    - `init.ts` 中用于获取 `author` 和 `email`
    - `refresh-key.ts` 中用于获取用户的组织 ID

### Plugin Hub API

- `GET /api/v1/debug_api_key` - 获取调试 API Key
  - 认证：Bearer Token
  - 返回：`{ api_key: string }`
  - 有效期：1 天

## 测试覆盖

- ✅ `index.ts` - 基础测试（显示帮助信息）
- ✅ `init.ts` - 部分测试（非交互模式、名称验证）
- ✅ `refresh-key.ts` - 全面测试覆盖（所有场景）
- ❌ `checksum.ts` - 无测试（待实现）
- ❌ `pack.ts` - 无测试（待实现）
- ❌ `permission.ts` - 无测试（待实现）
- ❌ `run.ts` - 无测试（待实现）

## 相关文档

- [src/commands/OVERVIEW.md](../OVERVIEW.md) - 命令实现概览
- [src/utils/OVERVIEW.md](../../utils/OVERVIEW.md) - 工具模块概览
