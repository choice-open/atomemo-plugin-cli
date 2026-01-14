import { expect } from "chai"
import { runCommand } from "@oclif/test"
import { promises as fs } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import * as configStore from "../../../src/utils/config.js"

describe("auth status", () => {
  let testConfigDir: string

  beforeEach(async () => {
    testConfigDir = join(tmpdir(), `choiceform-test-${Date.now()}`)
    process.env.CHOICEFORM_CONFIG_DIR = testConfigDir
  })

  afterEach(async () => {
    await fs.rm(testConfigDir, { recursive: true, force: true })
    delete process.env.CHOICEFORM_CONFIG_DIR
  })

  it("shows not authenticated message when no access token", async () => {
    const { stdout } = await runCommand("auth status")
    expect(stdout).to.contain("Your device has not been authenticated yet")
    expect(stdout).to.contain("automation auth login")
  })

  it("handles invalid or expired token gracefully", async () => {
    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "invalid_token_123",
      },
    })

    const { stdout } = await runCommand("auth status")
    expect(stdout).to.contain("Failed to fetch session")
  })
})
