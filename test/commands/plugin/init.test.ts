import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin init", () => {
  it("runs plugin init cmd", async () => {
    const { stdout } = await runCommand("plugin init")
    expect(stdout).to.contain("hello world")
  })

  it("runs plugin:init --name oclif", async () => {
    const { stdout } = await runCommand("plugin init --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
