# Skills for Testo Saveris Data APIs

Agent plugins that help AI coding assistants integrate the [Testo Saveris logger APIs](https://developers.testo.dev/saveris-logger-api/general/overview/) correctly. The skills cover implementation, issue fixing, code review, project audits, API reference lookup and common integration questions.

This repository is a plugin marketplace named `testo-saveris-data-api`. It works with Claude Code, GitHub Copilot CLI, Codex, Cursor, Grok Build, Devin CLI, Gemini CLI, OpenCode and Pi.

## Plugins

| Plugin | Description | API documentation |
|---|---|---|
| [`testo-data-api`](plugins/testo-data-api) | Fetch Testo logger data like devices, sensors, alarms, measurements and tasks with the Data API | [Data API](https://developers.testo.dev/saveris-logger-api/data-api/) |
| [`testo-real-time-api`](plugins/testo-real-time-api) | Receive live alarms and measurements with the Real-Time (STOMP/WebSocket) API | [Real-Time API](https://developers.testo.dev/saveris-logger-api/push-api/) |

Install only the plugins you need.

### testo-data-api

| Skill | Trigger | Description |
|---|---|---|
| testo-data-api | `/testo-data-api` | Root skill for Testo Data API integration and issue fixing |
| testo-data-api-rules | `/testo-data-api-rules` | Best practice rules for configuration, authentication and endpoint usage |
| testo-data-api-audit | `/testo-data-api-audit` | Audit the whole project to find integration issues |
| testo-data-api-review | `/testo-data-api-review` | Review changed code only (diff based) to find integration issues |
| testo-data-api-doc | `/testo-data-api-doc` | Refresh and show the latest API reference |
| testo-data-api-qa | `/testo-data-api-qa` | Answer common questions, like credentials, site/tenant binding, data issues and endpoint errors |
| testo-data-api-help | `/testo-data-api-help` | Show the help card |

### testo-real-time-api

| Skill | Trigger | Description |
|---|---|---|
| testo-real-time-api | `/testo-real-time-api` | Root skill for Testo Real-Time API integration, queue migration and issue fixing |
| testo-real-time-api-rules | `/testo-real-time-api-rules` | Best practice rules for configuration, authentication and usage |
| testo-real-time-api-audit | `/testo-real-time-api-audit` | Audit the whole project to find integration issues |
| testo-real-time-api-review | `/testo-real-time-api-review` | Review changed code only (diff based) to find integration issues |
| testo-real-time-api-doc | `/testo-real-time-api-doc` | Refresh and show the latest API reference |
| testo-real-time-api-qa | `/testo-real-time-api-qa` | Answer common questions, like credentials, site/tenant binding, data issues and endpoint errors |
| testo-real-time-api-help | `/testo-real-time-api-help` | Show the help card |

Some tools prefix skills with the plugin name, for example `/testo-data-api:testo-data-api-help`. Pi uses `/skill:<name>`, for example `/skill:testo-data-api-help`.

## Installation

### Claude Code

```sh
claude plugin marketplace add testo/skills-for-testo-saveris-data-apis
claude plugin install testo-data-api@testo-saveris-data-api
claude plugin install testo-real-time-api@testo-saveris-data-api
```

### GitHub Copilot CLI

```sh
copilot plugin marketplace add testo/skills-for-testo-saveris-data-apis
copilot plugin install testo-data-api@testo-saveris-data-api
copilot plugin install testo-real-time-api@testo-saveris-data-api
```

### Codex

```sh
codex plugin marketplace add testo/skills-for-testo-saveris-data-apis
codex plugin add testo-data-api@testo-saveris-data-api
codex plugin add testo-real-time-api@testo-saveris-data-api
```

See [INSTALL.md](INSTALL.md) for Cursor, Grok Build, Devin CLI, Gemini CLI, OpenCode and Pi, and for update and removal commands.

After installing, start a new session and run `/testo-data-api-help` or `/testo-real-time-api-help` to list the available skills.

## Examples
### Show API documentation
Show the whole API documentation summary
```
/testo-data-api-doc
```

Show API guide for specified endpoint(s)

```
/testo-data-api-doc device-properties
```

### Audit and review
Audit the whole repository related to Real-Time API integration
```
/testo-real-time-api-audit
```

To review only git diff based changes
```
/testo-real-time-api-review
```

### Ask common Q&A questions
Use Q&A skills for common usage questions
```
/testo-data-api-qa Some 401 errors, why
```
```
/testo-real-time-api-qa pre-requirement to use measurements queue
```

## License

[MIT](LICENSE) © 2026 Testo SE & Co. KGaA
