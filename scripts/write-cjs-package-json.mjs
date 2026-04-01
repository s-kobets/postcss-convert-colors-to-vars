import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const cjsDir = resolve(scriptDir, "../dist/cjs")

await mkdir(cjsDir, { recursive: true })
await writeFile(
  resolve(cjsDir, "package.json"),
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
)
