import fs from "node:fs/promises";
import path from "node:path";
import { domainToASCII, fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parseDocument, stringify } from "yaml";

export const rootDirectory = fileURLToPath(new URL("../..", import.meta.url));
export const sitesDirectory = path.join(rootDirectory, "sites");
export const distDirectory = path.join(rootDirectory, "dist");

const trackingParameters = new Set(["aff", "fbclid", "from", "gclid", "mc_cid", "mc_eid", "ref", "ref_src", "typeform-source"]);

export function normalizeDomain(value) {
  const input = String(value ?? "").trim().toLowerCase();
  if (!input) return "";
  let parsed;
  try {
    parsed = new URL(input.includes("://") ? input : `https://${input}`);
  } catch {
    return "";
  }
  if (parsed.port || parsed.username || parsed.password) return "";
  const ascii = domainToASCII(parsed.hostname).toLowerCase().replace(/\.$/, "");
  const normalized = ascii.replace(/^www\./, "");
  const labels = normalized.split(".");
  if (
    normalized.length > 253 ||
    labels.length < 2 ||
    labels.some((label) => label.length === 0 || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))
  ) return "";
  return normalized;
}

export function hasTrackingParameters(value) {
  let parsed;
  try { parsed = new URL(value); } catch { return false; }
  for (const key of parsed.searchParams.keys()) {
    if (key.toLowerCase().startsWith("utm_") || trackingParameters.has(key.toLowerCase())) return true;
  }
  return false;
}

export function stripTrackingParameters(value) {
  const parsed = new URL(value);
  for (const key of [...parsed.searchParams.keys()]) {
    if (key.toLowerCase().startsWith("utm_") || trackingParameters.has(key.toLowerCase())) parsed.searchParams.delete(key);
  }
  return parsed.toString();
}

export async function readYamlFile(filePath) {
  const text = await fs.readFile(filePath, "utf8");
  const document = parseDocument(text, { prettyErrors: true, uniqueKeys: true });
  if (document.errors.length > 0) throw new Error(document.errors.map((error) => error.message).join("\n"));
  return document.toJS();
}

export async function loadCategories() {
  const taxonomy = await readYamlFile(path.join(rootDirectory, "taxonomy", "categories.yml"));
  if (!Array.isArray(taxonomy?.categories)) throw new Error("taxonomy/categories.yml must contain a categories array.");
  const seen = new Set();
  for (const category of taxonomy.categories) {
    if (!category || typeof category.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.id) || typeof category.name !== "string" || !category.name.trim() || typeof category.description !== "string" || !category.description.trim()) {
      throw new Error("Each category requires a valid id, name, and description.");
    }
    if (seen.has(category.id)) throw new Error(`Duplicate category id: ${category.id}.`);
    seen.add(category.id);
  }
  return taxonomy.categories;
}

export async function loadSiteSchemaValidator() {
  const schema = JSON.parse(await fs.readFile(path.join(rootDirectory, "schema", "site.schema.json"), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(schema);
}

export async function listSiteFiles() {
  const entries = await fs.readdir(sitesDirectory, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name)).map((entry) => path.join(sitesDirectory, entry.name)).sort((a, b) => a.localeCompare(b));
}

export async function loadSites() {
  const files = await listSiteFiles();
  return Promise.all(files.map(async (filePath) => ({ filePath, filename: path.basename(filePath), site: await readYamlFile(filePath) })));
}

export function formatAjvErrors(errors = []) {
  return errors.map((error) => `${error.instancePath || "/"} ${error.message}`);
}

export function validateSiteCollection(records, validateSchema, categoryIds) {
  const errors = [];
  const warnings = [];
  const domains = new Map();
  const today = new Date().toISOString().slice(0, 10);
  for (const { filePath, filename, site } of records) {
    const relativePath = path.relative(rootDirectory, filePath);
    if (!validateSchema(site)) {
      for (const message of formatAjvErrors(validateSchema.errors)) errors.push(`${relativePath}: ${message}`);
      continue;
    }
    const normalizedDomain = normalizeDomain(site.domain);
    if (!normalizedDomain || normalizedDomain !== site.domain) errors.push(`${relativePath}: domain must be normalized; expected ${normalizedDomain || "a valid domain"}.`);
    const expectedFilename = `${site.domain}.yml`;
    if (filename !== expectedFilename) errors.push(`${relativePath}: filename must be ${expectedFilename}.`);
    const existing = domains.get(site.domain);
    if (existing) errors.push(`${relativePath}: duplicate domain; already defined in ${existing}.`);
    else domains.set(site.domain, relativePath);
    if (site.category && !categoryIds.has(site.category)) errors.push(`${relativePath}: unknown category '${site.category}'.`);
    if (hasTrackingParameters(site.submission_url)) errors.push(`${relativePath}: submission_url must not contain tracking parameters.`);
    for (const item of site.evidence ?? []) {
      if (hasTrackingParameters(item.url)) errors.push(`${relativePath}: evidence URLs must not contain tracking parameters.`);
      if (item.checked_at && item.checked_at > today) errors.push(`${relativePath}: evidence checked_at cannot be in the future.`);
    }
    if (site.last_verified_at && site.last_verified_at > today) errors.push(`${relativePath}: last_verified_at cannot be in the future.`);
    if (new URL(site.submission_url).protocol !== "https:") warnings.push(`${relativePath}: submission_url does not use HTTPS.`);
    if ((!site.evidence || site.evidence.length === 0) && site.status !== "dead") warnings.push(`${relativePath}: no evidence URL is recorded yet.`);
  }
  return { errors, warnings };
}

export function sortSites(sites) { return [...sites].sort((a, b) => a.domain.localeCompare(b.domain)); }
export function serializeSiteYaml(site) { return stringify(site, { lineWidth: 100, minContentWidth: 20, sortMapEntries: false }); }

export function flattenSite(site) {
  return {
    name: site.name,
    domain: site.domain,
    submission_url: site.submission_url,
    category: site.category ?? "",
    tags: (site.tags ?? []).join("|"),
    pricing_type: site.pricing.type,
    price: site.pricing.amount ?? "",
    currency: site.pricing.currency ?? "",
    submission_complexity: site.submission.complexity,
    backlink_requirement: site.backlink.requirement,
    dofollow: site.backlink.dofollow,
    nsfw_policy: site.nsfw_policy,
    status: site.status,
    notes: site.notes ?? "",
    last_verified_at: site.last_verified_at ?? ""
  };
}

export function toCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [headers.join(","), ...rows.map((row) => headers.map((key) => escape(row[key])).join(","))].join("\n") + "\n";
}

export function createStats(sites) {
  const countBy = (key) => Object.fromEntries([...sites.reduce((counts, site) => { const value = key(site); counts.set(value, (counts.get(value) ?? 0) + 1); return counts; }, new Map())].sort(([a], [b]) => String(a).localeCompare(String(b))));
  return {
    total: sites.length,
    active: sites.filter((site) => site.status === "active").length,
    by_status: countBy((site) => site.status),
    by_pricing_type: countBy((site) => site.pricing.type),
    by_category: countBy((site) => site.category ?? "uncategorized")
  };
}
