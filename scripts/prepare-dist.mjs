import { mkdir, rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(scriptDir, "../dist")

await rm(distDir, { recursive: true, force: true })
await mkdir(distDir, { recursive: true })
