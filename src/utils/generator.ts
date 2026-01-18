import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises"
import { basename, extname, join } from "node:path"
import { Eta } from "eta"

export interface PluginGenerator {
  context: {
    props: Record<string, unknown>
    target: string
  }

  renderer: Eta

  type: string

  generate(): Promise<void>
}

export function createPluginGenerator(
  type: PluginGenerator["type"],
  context: PluginGenerator["context"],
): PluginGenerator {
  switch (type) {
    case "typescript":
      return new TypeScriptPluginGenerator(context)
    default:
      throw new Error(`Plugin generator type "${type}" is not implemented.`)
  }
}

export class TypeScriptPluginGenerator implements PluginGenerator {
  type = "typescript" as const

  renderer = new Eta({
    autoTrim: false,
    autoEscape: false,
    varName: "props",
    views: join(import.meta.dirname, "../templates"),
  })

  constructor(public context: PluginGenerator["context"]) {
    this.context.props.permissions = this.groupPermissions(
      (this.context.props.permissions as string[]) ?? [],
    )
  }

  async generate() {
    await Promise.all([
      this.#generateFiles(join(import.meta.dirname, "../templates/common")),
      this.#generateFiles(
        join(
          import.meta.dirname,
          `../templates/${this.context.props.language}`,
        ),
      ),
    ])
  }

  async #generateFiles(source: string, target: string = this.context.target) {
    await mkdir(target, { recursive: true })

    for (const entry of await readdir(source, { withFileTypes: true })) {
      const sourcePath = join(source, entry.name)

      if (entry.isDirectory()) {
        await this.#generateFiles(sourcePath, join(target, entry.name))
      } else {
        if (extname(sourcePath).toLowerCase() === ".eta") {
          const fileName = basename(sourcePath, extname(sourcePath))
          const templatePath = sourcePath.replace(
            this.renderer.config.views ?? "",
            "",
          )
          const content = this.renderer.render(templatePath, this.context.props)
          const targetPath = join(target, fileName)
          await writeFile(targetPath, content, "utf-8")
        } else {
          await copyFile(sourcePath, join(target, entry.name))
        }
      }
    }
  }

  private groupPermissions(permissions: string[]) {
    return permissions
      .reduce<Array<{ scope: string; entries: string[] }>>(
        (finale, permission) => {
          const [scope, entry] = permission.split(":")
          const existing = finale.find((item) => item.scope === scope)
          if (existing) {
            existing.entries.push(entry)
          } else {
            finale.push({ scope, entries: [entry] })
          }
          return finale
        },
        [],
      )
      .sort((a, b) => a.scope.localeCompare(b.scope, "en"))
  }
}
