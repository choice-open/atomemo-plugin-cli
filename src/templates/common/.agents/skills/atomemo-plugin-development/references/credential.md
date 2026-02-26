# Credential Development Guide

Credentials authenticate your plugin against external services.
They serve two distinct roles depending on where they're used:

- **Model credentials**: The `authenticate()` function runs and returns adapter config
  that Atomemo uses to route LLM API calls
- **Tool credentials**: The `authenticate()` function does NOT run; credential fields
  are passed directly to the tool's `invoke()` function as `args.credentials`

## File Location

```
src/credentials/<credential-name>.ts
```

## Complete Example (API Key for both Model and Tool use)

```typescript
import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const openaiCredential = {
  name: "openai-api-key",
  display_name: t("OPENAI_CREDENTIAL_DISPLAY_NAME"),
  description: t("OPENAI_CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: t("API_KEY_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,       // masks the value with ••••••
        placeholder: "sk-...",
        hint: t("API_KEY_HINT")
      }
    },
    {
      name: "base_url",
      type: "string",
      required: false,
      display_name: t("BASE_URL_DISPLAY_NAME"),
      default: "https://api.openai.com/v1",
      ui: { component: "input" }
    }
  ],
  // authenticate() is called for Model credentials only
  async authenticate({ parameters }) {
    return {
      adapter: "openai",                         // protocol type
      endpoint: parameters.base_url,
      headers: {
        Authorization: `Bearer ${parameters.api_key}`
      }
    }
  }
} satisfies CredentialDefinition
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier; referenced by `credential_name` in tool parameters |
| `display_name` | I18nText | User-facing name |
| `description` | I18nText | Explains what service this credential connects to |
| `icon` | string | Emoji or image URL |
| `parameters` | Property[] | Fields the user fills in (API keys, URLs, etc.) |
| `authenticate` | async function | Returns adapter config (for model credentials) |

## The `authenticate()` Function

Called only when the credential is used with a Model (not a Tool).
Returns an object that tells Atomemo how to call the LLM API:

```typescript
async authenticate({ parameters }) {
  return {
    adapter: "openai",      // "openai" | "anthropic" | "google" | "deepseek"
    endpoint: "https://api.openai.com/v1",
    headers: {
      Authorization: `Bearer ${parameters.api_key}`
    }
  }
}
```

## Supported Adapters

| Adapter | Use for |
|---------|---------|
| `"openai"` | OpenAI API and compatible endpoints |
| `"anthropic"` | Anthropic Claude API |
| `"google"` | Google Gemini API |
| `"deepseek"` | DeepSeek API |

## Using Credentials in Tools

When a tool needs a credential, declare a `credential_id` parameter:

```typescript
// In your tool's parameters array:
{
  name: "api_credential",
  type: "credential_id",
  required: true,
  display_name: t("API_CREDENTIAL_LABEL"),
  credential_name: "openai-api-key"   // must match the CredentialDefinition's name
}
```

Access in `invoke`:
```typescript
async invoke({ args }) {
  const cred = args.credentials["api_credential"]
  // cred contains all fields from the credential's parameters:
  const apiKey = cred.api_key
  const baseUrl = cred.base_url
}
```

Note: `authenticate()` is NOT called here. Raw credential fields flow directly.

## Security Best Practices

- Mark sensitive fields with `sensitive: true` — they'll be masked in the UI
- Never hardcode API keys in source code
- Use credentials for all authentication tokens, passwords, and secret keys
- The credential system ensures keys are stored and transmitted securely

## Registration in index.ts

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { openaiCredential } from "./credentials/openai-api-key"

const plugin = await createPlugin({ /* ... */ })
plugin.addCredential(openaiCredential)
plugin.run()
```
