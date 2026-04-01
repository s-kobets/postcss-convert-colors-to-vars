import { execFileSync } from "node:child_process"

const projectRoot = process.cwd()

describe("package entrypoints", () => {
  test("supports ESM import via package exports", () => {
    const stdout = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
          import plugin from "postcss-convert-colors-to-vars"
          process.stdout.write(JSON.stringify({
            type: typeof plugin,
            postcss: plugin.postcss,
          }))
        `,
      ],
      {
        cwd: projectRoot,
        encoding: "utf8",
      },
    )

    expect(JSON.parse(stdout)).toEqual({
      type: "function",
      postcss: true,
    })
  })

  test("supports CommonJS require via package exports", () => {
    const stdout = execFileSync(
      process.execPath,
      [
        "-e",
        `
          const plugin = require("postcss-convert-colors-to-vars")
          process.stdout.write(JSON.stringify({
            type: typeof plugin,
            defaultType: typeof plugin.default,
            postcss: plugin.default.postcss,
          }))
        `,
      ],
      {
        cwd: projectRoot,
        encoding: "utf8",
      },
    )

    expect(JSON.parse(stdout)).toEqual({
      type: "object",
      defaultType: "function",
      postcss: true,
    })
  })
})
