import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { toMerged } from "es-toolkit/object"
import { z } from "zod"

function getConfigDir(): string {
  return process.env.CHOICEFORM_CONFIG_DIR ?? join(homedir(), ".choiceform")
}

function getConfigFile(): string {
  return join(getConfigDir(), "automation.json")
}

const ConfigSchema = z.object({
  auth: z
    .object({
      endpoint: z.url().optional(),
      access_token: z.string().optional(),
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

export async function load(): Promise<Config> {
  const configFile = getConfigFile()

  try {
    await fs.access(configFile)
  } catch (error) {
    if (
      error instanceof Error &&
      ("code" in error ? error.code === "ENOENT" : false)
    ) {
      const defaultConfig: Config = {
        auth: {
          endpoint:
            process.env.NODE_ENV === "production"
              ? "https://oneauth.choiceform.io"
              : "http://localhost:5001",
        },
      }
      await save(defaultConfig)
      return defaultConfig
    }
    throw error
  }

  const content = await fs.readFile(configFile, "utf-8")
  const parsed = JSON.parse(content)
  return ConfigSchema.parse(parsed)
}

export async function update(updates: Partial<Config>): Promise<void> {
  const existing = await load()
  const merged = toMerged(existing ?? {}, updates)
  await save(merged as Config)
}
