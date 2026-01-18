import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect } from "chai"
import { afterEach, beforeEach, describe, it } from "mocha"
import * as config from "../../src/utils/config.js"

describe("config", () => {
  let testConfigDir: string
  let originalConfigDir: string | undefined

  beforeEach(async () => {
    // 保存原始环境变量
    originalConfigDir = process.env.CHOICEFORM_CONFIG_DIR

    // 创建临时测试目录
    testConfigDir = join(tmpdir(), `choiceform-test-${Date.now()}`)

    // 设置环境变量来覆盖配置路径
    process.env.CHOICEFORM_CONFIG_DIR = testConfigDir

    // 确保测试目录存在
    await fs.mkdir(testConfigDir, { recursive: true })
  })

  afterEach(async () => {
    // 恢复原始环境变量
    if (originalConfigDir === undefined) {
      delete process.env.CHOICEFORM_CONFIG_DIR
    } else {
      process.env.CHOICEFORM_CONFIG_DIR = originalConfigDir
    }

    // 清理测试文件
    try {
      await fs.rm(testConfigDir, { recursive: true, force: true })
    } catch {
      // 忽略清理错误
    }
  })

  describe("save", () => {
    it("should save config to file", async () => {
      const testConfig = {
        auth: {
          endpoint: "https://api.example.com",
          access_token: "test-token",
        },
      }

      await config.save(testConfig)

      const testConfigFile = join(testConfigDir, "atomemo.json")
      const content = await fs.readFile(testConfigFile, "utf-8")
      const parsed = JSON.parse(content)
      expect(parsed).to.deep.equal(testConfig)
    })

    it("should create directory if not exists", async () => {
      const testConfigDir2 = join(tmpdir(), `choiceform-test-${Date.now()}`)
      const testConfigFile2 = join(testConfigDir2, "atomemo.json")

      process.env.CHOICEFORM_CONFIG_DIR = testConfigDir2

      const testConfig = {
        auth: {
          endpoint: "https://api.example.com",
          access_token: "test-token",
        },
      }

      await config.save(testConfig)

      const exists = await fs
        .access(testConfigFile2)
        .then(() => true)
        .catch(() => false)
      expect(exists).to.be.true

      await fs.rm(testConfigDir2, { recursive: true, force: true })
    })

    it("should overwrite existing config", async () => {
      const initialConfig = {
        auth: {
          endpoint: "https://old.example.com",
          access_token: "old-token",
        },
      }

      await config.save(initialConfig)

      const newConfig = {
        auth: {
          endpoint: "https://new.example.com",
          access_token: "new-token",
        },
      }

      await config.save(newConfig)

      const loaded = await config.load()
      expect(loaded).to.deep.equal(newConfig)
    })

    it("should validate config schema", async () => {
      const invalidConfig = {
        auth: {
          endpoint: "not-a-url",
          access_token: "token",
        },
      }

      try {
        await config.save(invalidConfig)
        expect.fail("should throw validation error")
      } catch (error) {
        expect(error).to.exist
      }
    })
  })

  describe("load", () => {
    it("should load config from file", async () => {
      const testConfig = {
        auth: {
          endpoint: "https://api.example.com",
          access_token: "test-token",
        },
      }

      const testConfigFile = join(testConfigDir, "atomemo.json")
      await fs.writeFile(
        testConfigFile,
        JSON.stringify(testConfig, null, 2),
        "utf-8",
      )

      const loaded = await config.load()
      expect(loaded).to.deep.equal(testConfig)
    })

    it("should create default config if file does not exist", async () => {
      const originalNodeEnv = process.env.NODE_ENV
      delete process.env.NODE_ENV

      const loaded = await config.load()
      expect(loaded).to.deep.equal({
        auth: {
          endpoint: "https://oneauth.choiceform.io",
        },
        hub: {
          endpoint: "https://automation-plugin-api.choiceform.io",
        },
      })

      const testConfigFile = join(testConfigDir, "atomemo.json")
      const exists = await fs
        .access(testConfigFile)
        .then(() => true)
        .catch(() => false)
      expect(exists).to.be.true

      if (originalNodeEnv !== undefined) {
        process.env.NODE_ENV = originalNodeEnv
      }
    })

    it("should create production config if NODE_ENV is production", async () => {
      const originalNodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = "production"

      // 删除配置文件以触发创建默认配置
      const testConfigFile = join(testConfigDir, "atomemo.json")
      try {
        await fs.unlink(testConfigFile)
      } catch {
        // 忽略错误
      }

      const loaded = await config.load()
      expect(loaded).to.deep.equal({
        auth: {
          endpoint: "https://oneauth.choiceform.io",
        },
        hub: {
          endpoint: "https://automation-plugin-api.choiceform.io",
        },
      })

      if (originalNodeEnv !== undefined) {
        process.env.NODE_ENV = originalNodeEnv
      } else {
        delete process.env.NODE_ENV
      }
    })

    it("should validate loaded config", async () => {
      const invalidConfig = {
        auth: {
          endpoint: "not-a-url",
          access_token: "token",
        },
      }

      const testConfigFile = join(testConfigDir, "atomemo.json")
      await fs.writeFile(
        testConfigFile,
        JSON.stringify(invalidConfig, null, 2),
        "utf-8",
      )

      try {
        await config.load()
        expect.fail("should throw validation error")
      } catch (error) {
        expect(error).to.exist
      }
    })

    it("should handle empty config", async () => {
      const emptyConfig = {}
      const testConfigFile = join(testConfigDir, "atomemo.json")
      await fs.writeFile(
        testConfigFile,
        JSON.stringify(emptyConfig, null, 2),
        "utf-8",
      )

      const loaded = await config.load()
      expect(loaded).to.deep.equal(emptyConfig)
    })
  })

  describe("update", () => {
    it("should update existing config", async () => {
      const initialConfig = {
        auth: {
          endpoint: "https://api.example.com",
          access_token: "old-token",
        },
      }

      await config.save(initialConfig)

      await config.update({
        auth: {
          access_token: "new-token",
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.endpoint).to.equal("https://api.example.com")
      expect(loaded?.auth?.access_token).to.equal("new-token")
    })

    it("should create config if not exists", async () => {
      await config.update({
        auth: {
          endpoint: "https://api.example.com",
          access_token: "new-token",
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.endpoint).to.equal("https://api.example.com")
      expect(loaded?.auth?.access_token).to.equal("new-token")
    })

    it("should deep merge nested objects", async () => {
      const initialConfig = {
        auth: {
          endpoint: "https://api.example.com",
          access_token: "old-token",
        },
      }

      await config.save(initialConfig)

      await config.update({
        auth: {
          endpoint: "https://new.example.com",
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.endpoint).to.equal("https://new.example.com")
      expect(loaded?.auth?.access_token).to.equal("old-token")
    })

    it("should handle partial updates with empty existing config", async () => {
      await config.save({})

      await config.update({
        auth: {
          endpoint: "https://api.example.com",
          access_token: "token",
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.endpoint).to.equal("https://api.example.com")
      expect(loaded?.auth?.access_token).to.equal("token")
    })
  })
})
