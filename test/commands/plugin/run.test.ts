import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin run", () => {
  it("runs plugin run cmd", async () => {
    const { stdout } = await runCommand("plugin run")
    expect(stdout).to.contain("hello world")
  })

  it("runs plugin run --name oclif", async () => {
    const { stdout } = await runCommand("plugin run --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
