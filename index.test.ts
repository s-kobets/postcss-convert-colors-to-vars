import postcss from "postcss"

import convertColorsToVars from "./src"

describe("postcss-convert-colors-to-vars package", () => {
  test("replaces matched colors using variablePrefix", async () => {
    const result = await postcss([
      convertColorsToVars({
        colors: {
          "yellow-90": "#AABBCC",
          "green-500": "#00594C",
        },
        variablePrefix: "--sk-color-",
      }),
    ]).process(`.a { color: #00594c; background: #aabbcc; }`, {
      from: "components/tag/tag.module.css",
    })

    expect(result.css).toContain("var(--sk-color-green-500)")
    expect(result.css).toContain("var(--sk-color-yellow-90)")
  })

  test("skips files by string pattern", async () => {
    const result = await postcss([
      convertColorsToVars({
        colors: {
          "green-500": "#00594C",
        },
        variablePrefix: "--sk-color-",
        skipFiles: ["global.css"],
      }),
    ]).process(`.a { color: #00594c; }`, {
      from: "styles/global.css",
    })

    expect(result.css).toContain("#00594c")
    expect(result.css).not.toContain("var(--sk-color-green-500)")
  })

  test("supports custom variable naming", async () => {
    const result = await postcss([
      convertColorsToVars({
        colors: {
          "yellow-90": "#AABBCC",
        },
        getVariableName: (tokenName) => `--${tokenName}-color`,
      }),
    ]).process(`.a { color: #aabbcc; }`, {
      from: "components/tag/tag.module.css",
    })

    expect(result.css).toContain("var(--yellow-90-color)")
  })
})
