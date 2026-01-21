# Plugin Command Tests

`plugin` 命令组的单元测试。

## 目录结构

```
plugin/
├── index.test.ts         # plugin 命令组入口测试
├── init.test.ts         # plugin init 命令测试
├── refresh-key.test.ts  # plugin refresh-key 命令测试
├── checksum.test.ts     # plugin checksum 命令测试（占位）
├── pack.test.ts         # plugin pack 命令测试（占位）
├── permission.test.ts    # plugin permission 命令测试（占位）
└── run.test.ts          # plugin run 命令测试（占位）
```

## 测试文件

| 文件 | 测试对象 | 覆盖状态 |
|------|----------|----------|
| `index.test.ts` | `plugin` 命令组入口 | ✅ 基础覆盖 |
| `init.test.ts` | `plugin init` 命令 | ⚠️ 部分覆盖 |
| `refresh-key.test.ts` | `plugin refresh-key` 命令 | ✅ 全面覆盖 |
| `checksum.test.ts` | `plugin checksum` 命令 | 🚧 占位测试 |
| `pack.test.ts` | `plugin pack` 命令 | 🚧 占位测试 |
| `permission.test.ts` | `plugin permission` 命令 | 🚧 占位测试 |
| `run.test.ts` | `plugin run` 命令 | 🚧 占位测试 |

## 测试详情

### `index.test.ts` - 命令组入口测试

**测试场景**：
- ✅ 运行 `plugin` 命令应显示主题帮助信息
- ✅ 验证输出包含 "Manages your plugin via subcommands"

### `init.test.ts` - 插件初始化测试

**测试设置**：
- 使用临时目录作为工作目录
- 每个测试前后切换工作目录并清理

**覆盖场景**：

**`--no-interactive` 模式**：
- ✅ 无参数时显示帮助消息
- ✅ 名称过短（`abc`）时显示错误
- ✅ 名称以数字开头（`1plugin`）时显示错误
- ✅ 名称以连字符结尾（`my-plugin-`）时显示错误

**非交互式完整参数**：
- ✅ 提供有效名称时自动禁用交互模式
- ✅ 验证插件目录已创建
- ✅ 支持 `--description` / `--url` flag

**认证依赖**：
- ✅ 会 mock `/v1/auth/get-session` 获取 `author/email`
- ✅ 未登录/令牌无效/接口失败时提示执行 `atomemo auth login` 并退出

**名称验证规则**：
- ✅ 接受小写字母和数字
- ✅ 接受下划线
- ✅ 接受连字符

**缺失测试**：
- ❌ 完整交互流程（需要 mock 用户输入）
- ❌ 非交互式“更复杂参数组合”的覆盖（可按需补充）

### `refresh-key.test.ts` - 刷新 API Key 测试

**测试设置**：
- 使用临时目录和配置文件
- 使用 MSW (Mock Service Worker) mock 网络请求
- 每个测试前后清理临时文件

**覆盖场景**：
- ✅ 缺少访问令牌时显示错误提示
- ✅ 访问令牌无效（401）时显示错误
- ✅ `inherentOrganizationId` 不存在时提示去 Discord 频道
- ✅ 创建新的 .env 文件（同时写入 `DEBUG_API_KEY` 和 `ORGANIZATION_ID`）
- ✅ 更新现有的 `DEBUG_API_KEY`
- ✅ 更新现有的 `ORGANIZATION_ID`
- ✅ 在现有文件追加 `DEBUG_API_KEY` 和 `ORGANIZATION_ID`（当不存在时）
- ✅ 正确掩码显示 API Key

**技术细节**：
- 使用 `setupServer` 创建 mock 服务器
- Mock `/v1/auth/get-session` 端点（获取用户会话）
- Mock `/api/v1/debug_api_key` 端点（获取 API Key）
- 验证 .env 文件内容（包含两个环境变量）

### 占位测试 (checksum/pack/permission/run)

当前仅测试命令是否输出 "hello world"，对应命令实现为 scaffold 占位代码。这些测试将在命令实现完成后更新。

## 测试框架

- **Mocha** - 测试运行器
- **Chai** - 断言库（expect 风格）
- **@oclif/test** - oclif 命令测试工具
- **MSW** - Mock Service Worker（用于 mock 网络请求）

## 测试模式

```typescript
import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin init", () => {
  it("creates plugin with valid name", async () => {
    const { stdout } = await runCommand("plugin init --name my-plugin --language typescript")
    expect(stdout).to.contain("Congratulation")
  })
})
```

## 相关文档

- [test/commands/README.md](../README.md) - 命令测试概览
- [src/commands/plugin/README.md](../../../src/commands/plugin/README.md) - 插件命令文档
