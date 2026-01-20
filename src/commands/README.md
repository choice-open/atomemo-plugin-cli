# Commands

CLI 命令实现目录，采用 oclif 框架的目录约定式命令发现机制。

## 目录结构

```
commands/
├── auth/           # 认证相关命令
│   ├── index.ts    # auth 命令组入口
│   ├── login.ts    # 设备授权登录
│   └── status.ts   # 查看鉴权状态
└── plugin/         # 插件管理命令
    ├── index.ts    # plugin 命令组入口
    ├── init.ts     # 初始化插件项目
    ├── refresh-key.ts # 刷新调试 API Key
    ├── checksum.ts # 校验和计算 (待实现)
    ├── pack.ts     # 打包 (待实现)
    ├── permission.ts # 权限管理 (待实现)
    └── run.ts      # 本地运行 (待实现)
```

## 命令组织

oclif 框架通过目录结构自动发现命令：
- `commands/auth/login.ts` → `atomemo auth login`
- `commands/plugin/init.ts` → `atomemo plugin init`
- `commands/auth/index.ts` → `atomemo auth` (显示帮助)

## 命令分类

### 认证命令 (`auth/`)

处理用户身份验证和会话管理。

| 命令 | 文件 | 状态 | 描述 |
|------|------|------|------|
| `atomemo auth` | `auth/index.ts` | ✅ | 显示 auth 命令组帮助 |
| `atomemo auth login` | `auth/login.ts` | ✅ | OAuth 2.0 设备授权登录 |
| `atomemo auth status` | `auth/status.ts` | ✅ | 查看当前鉴权状态 |

**详细文档**：参见 [auth/README.md](./auth/README.md)

### 插件命令 (`plugin/`)

提供插件完整生命周期管理。

| 命令 | 文件 | 状态 | 描述 |
|------|------|------|------|
| `atomemo plugin` | `plugin/index.ts` | ✅ | 显示 plugin 命令组帮助 |
| `atomemo plugin init` | `plugin/init.ts` | ✅ | 交互式创建新插件 |
| `atomemo plugin refresh-key` | `plugin/refresh-key.ts` | ✅ | 刷新调试 API Key |
| `atomemo plugin checksum` | `plugin/checksum.ts` | 🚧 | 计算插件包校验和 |
| `atomemo plugin pack` | `plugin/pack.ts` | 🚧 | 打包插件 |
| `atomemo plugin permission` | `plugin/permission.ts` | 🚧 | 管理插件权限 |
| `atomemo plugin run` | `plugin/run.ts` | 🚧 | 本地运行/调试插件 |

**详细文档**：参见 [plugin/README.md](./plugin/README.md)

## 命令开发规范

所有命令继承自 `@oclif/core` 的 `Command` 基类，需定义：

### 必需属性

- `static override description` - 命令描述（支持多行，使用 `dedent`）
- `static override examples` - 使用示例数组
- `async run()` - 执行逻辑

### 可选属性

- `static override flags` - 命令参数定义
- `static override args` - 位置参数定义
- `static override hidden` - 隐藏命令（不显示在帮助中）
- `static override enableJsonFlag` - 启用 JSON 输出

### 示例

```typescript
export default class MyCommand extends Command {
  static override description = "Command description"
  static override examples = [
    { command: "<%= config.bin %> <%= command.id %>", description: "..." }
  ]
  static override flags = {
    name: Flags.string({ char: "n", summary: "..." })
  }
  
  public async run(): Promise<void> {
    const { flags } = await this.parse(MyCommand)
    // 实现逻辑
  }
}
```

## 依赖关系

### 内部依赖

- `../../utils/config.js` - 配置管理（auth 和 plugin 命令使用）
- `../../utils/generator.js` - 代码生成器（plugin init 使用）
- `../../utils/theme.js` - 交互主题（plugin init 使用）

### 外部依赖

- `@oclif/core` - CLI 框架核心
- `@inquirer/*` - 交互式输入组件
- `zod` - 数据验证
- `yocto-spinner` - 加载动画
- `open` - 打开浏览器

## 子目录

- [`auth/`](./auth/README.md) - 认证命令
- [`plugin/`](./plugin/README.md) - 插件管理命令

## 相关文档

- [src/OVERVIEW.md](../OVERVIEW.md) - 源代码目录概览
- [src/utils/OVERVIEW.md](../utils/OVERVIEW.md) - 工具模块概览
