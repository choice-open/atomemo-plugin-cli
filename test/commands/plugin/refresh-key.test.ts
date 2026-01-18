import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { runCommand } from "@oclif/test"
import { expect } from "chai"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import * as configStore from "../../../src/utils/config.js"

const server = setupServer()

describe("plugin refresh-key", () => {
  let testConfigDir: string
  let originalCwd: string
  let testDir: string

  before(() => {
    server.listen({ onUnhandledRequest: "bypass" })
  })

  beforeEach(async () => {
    testConfigDir = join(tmpdir(), `choiceform-test-${Date.now()}`)
    process.env.CHOICEFORM_CONFIG_DIR = testConfigDir

    originalCwd = process.cwd()

    testDir = join(tmpdir(), `plugin-test-${Date.now()}`)
    await fs.mkdir(testDir, { recursive: true })
    process.chdir(testDir)
  })

  afterEach(async () => {
    server.resetHandlers()
    process.chdir(originalCwd)

    await fs.rm(testDir, { recursive: true, force: true })
    await fs.rm(testConfigDir, { recursive: true, force: true })

    delete process.env.CHOICEFORM_CONFIG_DIR
  })

  after(() => {
    server.close()
  })

  it("当没有访问令牌时显示错误信息", async function () {
    this.timeout(5000)
    const { stdout } = await runCommand("plugin refresh-key")
    expect(stdout).to.contain("You're not authenticated yet")
    expect(stdout).to.contain("please run 'atomemo auth login'")
  })

  it("当访问令牌无效时显示错误信息", async function () {
    this.timeout(5000)
    server.use(
      http.get(
        "https://automation-plugin-api.choiceform.io/api/v1/debug_api_key",
        () => new HttpResponse(null, { status: 401 }),
      ),
    )

    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "invalid_token_123",
      },
      hub: {
        endpoint: "https://automation-plugin-api.choiceform.io",
      },
    })

    const { stdout } = await runCommand("plugin refresh-key")
    expect(stdout).to.contain("Failed to refresh debug API Key")
  })

  it("成功时创建新的 .env 文件", async () => {
    server.use(
      http.get(
        "https://automation-plugin-api.choiceform.io/api/v1/debug_api_key",
        () => HttpResponse.json({ api_key: "test_api_key_12345678" }),
      ),
    )

    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "test_token",
      },
      hub: {
        endpoint: "https://automation-plugin-api.choiceform.io",
      },
    })

    const { stdout } = await runCommand("plugin refresh-key")
    expect(stdout).to.contain("Debug API Key refreshed successfully")

    const envPath = join(testDir, ".env")
    const content = await fs.readFile(envPath, "utf-8")
    expect(content).to.contain("DEBUG_API_KEY=test_api_key_12345678")
  })

  it("更新现有的 .env 文件中的 DEBUG_API_KEY", async () => {
    server.use(
      http.get(
        "https://automation-plugin-api.choiceform.io/api/v1/debug_api_key",
        () => HttpResponse.json({ api_key: "new_api_key_87654321" }),
      ),
    )

    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "test_token",
      },
      hub: {
        endpoint: "https://automation-plugin-api.choiceform.io",
      },
    })

    const envPath = join(testDir, ".env")
    await fs.writeFile(
      envPath,
      `EXISTING_KEY=value\nDEBUG_API_KEY=old_key_123\nANOTHER_KEY=value2`,
    )

    const { stdout } = await runCommand("plugin refresh-key")
    expect(stdout).to.contain("Debug API Key refreshed successfully")

    const content = await fs.readFile(envPath, "utf-8")
    expect(content).to.contain("DEBUG_API_KEY=new_api_key_87654321")
    expect(content).to.contain("EXISTING_KEY=value")
    expect(content).to.contain("ANOTHER_KEY=value2")
    expect(content).to.not.contain("old_key_123")
  })

  it("在现有的 .env 文件末尾追加 DEBUG_API_KEY", async () => {
    server.use(
      http.get(
        "https://automation-plugin-api.choiceform.io/api/v1/debug_api_key",
        () => HttpResponse.json({ api_key: "appended_key_999" }),
      ),
    )

    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "test_token",
      },
      hub: {
        endpoint: "https://automation-plugin-api.choiceform.io",
      },
    })

    const envPath = join(testDir, ".env")
    await fs.writeFile(envPath, `EXISTING_KEY=value\nANOTHER_KEY=value2`)

    const { stdout } = await runCommand("plugin refresh-key")
    expect(stdout).to.contain("Debug API Key refreshed successfully")

    const content = await fs.readFile(envPath, "utf-8")
    expect(content).to.contain("DEBUG_API_KEY=appended_key_999")
    expect(content).to.contain("EXISTING_KEY=value")
    expect(content).to.contain("ANOTHER_KEY=value2")
  })

  it("正确掩码显示 API Key", async () => {
    server.use(
      http.get(
        "https://automation-plugin-api.choiceform.io/api/v1/debug_api_key",
        () => HttpResponse.json({ api_key: "abcd1234efgh5678" }),
      ),
    )

    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "test_token",
      },
      hub: {
        endpoint: "https://automation-plugin-api.choiceform.io",
      },
    })

    const { stdout } = await runCommand("plugin refresh-key")
    expect(stdout).to.contain("abcd...5678")
  })
})
