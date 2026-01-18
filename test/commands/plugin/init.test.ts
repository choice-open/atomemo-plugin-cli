import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin init", () => {
  let originalCwd: string
  let testDir: string

  beforeEach(async () => {
    originalCwd = process.cwd()
    testDir = join(tmpdir(), `plugin-init-test-${Date.now()}`)
    await fs.mkdir(testDir, { recursive: true })
    process.chdir(testDir)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    await fs.rm(testDir, { recursive: true, force: true })
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
    })

    it("creates plugin with type flag", async () => {
      const { stdout } = await runCommand(
        "plugin init --name typed-plugin --language typescript --type tool",
      )
      expect(stdout).to.contain("Congratulation")

      // 验证插件目录已创建
      const pluginDir = join(testDir, "typed-plugin")
      const exists = await fs
        .access(pluginDir)
        .then(() => true)
        .catch(() => false)
      expect(exists).to.be.true
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
})
