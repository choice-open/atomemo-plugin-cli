import { promises as fs } from "node:fs"
import { join } from "node:path"
import { Command, Flags } from "@oclif/core"
import { colorize } from "@oclif/core/ux"
import { assert } from "es-toolkit"
import { dedent } from "ts-dedent"
import type { Environment } from "../../utils/config.js"
import * as configStore from "../../utils/config.js"

export default class PluginRefreshKey extends Command {
  static override description =
    dedent`Refresh or create API Key for plugin debugging in development stage.`

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  static override flags = {
    staging: Flags.boolean({
      allowNo: false,
      hidden: true,
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(PluginRefreshKey)

    const env: Environment = flags.staging ? "staging" : "production"

    // Step 1: Check access token
    const config = await configStore.load()
    const authConfig = config.auth?.[env]
    if (!authConfig?.access_token) {
      this.log(
        colorize(
          "red",
          "✗ You're not authenticated yet, please run 'atomemo auth login' first.",
        ),
      )
      return this.exit(1)
    }

    try {
      // Step 2: Fetch debug API Key
      const apiKey = await this.fetchDebugApiKey(authConfig.access_token, env)

      // Step 3: Manage .env file
      const hubConfig = config.hub?.[env]
      assert(hubConfig?.endpoint, "Hub endpoint is required")
      await this.updateEnvFile(apiKey, hubConfig.endpoint)

      // Display success message
      this.log(colorize("green", "✓ Debug API Key refreshed successfully"))
      this.log(
        colorize(
          "green",
          "✓ HUB_WS_URL and HUB_DEBUG_API_KEY updated in .env file",
        ),
      )
      this.log("")
      this.log("Your debug API Key has been saved to .env file.")
      this.log(`Key preview: ${this.maskApiKey(apiKey)}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      this.log(colorize("red", `✗ Failed to refresh debug API Key: ${message}`))
      return this.exit(1)
    }
  }

  private async fetchDebugApiKey(
    accessToken: string,
    env: Environment,
  ): Promise<string> {
    const config = await configStore.load()
    const hubConfig = config.hub?.[env]
    assert(hubConfig?.endpoint, "Hub endpoint is required")

    const response = await fetch(`${hubConfig.endpoint}/api/v1/debug_api_key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Choiceform (Atomemo Plugin CLI)",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Access token is invalid or expired, please login again",
        )
      }
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      )
    }

    const data = (await response.json()) as { api_key?: string }
    if (!data.api_key) {
      throw new Error("API response format error: missing api_key field")
    }

    return data.api_key
  }

  private async updateEnvFile(apiKey: string, wsUrl: string): Promise<void> {
    const envPath = join(process.cwd(), ".env")

    try {
      // Check if .env file exists
      let envContent = ""
      let existingApiKey = false
      let existingWsUrl = false

      try {
        envContent = await fs.readFile(envPath, "utf-8")
        existingApiKey = envContent.includes("HUB_DEBUG_API_KEY=")
        existingWsUrl = envContent.includes("HUB_WS_URL=")
      } catch (_error) {
        // File doesn't exist, will create new file
      }

      let newContent: string = envContent

      // Update or add HUB_WS_URL
      if (existingWsUrl) {
        newContent = newContent.replace(
          /^HUB_WS_URL=.*$/m,
          `HUB_WS_URL=${wsUrl}`,
        )
      } else {
        const separator = newContent && !newContent.endsWith("\n") ? "\n" : ""
        newContent = `${newContent + separator}HUB_WS_URL=${wsUrl}\n`
      }

      // Update or add HUB_DEBUG_API_KEY
      if (existingApiKey) {
        newContent = newContent.replace(
          /^HUB_DEBUG_API_KEY=.*$/m,
          `HUB_DEBUG_API_KEY=${apiKey}`,
        )
      } else {
        const separator = newContent && !newContent.endsWith("\n") ? "\n" : ""
        newContent = `${newContent + separator}HUB_DEBUG_API_KEY=${apiKey}\n`
      }

      await fs.writeFile(envPath, newContent, "utf-8")
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "EACCES"
      ) {
        throw new Error("Permission denied: cannot write .env file")
      }
      throw new Error(
        `Failed to update .env file: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  private maskApiKey(apiKey: string): string {
    if (apiKey.length <= 8) {
      return "***"
    }
    const start = apiKey.substring(0, 4)
    const end = apiKey.substring(apiKey.length - 4)
    return `${start}...${end}`
  }
}
