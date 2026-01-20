# Auth Commands

认证相关命令模块，处理用户身份验证流程，实现 OAuth 2.0 Device Authorization Grant 协议。

## 目录结构

```
auth/
├── index.ts    # 命令组入口（隐藏命令，显示帮助信息）
├── login.ts    # 设备授权登录
└── status.ts   # 查看当前鉴权状态
```

## 模块说明

### `index.ts` - 命令组入口

隐藏命令，用于显示 `auth` 命令组的帮助信息。用户执行 `atomemo auth` 时会显示子命令列表。

### `login.ts` - 设备授权登录

实现 OAuth 2.0 Device Authorization Grant (RFC 8628) 流程，允许用户在无浏览器的 CLI 环境中完成身份验证。

**执行流程**：

1. **请求设备码**
   - 向 `/v1/auth/device/code` 发送 POST 请求
   - 获取 `device_code`、`user_code`、`verification_uri`、`verification_uri_complete`

2. **用户验证**
   - 显示验证 URL 和用户码
   - 可选自动打开浏览器（使用 `open` 包）
   - 用户访问 URL 并输入验证码

3. **轮询令牌**
   - 以指数退避方式轮询 `/v1/auth/device/token`
   - 初始间隔 5 秒，遇到 `slow_down` 错误时增加 5 秒
   - 处理各种错误状态：
     - `authorization_pending` - 继续轮询
     - `slow_down` - 增加轮询间隔
     - `access_denied` - 用户拒绝授权，终止流程
     - `expired_token` - 设备码过期，终止流程

4. **存储凭证**
   - 成功后将 `access_token` 存入本地配置（`~/.choiceform/atomemo.json`）

5. **获取会话信息**
   - 调用 `/v1/auth/get-session` 获取用户信息
   - 显示欢迎消息

**技术细节**：
- 使用 `yocto-spinner` 显示轮询进度
- 使用 `@inquirer/confirm` 询问是否自动打开浏览器
- 自定义 `ExitError` 类处理优雅退出

**依赖关系**：
- `../../utils/config.js` - 配置存储
- `@inquirer/confirm` - 用户确认
- `open` - 打开浏览器
- `yocto-spinner` - 加载动画

### `status.ts` - 鉴权状态查询

显示当前设备的鉴权状态和用户会话信息。

**执行流程**：

1. **检查令牌**
   - 从本地配置加载 `access_token`
   - 如果不存在，提示用户执行 `atomemo auth login`

2. **获取会话**
   - 调用 `/v1/auth/get-session` 获取会话详情
   - 处理 401 错误（令牌无效或过期）

3. **显示信息**
   - 显示认证状态（✓ Authenticated）
   - 显示用户信息（姓名、邮箱）
   - 显示会话信息（更新时间、过期时间）

**错误处理**：
- 401 错误：提示令牌无效或过期，建议重新登录
- 其他错误：显示错误消息并退出

**依赖关系**：
- `../../utils/config.js` - 配置加载

## 命令映射

| 命令 | 文件 | 描述 |
|------|------|------|
| `atomemo auth` | `index.ts` | 显示 auth 命令组帮助 |
| `atomemo auth login` | `login.ts` | OAuth 2.0 设备授权登录 |
| `atomemo auth status` | `status.ts` | 查看当前鉴权状态 |

## API 端点

### OneAuth API

- `POST /v1/auth/device/code` - 请求设备授权码
- `POST /v1/auth/device/token` - 轮询获取访问令牌
- `GET /v1/auth/get-session` - 获取用户会话信息

所有请求包含 `User-Agent: Choiceform (Atomemo Plugin CLI` 头。

## 测试覆盖

- ✅ `status.ts` - 完整测试覆盖（未认证、无效令牌、有效令牌场景）
- ❌ `login.ts` - 无测试（需要 mock 网络请求和浏览器打开）

## 相关文档

- [src/commands/OVERVIEW.md](../OVERVIEW.md) - 命令实现概览
- [src/utils/OVERVIEW.md](../../utils/OVERVIEW.md) - 工具模块概览
