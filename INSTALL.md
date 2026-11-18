# Installation

This repository is a plugin marketplace with two plugins:

| Plugin | Description |
|---|---|
| `testo-data-api` | Testo Saveris Data API integration |
| `testo-real-time-api` | Testo Saveris Real-Time API integration |

The marketplace is named `testo-saveris-data-api` and is added from the GitHub repository `testo/skills-for-testo-saveris-data-apis`. Install only the plugins you need.

- [Claude Code](#claude-code)
- [GitHub Copilot CLI](#github-copilot-cli)
- [Codex](#codex)
- [Cursor](#cursor)
- [Grok Build](#grok-build)
- [Devin CLI](#devin-cli)
- [Gemini CLI](#gemini-cli)
- [OpenCode](#opencode)
- [Pi](#pi)

## Claude Code

From your shell:

```sh
claude plugin marketplace add testo/skills-for-testo-saveris-data-apis
claude plugin install testo-data-api@testo-saveris-data-api
claude plugin install testo-real-time-api@testo-saveris-data-api
```

Or inside a Claude Code session:

```text
/plugin marketplace add testo/skills-for-testo-saveris-data-apis
/plugin install testo-data-api@testo-saveris-data-api
/plugin install testo-real-time-api@testo-saveris-data-api
```

Update or remove:

```sh
claude plugin marketplace update testo-saveris-data-api
claude plugin uninstall testo-data-api@testo-saveris-data-api
```

## GitHub Copilot CLI

From your shell:

```sh
copilot plugin marketplace add testo/skills-for-testo-saveris-data-apis
copilot plugin install testo-data-api@testo-saveris-data-api
copilot plugin install testo-real-time-api@testo-saveris-data-api
```

Or inside a Copilot CLI session:

```text
/plugin marketplace add testo/skills-for-testo-saveris-data-apis
/plugin install testo-data-api@testo-saveris-data-api
/plugin install testo-real-time-api@testo-saveris-data-api
```

Update or remove:

```sh
copilot plugin update testo-data-api
copilot plugin uninstall testo-data-api
```

## Codex

```sh
codex plugin marketplace add testo/skills-for-testo-saveris-data-apis
codex plugin add testo-data-api@testo-saveris-data-api
codex plugin add testo-real-time-api@testo-saveris-data-api
```

Update or remove:

```sh
codex plugin marketplace upgrade testo-saveris-data-api
codex plugin remove testo-data-api@testo-saveris-data-api
```

## Cursor

Add the marketplace with the Cursor CLI:

```sh
cursor-agent plugin marketplace add https://github.com/testo/skills-for-testo-saveris-data-apis
```

The Cursor CLI has no non-interactive install command yet. Install the plugins interactively:

1. Run `cursor-agent`.
2. Type `/plugin` and open the **Marketplace** tab.
3. Select `testo-data-api` and/or `testo-real-time-api`, press Enter and choose the scope (user or project).

Plugins installed at user scope (also possible from the Cursor IDE **Customize** view) sync to your account and are available in both the IDE and the CLI.

## Grok Build

```sh
grok plugin marketplace add testo/skills-for-testo-saveris-data-apis
grok plugin install testo-data-api --trust
grok plugin install testo-real-time-api --trust
```

`--trust` confirms the install; without it Grok only shows what the plugin would add. Start a new session (or press `r` in the `/plugins` tab) to load the skills.

Update or remove:

```sh
grok plugin marketplace update
grok plugin update testo-data-api
grok plugin uninstall testo-data-api
```

## Devin CLI

Sign in first, as plugin management requires it:

```sh
devin auth login
```

Install both plugins through the repository's meta-plugin (`testo-saveris-data-api`):

```sh
devin plugins install testo/skills-for-testo-saveris-data-apis
```

Or install a single plugin from its subfolder:

```sh
devin plugins install testo/skills-for-testo-saveris-data-apis#plugins/testo-data-api
devin plugins install testo/skills-for-testo-saveris-data-apis#plugins/testo-real-time-api
```

Add `--local` to install on the current machine only instead of your Devin Cloud profile. Skills are available as `/<plugin>:<skill>`, for example `/testo-data-api:testo-data-api-help`.

Update or remove:

```sh
devin plugins update
devin plugins remove testo-data-api
```

## Gemini CLI

Each plugin folder is a Gemini CLI extension (`gemini-extension.json` + `skills/`). Gemini CLI can't install an extension from a repository subfolder, so clone the repository and install from the local path:

```sh
git clone https://github.com/testo/skills-for-testo-saveris-data-apis.git
gemini extensions install ./skills-for-testo-saveris-data-apis/plugins/testo-data-api
gemini extensions install ./skills-for-testo-saveris-data-apis/plugins/testo-real-time-api
```

Gemini asks you to trust the folder and confirm the install; add `--consent` to skip the confirmation. Restart Gemini CLI and run `/extensions list` to check the loaded skills.

Update (after pulling the latest changes) or remove:

```sh
git -C skills-for-testo-saveris-data-apis pull
gemini extensions update --all
gemini extensions uninstall testo-data-api
```

## OpenCode

Each plugin folder is also an OpenCode plugin package (`package.json` + `opencode-plugin.js`) that registers its bundled skills. OpenCode has no marketplace, so install each plugin directly.

**OpenCode 2.x** – install from the repository subfolder:

```sh
opencode plugin add 'github:testo/skills-for-testo-saveris-data-apis#main::path:plugins/testo-data-api'
opencode plugin add 'github:testo/skills-for-testo-saveris-data-apis#main::path:plugins/testo-real-time-api'
```

Check, update or remove:

```sh
opencode plugin list
opencode plugin update
opencode plugin remove 'github:testo/skills-for-testo-saveris-data-apis#main::path:plugins/testo-data-api'
```

**OpenCode 1.x** – Git subfolder installs are not supported, so clone the repository and install from the local path (`-g` adds it to the global configuration):

```sh
git clone https://github.com/testo/skills-for-testo-saveris-data-apis.git
opencode plugin -g "$PWD/skills-for-testo-saveris-data-apis/plugins/testo-data-api"
opencode plugin -g "$PWD/skills-for-testo-saveris-data-apis/plugins/testo-real-time-api"
```

Run `opencode debug skill` to check the loaded skills. Pull the clone to update; remove the entries from `plugin` in `~/.config/opencode/opencode.json` to uninstall.

## Pi

The repository root is a Pi package (`package.json` with a `pi` manifest) that bundles the skills of both plugins. Install it from GitHub:

```sh
pi install git:github.com/testo/skills-for-testo-saveris-data-apis
```

Add `-l` to install for the current project only (`.pi/settings.json`) instead of globally (`~/.pi/agent/settings.json`).

Pi can't install a package from a repository subfolder. To install a single plugin, clone the repository and install the plugin folder, which is a Pi package too, from the local path:

```sh
git clone https://github.com/testo/skills-for-testo-saveris-data-apis.git
pi install ./skills-for-testo-saveris-data-apis/plugins/testo-data-api
pi install ./skills-for-testo-saveris-data-apis/plugins/testo-real-time-api
```

Alternatively, install the whole repository and run `pi config` to disable the skills you don't need. Pi invokes skills as `/skill:<name>`, for example `/skill:testo-data-api-help`.

Check, update or remove:

```sh
pi list
pi update git:github.com/testo/skills-for-testo-saveris-data-apis
pi remove git:github.com/testo/skills-for-testo-saveris-data-apis
```

For local path installs, pull the clone to update and `pi remove <path>` to uninstall.

## Verify

After installing, start a new session and run `/testo-data-api-help` or `/testo-real-time-api-help` (`/skill:testo-data-api-help` or `/skill:testo-real-time-api-help` in Pi) to list the available skills.
