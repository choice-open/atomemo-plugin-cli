# Auth Commands

认证相关命令模块，处理用户身份验证流程。

## 模块列表

| 文件 | 描述 |
|------|------|
| `index.ts` | 命令组入口，显示帮助信息（隐藏命令） |
| `login.ts` | OAuth 2.0 Device Authorization Flow 登录实现 |
| `status.ts` | 查看当前鉴权状态 |

## 核心功能

### `status.ts` - 鉴权状态查询

显示当前设备的鉴权状态：

1. **检查令牌** - 检查本地配置中是否存在 `access_token`
2. **获取会话** - 调用 `/v1/auth/get-session` 获取会话详情
3. **显示信息** - 展示用户名、邮箱、会话更新时间和过期时间

**未鉴权时**：提示用户执行 `automation auth login`

### `login.ts` - 设备授权登录

实现 OAuth 2.0 Device Authorization Grant (RFC 8628) 流程：

1. **请求设备码** - 向认证端点请求 `device_code` 和 `user_code`
2. **用户验证** - 显示验证 URL 和用户码，可选自动打开浏览器
3. **轮询令牌** - 以指数退避方式轮询令牌端点
4. **存储凭证** - 成功后将 `access_token` 存入本地配置

**错误处理**：
- `authorization_pending` - 继续轮询
- `slow_down` - 增加轮询间隔
- `access_denied` / `expired_token` - 终止流程

## 依赖关系

- **内部依赖**: [`../../utils/config.js`](../../utils/OVERVIEW.md) - 配置存储
- **外部依赖**: `@inquirer/confirm`, `open`, `yocto-spinner`
