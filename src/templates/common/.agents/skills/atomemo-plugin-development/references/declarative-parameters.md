# Declarative Parameters Reference

Parameters are declared as configuration objects — the platform renders the UI
automatically. No need to write form components.

Each parameter has two parts:
- **Property**: data model (type, constraints, default value)
- **PropertyUI** (`ui` field): how it renders in the form

## Table of Contents
- [Common Fields (PropertyBase)](#common-fields)
- [String](#string)
- [Number / Integer](#number--integer)
- [Boolean](#boolean)
- [Object](#object)
- [Array](#array)
- [Credential ID](#credential-id)
- [Encrypted String](#encrypted-string)
- [Discriminated Union](#discriminated-union)
- [Display Conditions](#display-conditions)
- [PropertyUI Common Options](#propertyui-common-options)
- [I18nText](#i18ntext)

---

## Common Fields

All parameter types share these fields (PropertyBase):

```typescript
{
  name: string                    // identifier; used as key in args.parameters
                                  // only letters, digits, underscores (no hyphens)
  display_name?: I18nText         // label shown in UI
  required?: boolean              // whether the field must be filled
  display?: {
    show?: DisplayCondition       // show when condition is true
    hide?: DisplayCondition       // hide when condition is true
  }
  ai?: { llm_description?: string }  // hint for LLM when auto-filling
  ui?: PropertyUI                 // rendering config (see below)
}
```

---

## String

```typescript
{
  name: "format",
  type: "string",
  required: true,
  default: "json",
  enum: ["json", "markdown", "plain"],   // restricts to these values
  max_length: 500,
  min_length: 1,
  ui: { component: "select" }
}
```

**UI components:**

| Component | Description |
|-----------|-------------|
| `"input"` | Single-line text input (default) |
| `"textarea"` | Multi-line text |
| `"select"` | Dropdown (requires `enum`); options: `{ searchable?: boolean }` |
| `"radio-group"` | Radio buttons (requires `enum`) |
| `"code-editor"` | Syntax-highlighted code input; options: `{ language?: "json" \| "javascript" \| "python3" \| "html" \| "css", rows?: number }` |
| `"emoji-picker"` | Emoji selection |
| `"color-picker"` | Color value picker |

---

## Number / Integer

```typescript
{
  name: "temperature",
  type: "number",       // or "integer" for whole numbers only
  default: 0.7,
  minimum: 0.0,
  maximum: 2.0,
  ui: { component: "slider", options: { min: 0, max: 2, step: 0.1 } }
}
```

**UI components:** `"number-input"`, `"select"`, `"slider"`

---

## Boolean

```typescript
{
  name: "stream",
  type: "boolean",
  default: true,
  ui: { component: "switch" }   // only option
}
```

---

## Object

Groups related fields together. Child fields are defined in `properties`.

```typescript
{
  name: "pagination",
  type: "object",
  ui: { component: "section" },
  properties: [
    { name: "page", type: "integer", default: 1 },
    { name: "page_size", type: "integer", default: 20, maximum: 100 }
  ]
}
```

**UI components:**

| Component | Description |
|-----------|-------------|
| flat (default) | Children rendered inline |
| `"collapsible-panel"` | Expandable/collapsible container |
| `"section"` | Named section with indented children |
| `"code-editor"` | Raw JSON editing |
| `"json-schema-editor"` | Visual schema editor |
| `"conditions-editor"` | Rule/condition builder |

---

## Array

List of items. Item schema is defined in `items`.

```typescript
{
  name: "tags",
  type: "array",
  ui: { component: "tag-input" },    // free-form text list
  items: { type: "string" }
}
```

```typescript
{
  name: "categories",
  type: "array",
  ui: { component: "multi-select" },   // requires items.enum
  items: {
    type: "string",
    enum: ["news", "tech", "sports", "finance"]
  }
}
```

**UI components:**

| Component | Description |
|-----------|-------------|
| `"array-section"` | Auto-detects mode: **Simple** (primitive `items` → tag-like list) or **Compound** (`object` items → structured rows with add/remove) |
| `"multi-select"` | Multi-select from enum options |
| `"tag-input"` | Free-form text tags |
| `"key-value-editor"` | Key-value pair list |
| `"slider"` | Range selection [min, max] |

---

## Credential ID

Lets the user select a configured credential. The selected credential's data
is available in `args.credentials` inside `invoke()`.

```typescript
{
  name: "openai_credential",
  type: "credential_id",
  required: true,
  display_name: { en_US: "OpenAI API Key" },
  credential_name: "openai-api-key"   // filter: only show credentials with this name
}
```

Access in invoke:
```typescript
const cred = args.credentials["openai_credential"]
const apiKey = cred.api_key
```

---

## Encrypted String

Like `string` but stored encrypted. Used for sensitive values that aren't
managed through the full Credentials system.

```typescript
{
  name: "webhook_secret",
  type: "encrypted_string",
  required: true,
  ui: { component: "encrypted-input" }
}
```

---

## Discriminated Union

Shows different parameter sets based on a selector field. Great for "mode"
switches where different options reveal different fields.

```typescript
{
  name: "output_config",
  type: "discriminated_union",
  discriminator: "format",
  discriminator_ui: { component: "select" },   // or "switch" | "radio-group"
  any_of: [
    {
      name: "json_variant",
      type: "object",
      properties: [
        { name: "format", type: "string", constant: "json" },   // constant = this variant's key
        { name: "indent", type: "integer", default: 2 }
      ]
    },
    {
      name: "markdown_variant",
      type: "object",
      properties: [
        { name: "format", type: "string", constant: "markdown" },
        { name: "include_toc", type: "boolean", default: false }
      ]
    }
  ]
}
```

Each variant must have a field matching `discriminator` with a unique `constant` value.

---

## Display Conditions

Control visibility of fields using MongoDB-like query syntax.

**Execution order:** `show` is evaluated before `hide`. Fields are visible by default.
If both `show` and `hide` are specified, `show` runs first; `hide` can then override it.

```typescript
// Show "api_version" only when provider is "openai"
{
  name: "api_version",
  display: { show: { provider: { $eq: "openai" } } }
}

// Hide "temperature" when mode is "deterministic"
{
  name: "temperature",
  display: { hide: { mode: "deterministic" } }
}

// Show when format is json OR markdown
{
  display: { show: { format: { $in: ["json", "markdown"] } } }
}

// AND condition: advanced mode AND streaming enabled
{
  display: { show: { $and: [{ mode: "advanced" }, { stream: true }] } }
}

// Nested path: match a value deep in an object parameter
{
  display: { show: { "config.output.format": "json" } }
}

// Case-insensitive regex using $options
{
  display: { show: { url: { $regex: "^https", $options: "i" } } }
}
```

**Operators:** `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`,
`$exists`, `$regex`, `$options` (regex flags, e.g. `"i"`), `$mod`, `$size`

**Logical:** `$and`, `$or`, `$nor`

**Nested paths:** Use dot notation `"a.b.c"` as the condition key to target nested fields.

---

## PropertyUI Common Options

These options apply to all component types:

```typescript
ui: {
  disabled?: boolean              // grayed out, not editable
  hint?: I18nText                 // help text shown below the field
  placeholder?: I18nText          // placeholder text
  readonly?: boolean              // visible but cannot be edited
  sensitive?: boolean             // mask value as ••••••
  support_expression?: boolean    // allow referencing upstream node data
  width?: "small" | "medium" | "full"
  indentation?: number            // visual indent (2–80, even numbers)
  display_none?: boolean          // hidden from UI but data is preserved
}
```

---

## I18nText

All user-facing strings support i18n. Always use the `t()` helper — it keeps
translations centralized in the SDK-managed `i18n/` directory:

```typescript
import { t } from "../i18n/i18n-node"

display_name: t("MY_LABEL_KEY"),
hint: t("MY_LABEL_HINT"),
placeholder: t("MY_LABEL_PLACEHOLDER"),
```

Only use inline `I18nText` objects as a last resort (e.g., test fixtures):
```typescript
// Fallback only — avoid in production plugin code
display_name: { en_US: "My Label", zh_Hans: "我的标签" }
```

---

## Reusable Parameter Patterns

Extract shared parameter groups into constants to avoid repetition:

```typescript
// shared/parameters.ts
export const credentialParam = (credentialName: string) => ({
  name: "credential",
  type: "credential_id" as const,
  required: true,
  display_name: { en_US: "API Credential" },
  credential_name: credentialName
})

export const paginationParams = [
  { name: "page", type: "integer" as const, default: 1 },
  { name: "page_size", type: "integer" as const, default: 20, maximum: 100 }
]
```
