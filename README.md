# SubmitRank Open Directory

[![Validate data](https://github.com/winterx/submitrank-open-directory/actions/workflows/validate.yml/badge.svg)](https://github.com/winterx/submitrank-open-directory/actions/workflows/validate.yml)
[![Data license: CC BY 4.0](https://img.shields.io/badge/data%20license-CC%20BY%204.0-blue.svg)](LICENSE)
[![Code license: MIT](https://img.shields.io/badge/code%20license-MIT-green.svg)](LICENSE-CODE)

An open, community-maintained directory of places where makers can submit and launch products, tools, companies, and creative work.

The dataset is maintained in public through GitHub pull requests. [SubmitRank](https://submitrank.com/) is the original curator and provides a separate product experience with rankings, filters, submission tracking, and other enrichment.

[简体中文说明](README.zh-CN.md)

<!-- directory-stats:start -->
**478 sites** · **404 active** · **332 free**
<!-- directory-stats:end -->

## Use the data

- [`sites/`](sites/) contains the human-editable source: one YAML file per domain.
- [`dist/sites.json`](dist/sites.json) is the generated JSON dataset.
- [`dist/sites.csv`](dist/sites.csv) is the generated flat CSV dataset.
- [`dist/stats.json`](dist/stats.json) contains summary counts.
- [`schema/site.schema.json`](schema/site.schema.json) defines the machine-readable schema.
- [`docs/schema.md`](docs/schema.md) explains the fields and enum values.

The source files are canonical. Files under `dist/` are generated and must not be edited by hand.

## Contribute

- [Add a site](https://github.com/winterx/submitrank-open-directory/issues/new?template=add-site.yml)
- [Update a listing](https://github.com/winterx/submitrank-open-directory/issues/new?template=update-site.yml)
- [Report a closed or broken submission page](https://github.com/winterx/submitrank-open-directory/issues/new?template=report-site.yml)
- Fork the repository, edit a file under `sites/`, and open a pull request

New listings must accept submissions from third parties and should include a public evidence URL. Self-submissions are welcome when the relationship is disclosed. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run validate
npm test
npm run build
npm run check
```

`npm run build` deterministically regenerates JSON, CSV, statistics, and the counters near the top of this README. CI checks that generated files match the YAML source.

## Data boundaries

This repository contains public directory facts only. It intentionally excludes private notes, user data, submission history, third-party traffic estimates, proprietary rankings and tiers, screenshots, credentials, and deployment configuration.

Contributions merged here remain in this repository. They are **not automatically synchronized to SubmitRank.com or its production database**. The website and this dataset may therefore differ. See [DATA_POLICY.md](DATA_POLICY.md).

## Licenses

- Data in `sites/`, `dist/`, and `taxonomy/` is licensed under [CC BY 4.0](LICENSE).
- Source code, scripts, schemas, tests, and GitHub workflow configuration are licensed under the [MIT License](LICENSE-CODE).

Suitable attribution: `SubmitRank Open Directory contributors — https://github.com/winterx/submitrank-open-directory`.

## Disclaimer

Listings are community-maintained and may be outdated, inaccurate, unavailable, or subject to fees and policies not recorded here. Inclusion is not an endorsement. Verify current terms before submitting content or making a payment.
