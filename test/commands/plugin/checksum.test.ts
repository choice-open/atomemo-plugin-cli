import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("plugin checksum", () => {
  it("runs plugin checksum cmd", async () => {
    const { stdout } = await runCommand("plugin checksum")
    expect(stdout).to.contain("hello world")
  })

  it("runs plugin checksum --name oclif", async () => {
    const { stdout } = await runCommand("plugin checksum --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
