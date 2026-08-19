import fs from "node:fs/promises";
import path from "node:path";
import { createBuildOutputs } from "./build.mjs";
import { rootDirectory } from "./lib/directory.mjs";
import { validateDirectory } from "./validate.mjs";

await validateDirectory();
const outputs = await createBuildOutputs();
const stale = [];
for (const [filePath, expected] of outputs) {
  let actual;
  try { actual = await fs.readFile(filePath, "utf8"); } catch (error) { if (error.code !== "ENOENT") throw error; }
  if (actual !== expected) stale.push(path.relative(rootDirectory, filePath));
}
if (stale.length > 0) {
  console.error(`Generated files are stale: ${stale.join(", ")}. Run npm run build.`);
  process.exitCode = 1;
} else console.log("Generated files are up to date.");
