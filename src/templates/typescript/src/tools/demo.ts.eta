import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

interface ToolArgs {
  parameters: { location: string }
  credentials: Record<string, { api_key: string }>
}

export const demoTool = {
  name: "demo-tool",
  display_name: t("DEMO_TOOL_DISPLAY_NAME"),
  description: t("DEMO_TOOL_DESCRIPTION"),
  icon: "🧰",
  parameters: [
    {
      name: "location",
      type: "string",
      required: true,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }: { args: ToolArgs }) {
    return {
      message: `Testing the plugin with location: ${args.parameters.location}`,
    }
  },
} satisfies ToolDefinition
