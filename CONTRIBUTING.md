# Contributing

Thank you for helping maintain the SubmitRank Open Directory. Small corrections are as valuable as new listings.

## What belongs in the directory

A listing should provide a real way for third parties to submit a product, tool, company, project, or creative work; have a public website and submission URL; be safe to visit; and contain enough public evidence for verification.

A normal company website, personal blog, agency, backlink seller, or submission service does not qualify merely because it has a contact form. Paid sites may be listed, but payment never guarantees inclusion, ranking, or endorsement.

## Ways to contribute

If you are unfamiliar with Git, use a structured issue form. For a pull request:

1. Fork and clone the repository.
2. Create or edit one YAML file per domain under `sites/`.
3. Use the normalized domain as the filename, for example `sites/example.com.yml`.
4. Add at least one `evidence` URL for a new active listing.
5. Run `npm install`, `npm run validate`, `npm test`, and `npm run build`.
6. Commit the changed YAML and regenerated `dist/` files.
7. Open a focused pull request and complete the checklist.

Use an existing site file as a starting point. Field definitions are in [docs/schema.md](docs/schema.md).

## Evidence and conflicts of interest

Good evidence links directly to a submission page, pricing page, documentation, or policy. Search results, affiliate redirects, tracking links, and private dashboards are not acceptable.

Owners, employees, affiliates, and paid representatives may submit a listing, but must disclose the relationship. Do not offer payment, reciprocal links, gifts, or other consideration in exchange for merging a contribution.

## Editorial fields

This dataset records observable directory facts. SubmitRank rankings, tiers, traffic metrics, screenshots, user activity, and internal review information are outside scope and rejected by the schema.

## Status values

- `active`: submissions appear available;
- `to-verify`: availability needs confirmation;
- `submission-closed`: the site exists but no longer accepts submissions;
- `stale`: information is old or substantially uncertain;
- `broken`: the submission path is currently broken;
- `dead`: the site no longer appears to operate.

Prefer a status change over deletion so history is preserved.

## Generated files and license

Do not manually edit `dist/` or the README statistics line. Run `npm run build` after changing source data.

By contributing, you represent that you have the right to provide the material and agree that data contributions are available under CC BY 4.0, while code, schema, tooling, tests, and workflow contributions are available under MIT. Do not submit personal data, confidential material, copied paywalled content, or data whose license prohibits redistribution.
