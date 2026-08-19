import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { normalizeDomain, rootDirectory, serializeSiteYaml, sitesDirectory, stripTrackingParameters } from "./lib/directory.mjs";

const initialNameOverrides = new Map([
  ["1000gpt.shop", "1000GPT"], ["alternatives.co", "Alternatives"], ["humanornot.co", "Human or Not"], ["intersys.ai", "Intersys"], ["trackbes.com", "Trackbes"]
]);
function readArgument(name) { const index = process.argv.indexOf(name); return index === -1 ? undefined : process.argv[index + 1]; }
function toDate(value) { if (!Number.isFinite(value)) return undefined; const date = new Date(value); return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10); }

export function projectPublicSite(row) {
  const domain = normalizeDomain(row.domain);
  if (!domain) throw new Error(`Invalid domain in initial import: ${row.domain}`);
  const site = {
    schema_version: 1,
    name: initialNameOverrides.get(domain) ?? String(row.name ?? domain).trim(),
    domain,
    submission_url: stripTrackingParameters(String(row.submissionUrl ?? "").trim())
  };
  if (row.category) site.category = String(row.category).trim();
  if (Array.isArray(row.tags) && row.tags.length > 0) site.tags = [...new Set(row.tags.map((tag) => String(tag).trim()).filter(Boolean))].sort();
  site.pricing = { type: row.pricingType };
  if (Number.isFinite(row.price)) site.pricing.amount = row.price;
  if (row.currency && Number.isFinite(row.price)) site.pricing.currency = String(row.currency).trim().toUpperCase();
  site.submission = { complexity: row.submissionComplexity ?? "unknown" };
  site.backlink = { requirement: row.backlinkRequirement ?? "unknown", dofollow: row.doFollow ?? "unknown" };
  site.nsfw_policy = row.nsfw ?? "unknown";
  site.status = row.status;
  if (row.publicNotes) site.notes = String(row.publicNotes).trim();
  const lastVerifiedAt = toDate(row.lastCheckedAt);
  site.evidence = [{ url: site.submission_url }];
  if (lastVerifiedAt) site.evidence[0].checked_at = lastVerifiedAt;
  if (lastVerifiedAt) site.last_verified_at = lastVerifiedAt;
  return site;
}

export async function importInitialData(inputPath) {
  if (!inputPath) throw new Error("Usage: node scripts/import-initial-data.mjs --input /path/to/documents.jsonl");
  const stream = (await fs.open(path.resolve(inputPath))).createReadStream();
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const sites = [];
  for await (const line of lines) if (line.trim()) sites.push(projectPublicSite(JSON.parse(line)));
  sites.sort((a, b) => a.domain.localeCompare(b.domain));
  await fs.mkdir(sitesDirectory, { recursive: true });
  for (const site of sites) await fs.writeFile(path.join(sitesDirectory, `${site.domain}.yml`), serializeSiteYaml(site));
  console.log(`Imported ${sites.length} site file(s) using the public field allowlist.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(rootDirectory, "scripts", "import-initial-data.mjs")) await importInitialData(readArgument("--input"));
