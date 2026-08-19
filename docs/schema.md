# Site data reference

Each file under `sites/` represents one canonical domain and must satisfy [`schema/site.schema.json`](../schema/site.schema.json).

```yaml
schema_version: 1
name: Example Directory
domain: example.com
submission_url: https://example.com/submit
category: listing-directory
tags:
  - saas
pricing:
  type: free
submission:
  complexity: easy
backlink:
  requirement: not-required
  dofollow: unknown
nsfw_policy: not-allowed
status: active
notes: Submissions are reviewed before publication.
evidence:
  - url: https://example.com/submission-guidelines
    checked_at: 2026-08-19
last_verified_at: 2026-08-19
```

| Field | Required | Meaning |
| --- | --- | --- |
| `schema_version` | Yes | Schema version. Currently `1`. |
| `name` | Yes | Public site name. |
| `domain` | Yes | Lowercase domain without scheme, path, port, or `www.`. |
| `submission_url` | Yes | Direct public submission or application URL. |
| `category` | No | ID defined in `taxonomy/categories.yml`. |
| `tags` | No | Lowercase, hyphenated descriptors. |
| `pricing` | Yes | `free`, `pay-once`, `subscribe`, or `other`; optional amount and currency. |
| `submission` | Yes | Complexity: `auto`, `easy`, `normal`, `complete`, or `unknown`. |
| `backlink` | Yes | Requirement and observed dofollow behavior. |
| `nsfw_policy` | Yes | `allowed`, `not-allowed`, or `unknown`. |
| `status` | Yes | Current observed operating status. |
| `notes` | No | Concise public context. |
| `evidence` | No | Public URLs supporting facts; required by policy for new active listings. |
| `last_verified_at` | No | Most recent overall verification date. |

Pricing currency uses an uppercase three-letter code such as `USD`. Omit unverified values instead of guessing. Backlink requirement is `unknown`, `required-backlink`, `not-required`, or `required-badge`; `dofollow` is `true`, `false`, or `unknown`.
