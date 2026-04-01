import type { PluginCreator } from "postcss"

export type ColorTokenMap = Record<string, string>

export interface ConvertColorsToVarsOptions {
  colors: ColorTokenMap
  exclude?: string[]
  skipFiles?: Array<string | RegExp>
  variablePrefix?: string
  shouldSkipFile?: (filePath?: string) => boolean
  getVariableName?: (tokenName: string) => string
}

const normalizeColor = (value: string) => value.trim().toLowerCase()

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const matchesSkippedFile = (
  filePath: string | undefined,
  skipFiles: Array<string | RegExp>,
) => {
  if (!filePath) {
    return false
  }

  return skipFiles.some((pattern) => {
    if (typeof pattern === "string") {
      return filePath.includes(pattern)
    }

    return pattern.test(filePath)
  })
}

export const convertColorsToVars: PluginCreator<ConvertColorsToVarsOptions> = (
  options = { colors: {} },
) => {
  const {
    colors,
    exclude = [],
    skipFiles = [],
    variablePrefix = "--",
    shouldSkipFile,
    getVariableName,
  } = options

  const resolveVariableName =
    getVariableName ?? ((tokenName: string) => `${variablePrefix}${tokenName}`)
  const excludedNames = new Set(exclude)
  const colorEntries = Object.entries(colors)
    .filter(([name]) => !excludedNames.has(name))
    .map(
      ([name, value]) =>
        [normalizeColor(value), `var(${resolveVariableName(name)})`] as const,
    )
    .sort(([left], [right]) => right.length - left.length)

  return {
    postcssPlugin: "postcss-convert-colors-to-vars",
    Once(root, { result }) {
      const filePath = result.opts.from
      if (
        shouldSkipFile?.(filePath) ??
        matchesSkippedFile(filePath, skipFiles)
      ) {
        return
      }

      root.walkDecls((decl) => {
        let nextValue = decl.value
        const lowerCasedValue = decl.value.toLowerCase()

        colorEntries.forEach(([colorValue, variableValue]) => {
          if (!lowerCasedValue.includes(colorValue)) {
            return
          }

          nextValue = nextValue.replace(
            new RegExp(escapeRegExp(colorValue), "gi"),
            variableValue,
          )
        })

        decl.value = nextValue
      })
    },
  }
}

convertColorsToVars.postcss = true

export default convertColorsToVars
