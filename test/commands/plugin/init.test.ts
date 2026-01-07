import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin init", () => {
  it("runs plugin init --no-interactive", async () => {
    const { stdout } = await runCommand("plugin init --no-interactive")
    expect(stdout).to.contain(
      "Without interactive mode, you should provide initial information manually.",
    )
  })

  it("runs plugin:init --name testing", async () => {
    const { stdout } = await runCommand("plugin init --name testing")
    expect(stdout).to.contain("")
  })
})
