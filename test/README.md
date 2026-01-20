# Tests

单元测试目录，结构与 `src/` 目录镜像。

## 目录结构

```
test/
├── tsconfig.json       # 测试专用 TypeScript 配置
├── commands/           # 命令测试
│   ├── auth/          # auth 命令组测试
│   └── plugin/        # plugin 命令组测试
└── utils/              # 工具模块测试
    ├── config.test.ts
    └── generator.test.ts
```

## 测试栈

| 工具 | 用途 |
|------|------|
| Mocha | 测试运行器 |
| Chai | 断言库 (expect 风格) |
| @oclif/test | oclif 命令测试辅助 |
| ts-node | TypeScript 直接执行 |
| MSW | Mock Service Worker（网络请求 mock） |

## 运行测试

```bash
# 运行所有测试
npm test

# 运行单个测试文件
npx mocha test/path/to/test.test.ts

# 运行特定目录的测试
npx mocha test/commands/**/*.test.ts
```

测试命令配置:
```bash
mocha --forbid-only "test/**/*.test.ts"
```

## 子目录

| 目录 | 描述 | 详情 |
|------|------|------|
| [`commands/`](./commands/README.md) | 命令测试 | 覆盖 plugin 和 auth 命令组 |
| [`utils/`](./utils/README.md) | 工具测试 | config 和 generator 模块全覆盖 |

## 测试覆盖概况

| 模块 | 覆盖率 | 说明 |
|------|--------|------|
| `utils/config.ts` | ✅ 高 | 完整测试覆盖（加载、保存、更新、验证） |
| `utils/generator.ts` | ✅ 高 | 完整测试覆盖（工厂函数、文件生成、权限分组） |
| `commands/auth/status.ts` | ✅ 高 | 完整测试覆盖（未认证、无效令牌、有效令牌） |
| `commands/plugin/init.ts` | ⚠️ 中 | 部分覆盖（非交互模式、名称验证） |
| `commands/plugin/refresh-key.ts` | ✅ 高 | 完整测试覆盖（所有场景） |
| `commands/plugin/index.ts` | ✅ 低 | 基础测试（显示帮助） |
| `commands/auth/login.ts` | ❌ 无 | 需要 mock 网络请求和浏览器打开 |
| `commands/auth/index.ts` | ❌ 无 | 简单帮助命令 |
| `commands/plugin/*.ts` (其他) | 🚧 占位 | 命令未实现，测试为占位代码 |

## 测试配置

### TypeScript 配置

`test/tsconfig.json` 继承项目根配置，针对测试环境优化。

### Mocha 配置

`.mocharc.json` 配置测试运行参数：
- `--forbid-only` - 禁止使用 `.only()`
- `--require ts-node/register` - 支持 TypeScript

## 测试最佳实践

### 1. 隔离测试环境

使用临时目录和配置文件，避免影响实际环境：

```typescript
beforeEach(async () => {
  testConfigDir = join(tmpdir(), `choiceform-test-${Date.now()}`)
  process.env.CHOICEFORM_CONFIG_DIR = testConfigDir
})

afterEach(async () => {
  await fs.rm(testConfigDir, { recursive: true, force: true })
})
```

### 2. Mock 外部依赖

对于网络请求，使用 MSW：

```typescript
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"

const server = setupServer()

before(() => {
  server.listen({ onUnhandledRequest: "bypass" })
})

after(() => {
  server.close()
})
```

### 3. 测试命令输出

使用 `@oclif/test` 的 `runCommand()` 验证命令输出：

```typescript
const { stdout } = await runCommand("plugin init --name my-plugin")
expect(stdout).to.contain("Congratulation")
```

## 待改进

1. ✅ 添加 `auth login` 命令测试（需 mock 网络请求）
2. ⚠️ 完善 `plugin init` 交互模式测试（需要 mock 用户输入）
3. ✅ 添加 `generator.ts` 单元测试（已完成）
4. 🚧 实现 `checksum/pack/permission/run` 真实功能后更新测试
5. ❌ 添加集成测试验证完整流程

## 相关文档

- [commands/README.md](./commands/README.md) - 命令测试详情
- [utils/README.md](./utils/README.md) - 工具测试详情
- [src/README.md](../src/README.md) - 源代码文档
