import test from "node:test";
import assert from "node:assert/strict";
import { createStats, hasTrackingParameters, normalizeDomain, stripTrackingParameters, toCsv } from "../scripts/lib/directory.mjs";
import { projectPublicSite } from "../scripts/import-initial-data.mjs";

test("normalizeDomain canonicalizes common domain inputs", () => {
  assert.equal(normalizeDomain("HTTPS://www.Example.com/path"), "example.com");
  assert.equal(normalizeDomain("example.com"), "example.com");
  assert.equal(normalizeDomain("https://example.com:8443"), "");
  assert.equal(normalizeDomain("bad..example.com"), "");
  assert.equal(normalizeDomain("localhost"), "");
});
test("hasTrackingParameters identifies common tracking parameters", () => {
  assert.equal(hasTrackingParameters("https://example.com/submit?utm_source=test"), true);
  assert.equal(hasTrackingParameters("https://example.com/submit?ref=affiliate"), true);
  assert.equal(hasTrackingParameters("https://example.com/submit?category=tools"), false);
});
test("stripTrackingParameters preserves functional parameters", () => {
  assert.equal(stripTrackingParameters("https://example.com/submit?ref=affiliate&plan=pro"), "https://example.com/submit?plan=pro");
});
test("toCsv quotes commas, quotes, and newlines", () => {
  assert.equal(toCsv([{ name: 'A, "B"', notes: "one\ntwo" }]), 'name,notes\n"A, ""B""","one\ntwo"\n');
});
test("createStats summarizes public fields", () => {
  const stats = createStats([{ status: "active", pricing: { type: "free" }, category: "listing-directory" }, { status: "dead", pricing: { type: "pay-once" } }]);
  assert.deepEqual(stats, { total: 2, active: 1, by_status: { active: 1, dead: 1 }, by_pricing_type: { free: 1, "pay-once": 1 }, by_category: { "listing-directory": 1, uncategorized: 1 } });
});
test("projectPublicSite excludes private and third-party enrichment fields", () => {
  const site = projectPublicSite({ name: "Example", domain: "www.example.com", submissionUrl: "https://example.com/submit", pricingType: "free", status: "active", privateNotes: "secret", monthlyTrafficEstimate: 123, dr: 50, tier: "A" });
  assert.equal(site.domain, "example.com");
  assert.equal(site.pricing.type, "free");
  for (const field of ["privateNotes", "monthlyTrafficEstimate", "dr", "tier"]) assert.equal(field in site, false);
});
