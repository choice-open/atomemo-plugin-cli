import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin pack", () => {
  it("runs plugin pack cmd", async () => {
    const { stdout } = await runCommand("plugin pack")
    expect(stdout).to.contain("hello world")
  })

  it("runs plugin pack --name oclif", async () => {
    const { stdout } = await runCommand("plugin pack --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
