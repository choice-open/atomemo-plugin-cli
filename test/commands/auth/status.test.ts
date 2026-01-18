import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { runCommand } from "@oclif/test"
import { expect } from "chai"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import * as configStore from "../../../src/utils/config.js"

const server = setupServer()

describe("auth status", () => {
  let testConfigDir: string

  before(() => {
    server.listen({ onUnhandledRequest: "bypass" })
  })

  beforeEach(async () => {
    testConfigDir = join(tmpdir(), `choiceform-test-${Date.now()}`)
    process.env.CHOICEFORM_CONFIG_DIR = testConfigDir
  })

  afterEach(async () => {
    server.resetHandlers()
    await fs.rm(testConfigDir, { recursive: true, force: true })
    delete process.env.CHOICEFORM_CONFIG_DIR
  })

  after(() => {
    server.close()
  })

  it("shows not authenticated message when no access token", async () => {
    const { stdout } = await runCommand("auth status")
    expect(stdout).to.contain("Your device has not been authenticated yet")
    expect(stdout).to.contain("atomemo auth login")
  })

  it("handles invalid or expired token gracefully", async function () {
    this.timeout(5000)
    server.use(
      http.get("https://oneauth.choiceform.io/v1/auth/get-session", () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )

    await configStore.save({
      auth: {
        endpoint: "https://oneauth.choiceform.io",
        access_token: "invalid_token_123",
      },
    })

    const { stdout } = await runCommand("auth status")
    expect(stdout).to.contain("Failed to fetch session")
  })

  it("displays user info when authenticated", async () => {
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

    const { stdout } = await runCommand("auth status")
    expect(stdout).to.contain("Authenticated")
    expect(stdout).to.contain("Test User")
    expect(stdout).to.contain("test@example.com")
  })
})
