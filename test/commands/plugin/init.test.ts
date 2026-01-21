import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { runCommand } from "@oclif/test"
import { expect } from "chai"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import * as configStore from "../../../src/utils/config.js"

const server = setupServer()

describe("plugin init", () => {
  let originalCwd: string
  let testDir: string
  let testConfigDir: string

  before(() => {
    server.listen({ onUnhandledRequest: "bypass" })
  })

  beforeEach(async () => {
    originalCwd = process.cwd()
    testDir = join(tmpdir(), `plugin-init-test-${Date.now()}`)
    testConfigDir = join(tmpdir(), `choiceform-test-${Date.now()}`)
    process.env.CHOICEFORM_CONFIG_DIR = testConfigDir
    await fs.mkdir(testDir, { recursive: true })
    process.chdir(testDir)

    // Setup default mock for get-session
    server.use(
      http.get("https://oneauth.choiceform.io/v1/auth/get-session", () => {
        return HttpResponse.json({
          user: { name: "Test User", email: "test@example.com" },
          session: {
            updatedAt: "2025-01-01T00:00:00Z",
            expiresAt: "2025-12-31T23:59:59Z",
          },
        })
      }),
    )

    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "valid_token_123",
      },
    })
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    server.resetHandlers()
    await fs.rm(testDir, { recursive: true, force: true })
    await fs.rm(testConfigDir, { recursive: true, force: true })
    delete process.env.CHOICEFORM_CONFIG_DIR
  })

  after(() => {
    server.close()
  })

  describe("--no-interactive mode", () => {
    it("shows help message when name is not provided", async () => {
      const { stdout } = await runCommand("plugin init --no-interactive")
      expect(stdout).to.contain(
        "Without interactive mode, you should provide initial information manually.",
      )
    })

    it("shows help message when name is invalid (too short)", async () => {
      const { stdout } = await runCommand(
        "plugin init --no-interactive --name abc",
      )
      expect(stdout).to.contain(
        "Without interactive mode, you should provide initial information manually.",
      )
    })

    it("shows help message when name starts with digit", async () => {
      const { stdout } = await runCommand(
        "plugin init --no-interactive --name 1plugin",
      )
      expect(stdout).to.contain(
        "Without interactive mode, you should provide initial information manually.",
      )
    })

    it("shows help message when name ends with hyphen", async () => {
      const { stdout } = await runCommand(
        "plugin init --no-interactive --name my-plugin-",
      )
      expect(stdout).to.contain(
        "Without interactive mode, you should provide initial information manually.",
      )
    })
  })

  describe("non-interactive with valid flags", () => {
    it("creates plugin with valid name (auto-disables interactive)", async () => {
      const { stdout } = await runCommand(
        "plugin init --name my-test-plugin --language typescript",
      )
      expect(stdout).to.contain("Congratulation")

      // 验证插件目录已创建
      const pluginDir = join(testDir, "my-test-plugin")
      const exists = await fs
        .access(pluginDir)
        .then(() => true)
        .catch(() => false)
      expect(exists).to.be.true

      // 验证 package.json 包含从 session 获取的 author 和 email
      const packageJson = await fs.readFile(
        join(pluginDir, "package.json"),
        "utf-8",
      )
      expect(packageJson).to.contain('"author": "Test User <test@example.com>"')
    })

    it("creates plugin with description flag", async () => {
      const { stdout } = await runCommand(
        'plugin init --name desc-plugin --language typescript --description "A test plugin description"',
      )
      expect(stdout).to.contain("Congratulation")

      const pluginDir = join(testDir, "desc-plugin")
      const exists = await fs
        .access(pluginDir)
        .then(() => true)
        .catch(() => false)
      expect(exists).to.be.true
    })

    it("creates plugin with url flag", async () => {
      const { stdout } = await runCommand(
        "plugin init --name url-plugin --language typescript --url https://github.com/test/url-plugin",
      )
      expect(stdout).to.contain("Congratulation")

      const pluginDir = join(testDir, "url-plugin")
      const exists = await fs
        .access(pluginDir)
        .then(() => true)
        .catch(() => false)
      expect(exists).to.be.true
    })
  })

  describe("authentication", () => {
    it("exits with error when no access token", async () => {
      await configStore.save({
        auth: {
          endpoint: "https://oneauth.choiceform.io",
        },
      })

      const { stdout } = await runCommand(
        "plugin init --name test-plugin --language typescript",
      )
      expect(stdout).to.contain("Failed to fetch user session")
      expect(stdout).to.contain("atomemo auth login")
    })

    it("exits with error when access token is invalid", async () => {
      server.use(
        http.get("https://oneauth.choiceform.io/v1/auth/get-session", () => {
          return new HttpResponse(null, { status: 401 })
        }),
      )

      const { stdout } = await runCommand(
        "plugin init --name test-plugin --language typescript",
      )
      expect(stdout).to.contain("Failed to fetch user session")
      expect(stdout).to.contain("atomemo auth login")
    })

    it("exits with error when get-session API fails", async () => {
      server.use(
        http.get("https://oneauth.choiceform.io/v1/auth/get-session", () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      const { stdout } = await runCommand(
        "plugin init --name test-plugin --language typescript",
      )
      expect(stdout).to.contain("Failed to fetch user session")
      expect(stdout).to.contain("atomemo auth login")
    })
  })

  describe("name validation rules", () => {
    it("accepts lowercase letters and digits", async () => {
      const { stdout } = await runCommand(
        "plugin init --name my-plugin-123 --language typescript",
      )
      expect(stdout).to.contain("Congratulation")
    })

    it("accepts underscores in name", async () => {
      const { stdout } = await runCommand(
        "plugin init --name my_test_plugin --language typescript",
      )
      expect(stdout).to.contain("Congratulation")
    })

    it("accepts hyphens in name", async () => {
      const { stdout } = await runCommand(
        "plugin init --name my-test-plugin --language typescript",
      )
      expect(stdout).to.contain("Congratulation")
    })
  })

  describe("generated files", () => {
    it("includes author and email from session in package.json", async () => {
      await runCommand("plugin init --name test-plugin --language typescript")

      const pluginDir = join(testDir, "test-plugin")
      const packageJson = await fs.readFile(
        join(pluginDir, "package.json"),
        "utf-8",
      )
      const parsed = JSON.parse(packageJson)
      expect(parsed.author).to.equal("Test User <test@example.com>")
    })

    it("includes author in LICENSE", async () => {
      await runCommand("plugin init --name test-plugin --language typescript")

      const pluginDir = join(testDir, "test-plugin")
      const license = await fs.readFile(join(pluginDir, "LICENSE"), "utf-8")
      expect(license).to.contain("Test User")
    })

    it("includes author and email in PRIVACY", async () => {
      await runCommand("plugin init --name test-plugin --language typescript")

      const pluginDir = join(testDir, "test-plugin")
      const privacy = await fs.readFile(join(pluginDir, "PRIVACY"), "utf-8")
      expect(privacy).to.contain("Test User")
      expect(privacy).to.contain("test@example.com")
    })
  })
})
