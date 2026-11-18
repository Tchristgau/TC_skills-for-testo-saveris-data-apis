---
name: testo-data-api-doc
description: Refresh and provide the latest Testo Data API reference docs. Use when the user says things like 'show Testo Data API docs', 'update Testo Data API docs', 'show API usage for specific endpoints' or similar queries. Also use when invoked via /testo-data-api-doc directly.
user-invocable: true
---

Refresh the Testo Data API reference file. Use the skill-local `scripts/` entrypoints (paths relative to this skill directory) to perform the download and rename flow.

## Scripts
- Shell: `scripts/update-api-docs.sh`
- PowerShell: `scripts/update-api-docs.ps1`
- Batch: `scripts/update-api-docs.bat`

## Output
Provide the API document in a human-readable format instead of pure JSON. Note to mark deprecated endpoints clearly. By default, provide the entire reference content, but if specific endpoints are requested, only provide related sections and references.

For each endpoint, provide the following details if available:
- HTTP method and URL path.
- Description of the endpoint's purpose.
- Required and optional parameters.
- Detailed request and response schemas and examples.
- Deprecation status and recommended alternatives if deprecated.

For entire API documentation, provide overall description and show the same structure and details as specified above for individual ones.