# Command Tests

CLI 命令的单元测试目录，结构镜像 `src/commands/`。

## 目录结构

```
commands/
├── auth/              # auth 命令组测试
│   └── status.test.ts # auth status 命令测试
└── plugin/            # plugin 命令组测试
    ├── index.test.ts
    ├── init.test.ts
    ├── refresh-key.test.ts
    ├── checksum.test.ts
    ├── pack.test.ts
    ├── permission.test.ts
    └── run.test.ts
```

## 测试组织

测试目录结构与源代码目录结构保持一致，便于定位和维护。

## 子目录

- [`auth/`](./auth/) - 认证命令测试
- [`plugin/`](./plugin/README.md) - 插件命令测试

## 测试覆盖概况

| 命令组 | 命令 | 测试文件 | 覆盖状态 |
|--------|------|----------|----------|
| `auth` | `login` | ❌ 无 | ❌ 无测试 |
| `auth` | `status` | `auth/status.test.ts` | ✅ 全面覆盖 |
| `auth` | `index` | ❌ 无 | ❌ 无测试 |
| `plugin` | `index` | `plugin/index.test.ts` | ✅ 基础覆盖 |
| `plugin` | `init` | `plugin/init.test.ts` | ⚠️ 部分覆盖 |
| `plugin` | `refresh-key` | `plugin/refresh-key.test.ts` | ✅ 全面覆盖 |
| `plugin` | `checksum` | `plugin/checksum.test.ts` | 🚧 占位测试 |
| `plugin` | `pack` | `plugin/pack.test.ts` | 🚧 占位测试 |
| `plugin` | `permission` | `plugin/permission.test.ts` | 🚧 占位测试 |
| `plugin` | `run` | `plugin/run.test.ts` | 🚧 占位测试 |

## 测试约定

### 文件命名

- 测试文件命名: `{command}.test.ts`
- 与源代码文件一一对应

### 测试工具

- **@oclif/test** - oclif 命令测试工具
  - `runCommand(command)` - 执行命令并返回 stdout/stderr
- **Mocha** - 测试运行器
- **Chai** - 断言库

### 测试模式

```typescript
import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("command", () => {
  it("runs command with args", async () => {
    const { stdout } = await runCommand("plugin subcommand --flag value")
    expect(stdout).to.contain("expected output")
  })
})
```

### Mock 网络请求

对于需要网络请求的命令（如 `auth login`、`refresh-key`），使用 **MSW (Mock Service Worker)** 进行 mock：

```typescript
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"

const server = setupServer()

before(() => {
  server.listen({ onUnhandledRequest: "bypass" })
})

beforeEach(() => {
  server.use(
    http.get("https://api.example.com/endpoint", () => {
      return HttpResponse.json({ data: "..." })
    })
  )
})
```

## 测试详情

### Auth 命令测试

- [`auth/status.test.ts`](./auth/status.test.ts) - 完整测试覆盖
  - 未认证状态
  - 无效/过期令牌
  - 有效令牌和会话信息

### Plugin 命令测试

- [`plugin/README.md`](./plugin/README.md) - 详细测试文档

## 缺失测试

| 命令 | 状态 | 说明 |
|------|------|------|
| `auth login` | ❌ 无测试 | 需要 mock 网络请求和浏览器打开 |
| `auth` (index) | ❌ 无测试 | 简单帮助命令，可添加基础测试 |

## 相关文档

- [test/README.md](../README.md) - 测试目录概览
- [src/commands/README.md](../../src/commands/README.md) - 命令实现文档
