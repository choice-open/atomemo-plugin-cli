# Declarative Parameters — Practical Examples

Ready-to-copy patterns for common parameter configurations.

## Table of Contents
- [Basic String Input](#basic-string-input)
- [Enum Select](#enum-select)
- [Nested Object with Collapsible Panel](#nested-object-with-collapsible-panel)
- [Array with Key-Value Editor](#array-with-key-value-editor)
- [Discriminated Union (Multi-Variant)](#discriminated-union-multi-variant)
- [Conditional Display (Linked Parameters)](#conditional-display-linked-parameters)
- [Credential Usage](#credential-usage)
- [Complete Tool Example — Firecrawl Scrape](#complete-tool-example--firecrawl-scrape)

---

## Basic String Input

```typescript
{
  name: "query",
  type: "string",
  required: true,
  display_name: { en_US: "Search Query" },
  ui: {
    component: "input",
    placeholder: { en_US: "Enter your search query..." }
  }
}
```

---

## Enum Select

```typescript
{
  name: "output_format",
  type: "string",
  required: true,
  default: "markdown",
  enum: ["markdown", "html", "text"],
  display_name: { en_US: "Output Format" },
  ui: { component: "select" }
}
```

Searchable select (useful for long lists):

```typescript
{
  name: "language",
  type: "string",
  enum: ["en", "zh", "ja", "fr", "de", "es", "pt", "ru"],
  ui: { component: "select", options: { searchable: true } }
}
```

---

## Nested Object with Collapsible Panel

Group related optional settings under a collapsible panel so they don't clutter the main form:

```typescript
{
  name: "advanced_options",
  type: "object",
  display_name: { en_US: "Advanced Options" },
  ui: { component: "collapsible-panel" },
  properties: [
    {
      name: "timeout",
      type: "integer",
      default: 30,
      minimum: 1,
      maximum: 300,
      display_name: { en_US: "Timeout (seconds)" }
    },
    {
      name: "retry_count",
      type: "integer",
      default: 3,
      minimum: 0,
      maximum: 10,
      display_name: { en_US: "Retry Count" }
    },
    {
      name: "user_agent",
      type: "string",
      display_name: { en_US: "Custom User-Agent" },
      ui: { component: "input" }
    }
  ]
}
```

---

## Array with Key-Value Editor

Collect arbitrary header/metadata pairs:

```typescript
{
  name: "headers",
  type: "array",
  display_name: { en_US: "Custom Headers" },
  ui: { component: "key-value-editor" },
  items: {
    type: "object",
    properties: [
      { name: "key", type: "string" },
      { name: "value", type: "string" }
    ]
  }
}
```

Array of structured objects (uses `array-section` in Compound mode):

```typescript
{
  name: "selectors",
  type: "array",
  display_name: { en_US: "CSS Selectors" },
  ui: { component: "array-section" },
  items: {
    type: "object",
    properties: [
      { name: "selector", type: "string", display_name: { en_US: "Selector" } },
      {
        name: "action",
        type: "string",
        enum: ["extract", "remove", "click"],
        default: "extract"
      }
    ]
  }
}
```

---

## Discriminated Union (Multi-Variant)

Show entirely different parameter sets based on a mode selection:

```typescript
{
  name: "auth_config",
  type: "discriminated_union",
  display_name: { en_US: "Authentication" },
  discriminator: "auth_type",
  discriminator_ui: { component: "select" },
  any_of: [
    {
      name: "api_key_variant",
      type: "object",
      properties: [
        { name: "auth_type", type: "string", constant: "api_key" },
        {
          name: "api_key",
          type: "encrypted_string",
          required: true,
          display_name: { en_US: "API Key" },
          ui: { component: "encrypted-input" }
        }
      ]
    },
    {
      name: "oauth_variant",
      type: "object",
      properties: [
        { name: "auth_type", type: "string", constant: "oauth" },
        {
          name: "client_id",
          type: "string",
          required: true,
          display_name: { en_US: "Client ID" }
        },
        {
          name: "client_secret",
          type: "encrypted_string",
          required: true,
          display_name: { en_US: "Client Secret" },
          ui: { component: "encrypted-input" }
        }
      ]
    },
    {
      name: "none_variant",
      type: "object",
      properties: [
        { name: "auth_type", type: "string", constant: "none" }
      ]
    }
  ]
}
```

---

## Conditional Display (Linked Parameters)

Show or hide fields based on other field values:

```typescript
// "model" field only appears when provider is "openai"
{
  name: "model",
  type: "string",
  display_name: { en_US: "Model" },
  enum: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
  display: { show: { provider: { $eq: "openai" } } }
}

// "temperature" hidden when mode is "deterministic"
{
  name: "temperature",
  type: "number",
  default: 0.7,
  display: { hide: { mode: "deterministic" } },
  ui: { component: "slider", options: { min: 0, max: 2, step: 0.1 } }
}

// "api_base_url" shown only when custom_endpoint is toggled on
{
  name: "api_base_url",
  type: "string",
  display_name: { en_US: "API Base URL" },
  display: { show: { custom_endpoint: true } }
}

// Nested path: show only when output object's format is "json"
{
  name: "indent_size",
  type: "integer",
  default: 2,
  display: { show: { "output.format": "json" } }
}
```

---

## Credential Usage

Let the user select a pre-configured credential. The credential data is available in `args.credentials` inside `invoke()`.

**Parameter definition:**

```typescript
{
  name: "firecrawl_credential",
  type: "credential_id",
  required: true,
  display_name: { en_US: "Firecrawl API Key" },
  credential_name: "firecrawl-api-key"
}
```

**Access in invoke:**

```typescript
async invoke(args) {
  const cred = args.credentials["firecrawl_credential"]
  const apiKey = cred.api_key

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: args.parameters.url })
  })
  // ...
}
```

---

## Complete Tool Example — Firecrawl Scrape

A production-style tool definition showing how multiple parameter types work together:

```typescript
import { t } from "../i18n/i18n-node"
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js"

export const firecrawlScrapeTool = {
  name: "firecrawl_scrape",
  display_name: t("FIRECRAWL_SCRAPE_DISPLAY_NAME"),
  description: t("FIRECRAWL_SCRAPE_DESCRIPTION"),

  parameters: [
    // Credential selector
    {
      name: "credential",
      type: "credential_id",
      required: true,
      display_name: t("FIRECRAWL_CREDENTIAL_LABEL"),
      credential_name: "firecrawl-api-key"
    },

    // Target URL
    {
      name: "url",
      type: "string",
      required: true,
      display_name: t("URL_LABEL"),
      ui: {
        component: "input",
        placeholder: { en_US: "https://example.com/page" }
      }
    },

    // Output format
    {
      name: "formats",
      type: "array",
      display_name: t("OUTPUT_FORMATS_LABEL"),
      default: ["markdown"],
      ui: { component: "multi-select" },
      items: {
        type: "string",
        enum: ["markdown", "html", "rawHtml", "screenshot", "links"]
      }
    },

    // Actions (advanced — collapsible)
    {
      name: "actions",
      type: "object",
      display_name: t("ACTIONS_LABEL"),
      ui: { component: "collapsible-panel" },
      properties: [
        {
          name: "wait_for",
          type: "integer",
          default: 0,
          minimum: 0,
          maximum: 10000,
          display_name: t("WAIT_FOR_LABEL"),
          ui: {
            component: "number-input",
            hint: { en_US: "Milliseconds to wait after page load" }
          }
        },
        {
          name: "screenshot",
          type: "boolean",
          default: false,
          display_name: t("SCREENSHOT_LABEL"),
          ui: { component: "switch" }
        },
        {
          name: "full_page_screenshot",
          type: "boolean",
          default: false,
          display_name: t("FULL_PAGE_SCREENSHOT_LABEL"),
          ui: { component: "switch" },
          // Only meaningful when screenshot is enabled
          display: { show: { "actions.screenshot": true } }
        }
      ]
    },

    // Page options (advanced — collapsible)
    {
      name: "page_options",
      type: "object",
      display_name: t("PAGE_OPTIONS_LABEL"),
      ui: { component: "collapsible-panel" },
      properties: [
        {
          name: "only_main_content",
          type: "boolean",
          default: true,
          display_name: t("ONLY_MAIN_CONTENT_LABEL"),
          ui: { component: "switch" }
        },
        {
          name: "include_tags",
          type: "array",
          display_name: t("INCLUDE_TAGS_LABEL"),
          ui: { component: "tag-input" },
          items: { type: "string" }
        },
        {
          name: "exclude_tags",
          type: "array",
          display_name: t("EXCLUDE_TAGS_LABEL"),
          ui: { component: "tag-input" },
          items: { type: "string" }
        },
        {
          name: "headers",
          type: "array",
          display_name: t("CUSTOM_HEADERS_LABEL"),
          ui: { component: "key-value-editor" },
          items: {
            type: "object",
            properties: [
              { name: "key", type: "string" },
              { name: "value", type: "string" }
            ]
          }
        }
      ]
    }
  ],

  async invoke(args) {
    const cred = args.credentials["credential"]
    const { url, formats, actions, page_options } = args.parameters

    const body: Record<string, unknown> = {
      url,
      formats: formats ?? ["markdown"]
    }

    if (actions) {
      body.actions = {
        waitFor: actions.wait_for,
        screenshot: actions.screenshot,
        fullPageScreenshot: actions.full_page_screenshot
      }
    }

    if (page_options) {
      body.pageOptions = {
        onlyMainContent: page_options.only_main_content,
        includeTags: page_options.include_tags,
        excludeTags: page_options.exclude_tags,
        headers: Object.fromEntries(
          (page_options.headers ?? []).map(({ key, value }) => [key, value])
        )
      }
    }

    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cred.api_key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      throw new Error(`Firecrawl API error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data
  }
} satisfies ToolDefinition
```
