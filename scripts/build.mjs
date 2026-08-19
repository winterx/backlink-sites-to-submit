import fs from "node:fs/promises";
import path from "node:path";
import { createStats, distDirectory, flattenSite, loadSites, rootDirectory, sortSites, toCsv } from "./lib/directory.mjs";

const statsStart = "<!-- directory-stats:start -->";
const statsEnd = "<!-- directory-stats:end -->";

export async function createBuildOutputs() {
  const records = await loadSites();
  const sites = sortSites(records.map((record) => record.site));
  const stats = createStats(sites);
  const readmePath = path.join(rootDirectory, "README.md");
  const readme = await fs.readFile(readmePath, "utf8");
  const startIndex = readme.indexOf(statsStart);
  const endIndex = readme.indexOf(statsEnd);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) throw new Error("README.md is missing the directory stats markers.");
  const statsLine = `**${stats.total} sites** · **${stats.active} active** · **${stats.by_pricing_type.free ?? 0} free**`;
  const nextReadme = readme.slice(0, startIndex + statsStart.length) + `\n${statsLine}\n` + readme.slice(endIndex);
  return new Map([
    [path.join(distDirectory, "sites.json"), `${JSON.stringify(sites, null, 2)}\n`],
    [path.join(distDirectory, "sites.csv"), toCsv(sites.map(flattenSite))],
    [path.join(distDirectory, "stats.json"), `${JSON.stringify(stats, null, 2)}\n`],
    [readmePath, nextReadme]
  ]);
}

export async function buildDirectory() {
  const outputs = await createBuildOutputs();
  await fs.mkdir(distDirectory, { recursive: true });
  for (const [filePath, content] of outputs) await fs.writeFile(filePath, content);
  console.log(`Built ${outputs.size - 1} distribution file(s) and refreshed README stats.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(rootDirectory, "scripts", "build.mjs")) await buildDirectory();
