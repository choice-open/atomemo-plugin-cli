import path from "node:path"
import checkbox, { Separator } from "@inquirer/checkbox"
import input from "@inquirer/input"
import select from "@inquirer/select"
import { Command, Flags } from "@oclif/core"
import type { OutputFlags } from "@oclif/core/interfaces"
import { colorize } from "@oclif/core/ux"
import { assert, isString } from "es-toolkit"
import { dedent } from "ts-dedent"
import z from "zod"
import { createPluginGenerator } from "../../utils/generator.js"
import { checkboxTheme, selectTheme } from "../../utils/theme.js"

type CommandFlags = OutputFlags<typeof PluginInit.flags>

const LOCALES = ["en_US", "zh_Hans", "ja_JP"]
const LANGUAGES = ["elixir", "python", "typescript"]
const PERMISSIONS = [
  "endpoints:register",
  "model:call_llm",
  "model:call_embedding",
  "model:call_moderation",
  "model:call_rerank",
  "model:call_stt",
  "model:call_tts",
  "storage:kv",
  "tools:invoke",
]

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
    author: Flags.string({
      char: "a",
      default: "",
      helpValue: "John Doe",
      summary: "Author name",
    }),
    email: Flags.string({
      char: "e",
      default: "",
      helpValue: "john.doe@example.com",
      summary: "Author email address",
    }),
    url: Flags.string({
      char: "u",
      default: "",
      summary: "Repository URL",
    }),
    locales: Flags.option({
      multiple: true,
      options: LOCALES,
    })({
      delimiter: ",",
      summary: "Provide READMEs in which languages",
    }),
    language: Flags.option({
      multiple: false,
      options: LANGUAGES,
    })({
      char: "l",
      summary: "Programming language to use for plugin development",
    }),
    type: Flags.option({
      multiple: false,
      options: ["extension", "llm", "tool", "trigger"],
    })({
      char: "t",
      summary: "Plugin type",
    }),
    permissions: Flags.option({
      multiple: true,
      options: PERMISSIONS,
    })({
      char: "p",
      delimiter: ",",
      summary: "Permissions required by the plugin",
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

    const generator = createPluginGenerator(flags.language, {
      props: { ...flags, createdAt: new Date().toISOString() },
      target: path.join(process.cwd(), flags.name),
    })

    await generator.generate()
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
            Use ${colorize("blue", "automation help plugin init")} to see all available options.
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
      flags.author = await this.collectAuthor()
      flags.email = await this.collectEmail()
      flags.url = await this.collectURL()
      flags.locales = await this.collectLocales(flags)
      flags.language = await this.collectLanguage()
      flags.type = await this.collectType()
      flags.permissions = await this.collectPermissions(flags)
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

  private async collectAuthor() {
    return await input({
      message: "Who is the author of the new plugin:",
      default: "John Doe",
      prefill: "tab",
      pattern: /^.{2,64}$/,
      patternError: dedent`
        You must provide the author name:
          - Allows any characters, minimum 2 characters, maximum 64 characters
      `,
    })
  }

  private async collectEmail() {
    return await input({
      message: "What is the email address of the author:",
      default: "john.doe@example.com",
      prefill: "tab",
      pattern:
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/,
      patternError: dedent`You must provide the author email`,
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

  private async collectLocales(flags: CommandFlags) {
    const values = await checkbox({
      choices: [
        {
          checked: flags.locales?.includes("en_US"),
          disabled: "(required)",
          name: "English",
          description: "English (United States)",
          value: "en_US",
        },
        {
          checked: flags.locales?.includes("zh_Hans"),
          disabled: false,
          name: "简体中文",
          description: "Simplified Chinese (China)",
          value: "zh_Hans",
        },
        {
          checked: flags.locales?.includes("ja_JP"),
          disabled: false,
          name: "日本語",
          description: "Japanese (Japan)",
          value: "ja_JP",
        },
      ],
      message: "Provide READMEs in which language(s)?",
      theme: checkboxTheme,
    })

    return ["en_US", ...values]
  }

  private async collectLanguage() {
    return await select({
      choices: [
        {
          name: "Elixir",
          value: "elixir",
        },
        {
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

  private async collectType() {
    return await select({
      choices: [
        {
          name: "Extension",
          value: "extension",
          description: "Extend capabilities by integrating with external APIs.",
        },
        {
          name: "Model",
          value: "llm",
          description: "Introduce more LLMs to enhance AI capabilities.",
        },
        {
          name: "Tool",
          value: "tool",
          description: "Complete specific tasks, typically invoked by LLMs.",
        },
        {
          name: "Trigger",
          value: "trigger",
          description: "Run workflows by receiving events through webhooks.",
        },
      ],
      message: dedent`
        ${colorize("blue", "Choose the type of the new plugin")}

        Plugins can extend the platform's capabilities in multiple ways, making workflows more flexible and powerful.
        Based on your specific requirement, plugins can be categorized into the following types:

          - ${colorize("yellowBright", "Extension")}: Provide more functionality to workflows by integrating external service APIs
          - ${colorize("yellowBright", "Model")}:     Access more large language models to enrich the AI capabilities of workflows
          - ${colorize("yellowBright", "Tool")}:      Customized logic to perform specific tasks, typically invoked by LLMs and/or Agents
          - ${colorize("yellowBright", "Trigger")}:   Receive external events through webhooks to start workflows with initial input data

        Please select the matching type from the following options:
      `,
      theme: selectTheme,
    })
  }

  private async collectPermissions(flags: CommandFlags) {
    return await checkbox({
      choices: [
        new Separator(colorize("yellowBright", " ⎯⎯⎯⎯⎯  Endpoints ⎯⎯⎯⎯⎯")),
        {
          checked: flags.permissions?.includes("endpoints:register"),
          value: "endpoints:register",
          description: "Ability to register API endpoints",
        },
        new Separator(colorize("yellowBright", " ⎯⎯⎯⎯⎯    Model   ⎯⎯⎯⎯⎯")),
        {
          checked: flags.permissions?.includes("model:call_llm"),
          value: "model:call_llm",
          description: "Ability to call LLMs",
        },
        {
          checked: flags.permissions?.includes("model:call_embedding"),
          value: "model:call_embedding",
          description: "Ability to call embeddings models",
        },
        {
          checked: flags.permissions?.includes("model:call_moderation"),
          value: "model:call_moderation",
          description: "Ability to call moderation models",
        },
        {
          checked: flags.permissions?.includes("model:call_rerank"),
          value: "model:call_rerank",
          description: "Ability to call rerank models",
        },
        {
          checked: flags.permissions?.includes("model:call_stt"),
          value: "model:call_stt",
          description: "Ability to call STT models",
        },
        {
          checked: flags.permissions?.includes("model:call_tts"),
          value: "model:call_tts",
          description: "Ability to call TTS models",
        },
        new Separator(colorize("yellowBright", " ⎯⎯⎯⎯⎯   Storage  ⎯⎯⎯⎯⎯")),
        {
          checked: flags.permissions?.includes("storage:kv"),
          value: "storage:kv",
          description: "Ability to use key-value storage",
        },
        new Separator(colorize("yellowBright", " ⎯⎯⎯⎯⎯    Tools   ⎯⎯⎯⎯⎯")),
        {
          checked: flags.permissions?.includes("tools:invoke"),
          value: "tools:invoke",
          description: "Ability to invoke other tools",
        },
      ],
      loop: false,
      pageSize: 15,
      message: "Select required permissions for the plugin:",
      theme: checkboxTheme,
    })
  }
}
