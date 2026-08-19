import path from "node:path";
import { loadCategories, loadSiteSchemaValidator, loadSites, rootDirectory, validateSiteCollection } from "./lib/directory.mjs";

export async function validateDirectory({ printWarnings = true } = {}) {
  const [records, validateSchema, categories] = await Promise.all([loadSites(), loadSiteSchemaValidator(), loadCategories()]);
  const result = validateSiteCollection(records, validateSchema, new Set(categories.map((category) => category.id)));
  if (printWarnings) {
    const displayed = result.warnings.slice(0, 20);
    for (const warning of displayed) console.warn(`warning: ${warning}`);
    if (result.warnings.length > displayed.length) console.warn(`warning: ${result.warnings.length - displayed.length} additional warning(s) omitted.`);
  }
  if (result.errors.length > 0) {
    for (const error of result.errors) console.error(`error: ${error}`);
    throw new Error(`Validation failed with ${result.errors.length} error(s).`);
  }
  console.log(`Validated ${records.length} site file(s) and ${categories.length} categor${categories.length === 1 ? "y" : "ies"}.`);
  return { records, categories, ...result };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(rootDirectory, "scripts", "validate.mjs")) await validateDirectory();
