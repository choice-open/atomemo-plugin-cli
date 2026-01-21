import path from "node:path"
import input from "@inquirer/input"
import select from "@inquirer/select"
import { Command, Flags } from "@oclif/core"
import type { OutputFlags } from "@oclif/core/interfaces"
import { colorize } from "@oclif/core/ux"
import { assert, isString } from "es-toolkit"
import { dedent } from "ts-dedent"
import z from "zod"
import * as configStore from "../../utils/config.js"
import { createPluginGenerator } from "../../utils/generator.js"
import { selectTheme } from "../../utils/theme.js"

type CommandFlags = OutputFlags<typeof PluginInit.flags>

const LANGUAGES = ["elixir", "python", "typescript"]

export default class PluginInit extends Command {
  static override description = dedent`
    Initialize a new plugin with step-by-step interactive instructions.

    Providing required flags skips interactive flow and completes initialization in one go.
  `

  static override examples = [
    {
      command: "<%= config.bin %> <%= command.id %>",
      description: "Start with interactive initialization:",
    },
  ]

  static override flags = {
    interactive: Flags.boolean({
      allowNo: true,
      char: "i",
      default: true,
      summary: "Use interactive mode (by default)",
    }),
    name: Flags.string({
      char: "n",
      helpValue: "my-awesome-plugin",
      summary: "Plugin name",
    }),
    description: Flags.string({
      char: "d",
      default: "",
      helpValue: "Descriptive text...",
      summary: "Short description",
    }),
    url: Flags.string({
      char: "u",
      default: "",
      summary: "Repository URL",
    }),
    language: Flags.option({
      multiple: false,
      options: LANGUAGES,
    })({
      char: "l",
      summary: "Programming language to use for plugin development",
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(PluginInit)

    this.reconcileInteractiveFlag(flags)

    if (flags.interactive) {
      await this.runInteractiveMode(flags)
    }

    assert(flags.name, "flags.name should be valid here...")
    assert(flags.language, "flags.language should be valid here...")

    // Fetch user session to get author and email
    let author = ""
    let email = ""
    try {
      const session = await this.fetchSession()
      author = session.user.name
      email = session.user.email
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      this.log(
        colorize(
          "redBright",
          dedent`
            ✗ Failed to fetch user session: ${message}
            
            Please execute ${colorize("blue", "atomemo auth login")} to authenticate and try again.
          `,
        ),
      )
      this.exit(1)
    }

    const generator = createPluginGenerator(flags.language, {
      props: {
        ...flags,
        author,
        email,
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().slice(0, 10),
        year: new Date().getFullYear().toString(),
      },
      target: path.join(process.cwd(), flags.name),
    })

    await generator.generate()

    this.log(
      colorize(
        "blueBright",
        dedent`
          🎉 Congratulation, you have already create a Atomemo Plugin!

          Run the following commands to start the plugin:
          ${colorize("bold", colorize("yellowBright", `cd ${flags.name}`))}
          ${colorize("bold", colorize("yellowBright", `bun install`))}
          ${colorize("bold", colorize("yellowBright", `bun run dev`))}

          In order to test your plugin in debugging mode, run the following command:
          ${colorize("bold", colorize("yellowBright", `atomemo plugin refresh-key`))}

          Then, run the following command to connect the plugin hub service.
          ${colorize("bold", colorize("yellowBright", `bun run ./dist`))}
        `,
      ),
    )
  }

  private nameIsValid(name: unknown) {
    return isString(name) && /^[a-z][a-z0-9_-]{2,62}[a-z0-9]$/.test(name)
  }

  private reconcileInteractiveFlag(flags: CommandFlags) {
    if (flags.interactive && this.nameIsValid(flags.name)) {
      flags.interactive = false
    }

    if (!flags.interactive && !this.nameIsValid(flags.name)) {
      this.log(
        colorize(
          "redBright",
          dedent`
            Without interactive mode, you should provide initial information manually.
            Use ${colorize("blue", "atomemo help plugin init")} to see all available options.
          `,
        ),
      )
      this.exit(0)
    }
  }

  private async runInteractiveMode(flags: CommandFlags) {
    this.log(dedent`
      Guiding you through creating a new plugin in interactive mode
      Please follow the instructions below to complete the process:\n
    `)

    try {
      flags.name = await this.collectName()
      flags.description = await this.collectDescription()
      flags.url = await this.collectURL()
      flags.language = await this.collectLanguage()
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        process.exit(0)
      }
      throw error
    }
  }

  private async collectName() {
    return await input({
      message: "What's the name of this new plugin:",
      pattern: /^[a-z][a-z0-9_-]{2,62}[a-z0-9]$/,
      patternError: dedent`
        You must provide a name for the new plugin:
          - Only lowercase letters, digits, underscores, and hyphens are allowed
          - Minimum length of 4 and maximum length of 64
          - Starts with a lowercase letter (not a digit)
          - Ends with a lowercase letter or digit (not underscore or hyphen)
      `,
    })
  }

  private async collectDescription() {
    return await input({
      message: "How do you describe this new plugin:",
      default: "A brief description of the plugin's functionality",
      prefill: "tab",
      pattern: /^.{16,256}$/,
      patternError: dedent`
        You must provide a description for the new plugin:
          - Allows any characters, minimum 16 characters, maximum 256 characters
      `,
    })
  }

  private async collectURL() {
    return await input({
      message: "What is the repository URL address (Optional):",
      default: "https://github.com/[user]/[repo]",
      prefill: "tab",
      validate: (value) => {
        const { success } = z
          .url({ normalize: true, protocol: /https?|git/ })
          .optional()
          .safeParse(value)
        return success || "You must provide a valid URL"
      },
    })
  }

  private async collectLanguage() {
    return await select({
      choices: [
        {
          disabled: true,
          name: "Elixir",
          value: "elixir",
        },
        {
          disabled: true,
          name: "Python",
          value: "python",
        },
        {
          name: "TypeScript",
          value: "typescript",
        },
      ],
      message:
        "What programming language do you prefer for developing this plugin?",
      theme: selectTheme,
    })
  }

  private async fetchSession(): Promise<{
    user: {
      name: string
      email: string
    }
    session: {
      updatedAt: string
      expiresAt: string
    }
  }> {
    const config = await configStore.load()

    if (!config.auth?.access_token) {
      throw new Error("Access token not found")
    }

    assert(config.auth?.endpoint, "Auth endpoint is required")

    const response = await fetch(
      `${config.auth.endpoint}/v1/auth/get-session`,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Choiceform (Atomemo Plugin CLI)",
          Authorization: `Bearer ${config.auth.access_token}`,
        },
      },
    )

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

    return (await response.json()) as {
      user: {
        name: string
        email: string
      }
      session: {
        updatedAt: string
        expiresAt: string
      }
    }
  }
}
