# Data policy

## Purpose and source of truth

SubmitRank Open Directory is a public, reusable collection of factual information about sites that accept product, company, project, and creative-work submissions. YAML files under `sites/` are canonical; `dist/` contains generated artifacts.

This repository is operationally independent from SubmitRank.com. Merging a pull request here does not automatically write to Convex, SubmitRank's production database, or any external system. SubmitRank.com may use different data, refresh schedules, editorial decisions, and enrichment.

## Included data

The public schema is limited to identity, domain, public submission URL, category, tags, observable pricing, submission complexity, backlink requirements, dofollow status, NSFW policy, operational status, public notes, evidence URLs, and verification dates.

## Excluded data

The repository must not contain private notes; user accounts or activity; product submission history; credentials; third-party traffic estimates or metric history; SubmitRank proprietary rankings or tiers; internal review decisions; or media without redistribution rights.

Schema validation is a guardrail, not a substitute for contributor and maintainer review.

## Accuracy and corrections

Data is provided without a guarantee of accuracy or continued availability. Contributors should cite current public evidence. Maintainers may mark uncertain records `to-verify` or `stale` rather than removing them. Git history and pull requests provide contributor-level provenance.
