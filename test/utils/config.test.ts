import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect } from "chai"
import { afterEach, beforeEach, describe, it } from "mocha"
import * as config from "../../src/utils/config.js"

const defaultConfig = {
  auth: {
    staging: { endpoint: "https://oneauth.choiceform.io" },
    production: { endpoint: "https://oneauth.atomemo.ai" },
  },
  hub: {
    staging: { endpoint: "https://automation-plugin-api.choiceform.io" },
    production: { endpoint: "https://plugin-hub.atomemo.ai" },
  },
}

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
          production: {
            endpoint: "https://api.example.com",
            access_token: "test-token",
          },
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
          production: {
            endpoint: "https://api.example.com",
            access_token: "test-token",
          },
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
          production: {
            endpoint: "https://old.example.com",
            access_token: "old-token",
          },
        },
      }

      await config.save(initialConfig)

      const newConfig = {
        auth: {
          production: {
            endpoint: "https://new.example.com",
            access_token: "new-token",
          },
        },
      }

      await config.save(newConfig)

      // Verify the raw file contains exactly what was saved (not merged)
      const testConfigFile = join(testConfigDir, "atomemo.json")
      const content = await fs.readFile(testConfigFile, "utf-8")
      expect(JSON.parse(content)).to.deep.equal(newConfig)

      // Verify loaded config has the new values (merged with defaults)
      const loaded = await config.load()
      expect(loaded.auth?.production?.endpoint).to.equal(
        "https://new.example.com",
      )
      expect(loaded.auth?.production?.access_token).to.equal("new-token")
    })

    it("should validate config schema", async () => {
      const invalidConfig = {
        auth: {
          production: {
            endpoint: "not-a-url",
            access_token: "token",
          },
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
    it("should load config from file and merge with defaults", async () => {
      const savedConfig = {
        auth: {
          production: { access_token: "test-token" },
        },
      }

      const testConfigFile = join(testConfigDir, "atomemo.json")
      await fs.writeFile(
        testConfigFile,
        JSON.stringify(savedConfig, null, 2),
        "utf-8",
      )

      const loaded = await config.load()
      // access_token from saved config
      expect(loaded.auth?.production?.access_token).to.equal("test-token")
      // endpoint merged from defaultConfig
      expect(loaded.auth?.production?.endpoint).to.equal(
        "https://oneauth.atomemo.ai",
      )
      // staging values come from defaultConfig
      expect(loaded.auth?.staging?.endpoint).to.equal(
        "https://oneauth.choiceform.io",
      )
    })

    it("should create default config if file does not exist", async () => {
      const loaded = await config.load()
      expect(loaded).to.deep.equal(defaultConfig)

      const testConfigFile = join(testConfigDir, "atomemo.json")
      const exists = await fs
        .access(testConfigFile)
        .then(() => true)
        .catch(() => false)
      expect(exists).to.be.true
    })

    it("should return default config and save it when file has old (non-nested) format", async () => {
      // Old format: auth without staging/production keys
      // isNewFormat returns false for this, so load() falls back to defaultConfig
      const testConfigFile = join(testConfigDir, "atomemo.json")
      await fs.writeFile(
        testConfigFile,
        JSON.stringify({ auth: {} }, null, 2),
        "utf-8",
      )

      const loaded = await config.load()
      expect(loaded).to.deep.equal(defaultConfig)
    })

    it("should validate loaded config", async () => {
      // Write a new-format config with an invalid URL to trigger Zod validation error
      const invalidConfig = {
        auth: {
          production: {
            endpoint: "not-a-url",
            access_token: "token",
          },
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

    it("should return default config when file has empty content", async () => {
      const testConfigFile = join(testConfigDir, "atomemo.json")
      await fs.writeFile(testConfigFile, JSON.stringify({}, null, 2), "utf-8")

      // {} doesn't pass isNewFormat (no staging/production in auth), so returns defaultConfig
      const loaded = await config.load()
      expect(loaded).to.deep.equal(defaultConfig)
    })
  })

  describe("update", () => {
    it("should update existing config", async () => {
      const initialConfig = {
        auth: {
          production: {
            endpoint: "https://api.example.com",
            access_token: "old-token",
          },
        },
      }

      await config.save(initialConfig)

      await config.update({
        auth: {
          production: { access_token: "new-token" },
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.production?.endpoint).to.equal(
        "https://api.example.com",
      )
      expect(loaded?.auth?.production?.access_token).to.equal("new-token")
    })

    it("should create config if not exists", async () => {
      await config.update({
        auth: {
          production: {
            endpoint: "https://api.example.com",
            access_token: "new-token",
          },
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.production?.endpoint).to.equal(
        "https://api.example.com",
      )
      expect(loaded?.auth?.production?.access_token).to.equal("new-token")
    })

    it("should deep merge nested objects", async () => {
      const initialConfig = {
        auth: {
          production: {
            endpoint: "https://api.example.com",
            access_token: "old-token",
          },
        },
      }

      await config.save(initialConfig)

      await config.update({
        auth: {
          production: { endpoint: "https://new.example.com" },
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.production?.endpoint).to.equal(
        "https://new.example.com",
      )
      expect(loaded?.auth?.production?.access_token).to.equal("old-token")
    })

    it("should handle partial updates with empty existing config", async () => {
      await config.save({})

      await config.update({
        auth: {
          production: {
            endpoint: "https://api.example.com",
            access_token: "token",
          },
        },
      })

      const loaded = await config.load()
      expect(loaded?.auth?.production?.endpoint).to.equal(
        "https://api.example.com",
      )
      expect(loaded?.auth?.production?.access_token).to.equal("token")
    })
  })
})
