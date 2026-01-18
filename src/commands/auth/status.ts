import { Command } from "@oclif/core"
import { colorize } from "@oclif/core/ux"
import { assert } from "es-toolkit"
import { dedent } from "ts-dedent"
import * as configStore from "../../utils/config.js"

interface Session {
  user: {
    name: string
    email: string
  }
  session: {
    updatedAt: string
    expiresAt: string
  }
}

export default class AuthStatus extends Command {
  static override description = dedent`
    Display the current authentication status.

    Shows user information and session details if authenticated,
    or prompts to login if not yet authenticated.
  `

  static override examples = [
    {
      command: "<%= config.bin %> <%= command.id %>",
      description: "Check current authentication status",
    },
  ]

  public async run(): Promise<void> {
    await this.parse(AuthStatus)

    const config = await configStore.load()

    if (!config.auth?.access_token) {
      this.log(
        colorize(
          "yellow",
          "Your device has not been authenticated yet. Please execute `atomemo auth login`.",
        ),
      )
      return
    }

    assert(config.auth?.endpoint, "Auth endpoint is required")

    try {
      const session = await this.fetchSession(
        config.auth.endpoint,
        config.auth.access_token,
      )

      this.log(colorize("greenBright", "✓ Authenticated\n"))
      this.log(
        colorize("bold", colorize("gray", "Name    : ")),
        session.user.name,
      )
      this.log(
        colorize("bold", colorize("gray", "Email   : ")),
        session.user.email,
      )
      this.log(
        colorize("bold", colorize("gray", "Updated : ")),
        this.formatDate(session.session.updatedAt),
      )
      this.log(
        colorize("bold", colorize("gray", "Expires : ")),
        this.formatDate(session.session.expiresAt),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      this.log(colorize("red", `✗ Failed to fetch session: ${message}`))
      this.exit(1)
    }
  }

  private async fetchSession(
    endpoint: string,
    accessToken: string,
  ): Promise<Session> {
    const response = await fetch(`${endpoint}/v1/auth/get-session`, {
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

    return (await response.json()) as Session
  }

  private formatDate(isoDate: string): string {
    const date = new Date(isoDate)
    return date.toLocaleString()
  }
}
