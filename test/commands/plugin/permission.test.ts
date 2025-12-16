import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin permission", () => {
  it("runs plugin permission cmd", async () => {
    const { stdout } = await runCommand("plugin permission")
    expect(stdout).to.contain("hello world")
  })

  it("runs plugin permission --name oclif", async () => {
    const { stdout } = await runCommand("plugin permission --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
