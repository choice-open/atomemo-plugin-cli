import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect } from "chai"
import {
  createPluginGenerator,
  TypeScriptPluginGenerator,
} from "../../src/utils/generator.js"

describe("generator", () => {
  let testDir: string

  beforeEach(async () => {
    testDir = join(tmpdir(), `generator-test-${Date.now()}`)
    await fs.mkdir(testDir, { recursive: true })
  })

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true })
  })

  describe("createPluginGenerator", () => {
    it("creates TypeScriptPluginGenerator for typescript type", () => {
      const generator = createPluginGenerator("typescript", {
        props: { name: "test-plugin" },
        target: testDir,
      })

      expect(generator).to.be.instanceOf(TypeScriptPluginGenerator)
      expect(generator.type).to.equal("typescript")
    })

    it("throws error for unsupported type", () => {
      expect(() =>
        createPluginGenerator("unsupported", {
          props: { name: "test-plugin" },
          target: testDir,
        }),
      ).to.throw('Plugin generator type "unsupported" is not implemented.')
    })

    it("throws error for elixir (not yet implemented)", () => {
      expect(() =>
        createPluginGenerator("elixir", {
          props: { name: "test-plugin" },
          target: testDir,
        }),
      ).to.throw('Plugin generator type "elixir" is not implemented.')
    })

    it("throws error for python (not yet implemented)", () => {
      expect(() =>
        createPluginGenerator("python", {
          props: { name: "test-plugin" },
          target: testDir,
        }),
      ).to.throw('Plugin generator type "python" is not implemented.')
    })
  })

  describe("TypeScriptPluginGenerator", () => {
    it("generates plugin files in target directory", async () => {
      const targetDir = join(testDir, "my-plugin")
      const generator = new TypeScriptPluginGenerator({
        props: {
          name: "my-plugin",
          description: "A test plugin description",
          author: "Test Author",
          email: "test@example.com",
          url: "https://github.com/test/my-plugin",
          language: "typescript",
          year: "2025",
          date: "2025-01-19",
          createdAt: "2025-01-19T00:00:00Z",
        },
        target: targetDir,
      })

      await generator.generate()

      // 验证目录结构
      const targetExists = await fs
        .access(targetDir)
        .then(() => true)
        .catch(() => false)
      expect(targetExists).to.be.true

      // 验证 common 模板文件
      const gitignoreExists = await fs
        .access(join(targetDir, ".gitignore"))
        .then(() => true)
        .catch(() => false)
      expect(gitignoreExists).to.be.true

      const licenseExists = await fs
        .access(join(targetDir, "LICENSE"))
        .then(() => true)
        .catch(() => false)
      expect(licenseExists).to.be.true

      // 验证 typescript 模板文件
      const packageJsonExists = await fs
        .access(join(targetDir, "package.json"))
        .then(() => true)
        .catch(() => false)
      expect(packageJsonExists).to.be.true

      const tsconfigExists = await fs
        .access(join(targetDir, "tsconfig.json"))
        .then(() => true)
        .catch(() => false)
      expect(tsconfigExists).to.be.true

      // 验证 src 目录
      const srcIndexExists = await fs
        .access(join(targetDir, "src", "index.ts"))
        .then(() => true)
        .catch(() => false)
      expect(srcIndexExists).to.be.true
    })

    it("renders template variables correctly", async () => {
      const targetDir = join(testDir, "test-plugin")
      const generator = new TypeScriptPluginGenerator({
        props: {
          name: "test-plugin",
          description: "My awesome plugin",
          author: "John Doe",
          email: "john@example.com",
          url: "https://github.com/john/test-plugin",
          language: "typescript",
          year: "2025",
          date: "2025-01-19",
          createdAt: "2025-01-19T00:00:00Z",
        },
        target: targetDir,
      })

      await generator.generate()

      // 验证 package.json 中的变量替换
      const packageJson = await fs.readFile(
        join(targetDir, "package.json"),
        "utf-8",
      )
      expect(packageJson).to.contain('"name": "test-plugin"')
      expect(packageJson).to.contain('"author": "John Doe <john@example.com>"')

      // 验证 LICENSE 中的变量替换
      const license = await fs.readFile(join(targetDir, "LICENSE"), "utf-8")
      expect(license).to.contain("2025")
      expect(license).to.contain("John Doe")
    })

    it("copies non-eta files directly", async () => {
      const targetDir = join(testDir, "copy-test")
      const generator = new TypeScriptPluginGenerator({
        props: {
          name: "copy-test",
          description: "Test copying files",
          author: "Test",
          email: "test@test.com",
          language: "typescript",
          year: "2025",
          date: "2025-01-19",
          createdAt: "2025-01-19T00:00:00Z",
        },
        target: targetDir,
      })

      await generator.generate()

      // .editorconfig 是非模板文件，应该被直接复制
      const editorconfig = await fs
        .access(join(targetDir, ".editorconfig"))
        .then(() => true)
        .catch(() => false)
      expect(editorconfig).to.be.true
    })

    it("handles permissions prop correctly", () => {
      const generator = new TypeScriptPluginGenerator({
        props: {
          name: "permission-test",
          permissions: ["http:read", "http:write", "fs:read"],
        },
        target: testDir,
      })

      const grouped = generator.context.props.permissions as Array<{
        scope: string
        entries: string[]
      }>

      expect(grouped).to.have.lengthOf(2)
      expect(grouped[0]).to.deep.equal({ scope: "fs", entries: ["read"] })
      expect(grouped[1]).to.deep.equal({
        scope: "http",
        entries: ["read", "write"],
      })
    })

    it("handles empty permissions", () => {
      const generator = new TypeScriptPluginGenerator({
        props: {
          name: "no-permissions",
        },
        target: testDir,
      })

      const grouped = generator.context.props.permissions as Array<{
        scope: string
        entries: string[]
      }>

      expect(grouped).to.deep.equal([])
    })

    it("creates nested directory structure", async () => {
      const targetDir = join(testDir, "nested-test")
      const generator = new TypeScriptPluginGenerator({
        props: {
          name: "nested-test",
          description: "Test nested directories",
          author: "Test",
          email: "test@test.com",
          language: "typescript",
          year: "2025",
          date: "2025-01-19",
          createdAt: "2025-01-19T00:00:00Z",
        },
        target: targetDir,
      })

      await generator.generate()

      // 验证嵌套目录结构
      const i18nDirExists = await fs
        .access(join(targetDir, "src", "i18n"))
        .then(() => true)
        .catch(() => false)
      expect(i18nDirExists).to.be.true

      const toolsDirExists = await fs
        .access(join(targetDir, "src", "tools"))
        .then(() => true)
        .catch(() => false)
      expect(toolsDirExists).to.be.true

      const testDirExists = await fs
        .access(join(targetDir, "test"))
        .then(() => true)
        .catch(() => false)
      expect(testDirExists).to.be.true
    })
  })
})
