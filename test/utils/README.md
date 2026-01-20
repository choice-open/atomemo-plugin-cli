# Utils Tests

工具模块的单元测试。

## 目录结构

```
utils/
├── config.test.ts    # config.ts 测试
└── generator.test.ts # generator.ts 测试
```

## 测试文件

| 文件 | 测试对象 | 覆盖状态 |
|------|----------|----------|
| `config.test.ts` | `src/utils/config.ts` | ✅ 全面覆盖 |
| `generator.test.ts` | `src/utils/generator.ts` | ✅ 全面覆盖 |

## 测试详情

### `config.test.ts` - 配置管理测试

**测试设置**：
- 使用临时目录隔离测试环境
- 通过 `CHOICEFORM_CONFIG_DIR` 环境变量覆盖配置路径
- 每个测试前后清理临时文件

**覆盖场景**：

**`save()` 函数**：
- ✅ 保存配置到文件
- ✅ 自动创建目录（如果不存在）
- ✅ 覆盖已有配置
- ✅ Schema 验证失败（无效 URL）

**`load()` 函数**：
- ✅ 加载已有配置
- ✅ 文件不存在时创建默认配置
- ✅ 生产环境默认端点（`NODE_ENV=production`）
- ✅ Schema 验证失败（无效配置）
- ✅ 空配置处理

**`update()` 函数**：
- ✅ 更新已有配置
- ✅ 配置不存在时创建
- ✅ 深度合并嵌套对象（保留未更新字段）
- ✅ 空配置基础上更新

### `generator.test.ts` - 代码生成器测试

**测试设置**：
- 使用临时目录作为生成目标
- 每个测试前后清理临时文件

**覆盖场景**：

**`createPluginGenerator()` 工厂函数**：
- ✅ 创建 TypeScriptPluginGenerator 实例
- ✅ 不支持的类型抛出错误
- ✅ elixir 类型未实现（抛出错误）
- ✅ python 类型未实现（抛出错误）

**`TypeScriptPluginGenerator` 类**：
- ✅ 生成插件文件到目标目录
- ✅ 验证 common 模板文件（.gitignore, LICENSE.md）
- ✅ 验证 typescript 模板文件（package.json, tsconfig.json）
- ✅ 验证 src 目录结构
- ✅ 正确渲染模板变量（package.json, LICENSE.md）
- ✅ 直接复制非 .eta 文件（.editorconfig）
- ✅ 权限列表按 scope 分组（`["http:read", "fs:write"]` → `[{scope: "http", entries: ["read"]}, {scope: "fs", entries: ["write"]}]`）
- ✅ 处理空权限列表
- ✅ 创建嵌套目录结构（src/i18n, src/tools, test）

## 缺失测试

| 模块 | 状态 | 说明 |
|------|------|------|
| `theme.ts` | ❌ 无测试 | 纯配置导出，可跳过测试 |
| `views.ts` | ❌ 无测试 | 已弃用，无需测试 |

## 测试工具

- **Mocha** - 测试运行器
- **Chai** - 断言库（expect 风格）
- **node:fs/promises** - 文件系统操作
- **node:os** - 临时目录（`tmpdir()`）

## 测试运行

```bash
# 运行所有工具测试
npx mocha test/utils/*.test.ts

# 运行单个测试文件
npx mocha test/utils/config.test.ts
```

## 相关文档

- [test/README.md](../README.md) - 测试目录概览
- [src/utils/README.md](../../src/utils/README.md) - 工具模块文档
