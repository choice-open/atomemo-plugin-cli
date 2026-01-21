import { describe, expect, it, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn(() => ({
    addCredential: vi.fn(),
    addTool: vi.fn(),
    addModel: vi.fn(),
    run: vi.fn(),
  })),
}))

// Mock i18n
vi.mock("./i18n/i18n-node", () => ({
  t: vi.fn((key: string) => key),
}))

vi.mock("./i18n/i18n-util", () => ({
  locales: ["en-US"],
}))

vi.mock("./i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn(),
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"

describe("createPlugin", () => {
  it("should create a plugin object", () => {
    const plugin = createPlugin({
      name: "test-plugin",
      display_name: {en_US: "Test Plugin"},
      description: {en_US: "A test plugin"},
      icon: "🧪",
      author: "Test",
      email: "test@test.com",
      version: "1.0.0",
      repo: "https://github.com/test/test",
      locales: ["en"],
      transporterOptions: {},
    })

    expect(plugin).toBeDefined()
    expect(plugin).toHaveProperty("run")
    expect(typeof plugin.run).toBe("function")
  })

  it("should be able to call run() method", () => {
    const plugin = createPlugin({
      name: "test-plugin",
      display_name: {en_US: "Test Plugin"},
      description: {en_US: "A test plugin"},
      icon: "🧪",
      author: "Test",
      email: "test@test.com",
      version: "1.0.0",
      repo: "https://github.com/test/test",
      locales: ["en"],
      transporterOptions: {},
    })

    expect(() => plugin.run()).not.toThrow()
    expect(plugin.run).toHaveBeenCalledTimes(1)
  })
})
