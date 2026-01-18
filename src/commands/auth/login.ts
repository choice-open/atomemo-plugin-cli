import confirm from "@inquirer/confirm"
import { Command } from "@oclif/core"
import { colorize } from "@oclif/core/ux"
import { assert } from "es-toolkit"
import open from "open"
import { dedent } from "ts-dedent"
import yoctoSpinner, { type Spinner } from "yocto-spinner"
import * as configStore from "../../utils/config.js"

export default class AuthLogin extends Command {
  static override description = dedent`
    Uses device authorization flow to login with your Choiceform account by following these steps:

    1. Request a validation code automatically
    2. Show the validation code and a verification URL to the user
    3. Open the verification URL in the user's browser and paste the verification code
    4. Submit the validation code to complete the device authorization flow
  `
  static override examples = [
    {
      command: "<%= config.bin %> <%= command.id %>",
      description: "Login by using device authorization flow",
    },
  ]

  static override flags = {}

  private pollingInterval = 5

  private client_id = "atomemo_plugin_cli"

  private grant_type = "urn:ietf:params:oauth:grant-type:device_code"

  private declare endpoint: string

  public async run(): Promise<void> {
    await this.parse(AuthLogin)

    const config = await configStore.load()
    assert(config.auth?.endpoint, "Auth endpoint is required")
    this.endpoint = config.auth.endpoint
    const payload = await this.requestDeviceCode(this.endpoint)

    this.log(
      colorize("yellowBright", "Starting device authorization flow...\n"),
    )

    this.log(
      colorize("bold", colorize("gray", "Verification URL : ")),
      payload.verification_uri,
    )
    this.log(
      colorize("bold", colorize("gray", "Verification Code: ")),
      `${payload.user_code}\n`,
    )

    const autoOpen = await confirm({
      message: dedent`
        Do you want to open the verification URL in your browser automatically?
          If not, you can manually open the URL and paste the code.
      `,
    })

    if (autoOpen) {
      await open(payload.verification_uri_complete)
    }

    const spinner = yoctoSpinner({ text: "Polling for token..." }).start()

    let result: Record<string, string>
    try {
      result = await this.pollForToken(payload.device_code, spinner)
    } catch (error) {
      if (error instanceof ExitError) {
        this.exit(error.code)
      }
      throw error
    }

    await configStore.update({ auth: { access_token: result.access_token } })

    const session = await fetch(`${this.endpoint}/v1/auth/get-session`, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Choiceform (Atomemo Plugin CLI)",
        Authorization: `Bearer ${result.access_token}`,
      },
    }).then((response) => response.json())

    this.log(
      colorize(
        "greenBright",
        dedent`
          Welcome back, ${session.user.name} <${session.user.email}>!
          To create a new plugin, you can use the following command:
          \`${colorize("bold", colorize("yellowBright", "atomemo plugin init"))}\`
        `,
      ),
    )
  }

  private async requestDeviceCode(endpoint: string) {
    const response = await fetch(`${endpoint}/v1/auth/device/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Choiceform (Atomemo Plugin CLI)",
      },
      body: JSON.stringify({ client_id: this.client_id }),
    })

    return (await response.json()) as Record<string, string>
  }

  private async pollForToken(
    device_code: string,
    spinner: Spinner,
  ): Promise<Record<string, string>> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        const response = await fetch(`${this.endpoint}/v1/auth/device/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Choiceform (Atomemo Plugin CLI)",
          },
          body: JSON.stringify({
            grant_type: this.grant_type,
            client_id: this.client_id,
            device_code,
          }),
        })

        const payload = (await response.json()) as Record<string, string>

        if (payload.error) {
          switch (payload.error) {
            case "authorization_pending":
              setTimeout(poll, this.pollingInterval * 1000)
              break
            case "slow_down":
              this.pollingInterval += 5
              setTimeout(poll, this.pollingInterval * 1000)
              break
            case "access_denied":
              spinner.error("Access was denied by the user")
              reject(new ExitError(0, "access_denied"))
              break
            case "expired_token":
              spinner.error("The device code has expired. Please try again.")
              reject(new ExitError(0, "expired_token"))
              break
            default:
              spinner.error(`Error: ${payload.error_description}`)
              reject(new ExitError(1, payload.error_description))
              break
          }
        } else {
          spinner.success("Token acquired successfully\n")
          resolve(payload)
        }
      }

      setTimeout(poll, this.pollingInterval * 1000)
    })
  }
}

class ExitError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message)
    this.name = "ExitError"
  }
}
