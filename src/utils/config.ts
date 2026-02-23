import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { toMerged } from "es-toolkit/object"
import { z } from "zod"

function getConfigDir(): string {
  return process.env.CHOICEFORM_CONFIG_DIR ?? join(homedir(), ".choiceform")
}

function getConfigFile(): string {
  return join(getConfigDir(), "atomemo.json")
}

export type Environment = "staging" | "production"

const AuthEnvSchema = z.object({
  endpoint: z.url().optional(),
  access_token: z.string().optional(),
})

const HubEnvSchema = z.object({
  endpoint: z.url().optional(),
})

const ConfigSchema = z.object({
  auth: z
    .object({
      staging: AuthEnvSchema.optional(),
      production: AuthEnvSchema.optional(),
    })
    .optional(),
  hub: z
    .object({
      staging: HubEnvSchema.optional(),
      production: HubEnvSchema.optional(),
    })
    .optional(),
})

export type Config = z.infer<typeof ConfigSchema>

export async function save(config: Config): Promise<void> {
  const validated = ConfigSchema.parse(config)
  const configDir = getConfigDir()
  const configFile = getConfigFile()
  await fs.mkdir(configDir, { recursive: true })
  await fs.writeFile(configFile, JSON.stringify(validated, null, 2), "utf-8")
}

const defaultConfig: Config = {
  auth: {
    staging: { endpoint: "https://oneauth.choiceform.io" },
    production: { endpoint: "https://oneauth.atomemo.ai" },
  },
  hub: {
    staging: { endpoint: "https://automation-plugin-api.choiceform.io" },
    production: { endpoint: "https://plugin-hub.atomemo.ai" },
  },
}

function isNewFormat(data: unknown): boolean {
  if (!data || typeof data !== "object") return false
  const auth = (data as Record<string, unknown>).auth
  if (!auth || typeof auth !== "object") return false
  return "staging" in auth || "production" in auth
}

export async function load(): Promise<Config> {
  const configFile = getConfigFile()

  try {
    const content = await fs.readFile(configFile, "utf-8")
    const parsed = JSON.parse(content)

    if (isNewFormat(parsed)) {
      const result = ConfigSchema.parse(parsed)
      return toMerged(defaultConfig, result) as Config
    }
  } catch {
    // File doesn't exist or is unreadable
  }

  await save(defaultConfig)
  return defaultConfig
}

export async function update(updates: Partial<Config>): Promise<void> {
  const existing = await load()
  const merged = toMerged(existing ?? {}, updates)
  await save(merged as Config)
}
