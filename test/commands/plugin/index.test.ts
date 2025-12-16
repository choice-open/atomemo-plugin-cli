import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin", () => {
  it("run plugin should show topic help", async () => {
    const { stdout } = await runCommand("plugin")
    expect(stdout).to.contain("Manages your plugin via subcommands")
  })
})
