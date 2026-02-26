# Tool Plugin Development Guide

Tools are functions or external API integrations that Atomemo workflows can invoke.
Examples: web search, image generation, data transformation, sending emails.

## File Location

```
src/tools/<tool-name>.ts
```

## Complete Example

Always import and use `t()` for all user-facing strings — it keeps translations
centralized in the `i18n/` directory managed by the SDK.

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const weatherTool = {
  name: "weather-lookup",           // unique within plugin; kebab-case recommended
  display_name: t("WEATHER_TOOL_DISPLAY_NAME"),
  description: t("WEATHER_TOOL_DESCRIPTION"),
  icon: "🌤️",                       // emoji or image URL
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
        support_expression: true,   // allows referencing upstream node data
        width: "full"
      }
    }
  ],
  async invoke({ args }) {
    const { parameters, credentials } = args
    const location = parameters.location

    // Call your external API here
    const result = await fetchWeather(location)
    return { temperature: result.temp, condition: result.sky }
    // Must return a JSON-serializable object
  }
} satisfies ToolDefinition
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier within the plugin |
| `display_name` | I18nText | User-facing name |
| `description` | I18nText | Short description of what the tool does |
| `icon` | string | Emoji or image URL |
| `parameters` | Property[] | Input parameter definitions |
| `invoke` | async function | Business logic; receives `args`, returns result |

## The `invoke` Function

```typescript
async invoke({ args }) {
  const { parameters, credentials } = args

  // parameters: object matching your declared parameter schema
  // credentials: credential objects keyed by credential_id field name
  //   e.g., credentials["my_api_key"] = { api_key: "sk-..." }

  return { /* JSON-serializable result */ }
}
```

The return value is passed back to the Atomemo workflow as the tool's output.
Return anything JSON-serializable: objects, arrays, strings, numbers.

## Using Credentials in Tools

When your tool needs an API key or token, declare a `credential_id` parameter:

```typescript
parameters: [
  {
    name: "api_credential",
    type: "credential_id",
    required: true,
    display_name: t("API_CREDENTIAL_DISPLAY_NAME"),
    credential_name: "my-api-credential"  // matches the credential's name field
  },
  { name: "query", type: "string", required: true, /* ... */ }
]
```

Then access in `invoke`:
```typescript
async invoke({ args }) {
  const cred = args.credentials["api_credential"]
  const apiKey = cred.api_key   // field names from your CredentialDefinition
  // ...
}
```

See `credential.md` for how to define the credential itself.

## Registration in index.ts

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { weatherTool } from "./tools/weather-lookup"

const plugin = await createPlugin({ /* ... */ })
plugin.addTool(weatherTool)
plugin.run()
```

## Multiple Tools

Register each tool separately:
```typescript
plugin.addTool(searchTool)
plugin.addTool(weatherTool)
plugin.addTool(imageGenTool)
```

## Parameter Configuration

For detailed parameter types and UI options, see `declarative-parameters.md`.

Quick reference for common patterns:

```typescript
// Text input
{ name: "query", type: "string", required: true,
  ui: { component: "input", support_expression: true } }

// Multi-line text
{ name: "prompt", type: "string",
  ui: { component: "textarea", width: "full" } }

// Dropdown selection
{ name: "format", type: "string",
  enum: ["json", "markdown", "plain"],
  ui: { component: "select" } }

// Number with range
{ name: "limit", type: "number", default: 10,
  minimum: 1, maximum: 100,
  ui: { component: "number-input" } }

// Boolean toggle
{ name: "include_metadata", type: "boolean", default: false,
  ui: { component: "switch" } }
```
