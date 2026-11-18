#!/usr/bin/env node
/**
 * Sets the version of the marketplace or of a single plugin across every tool-specific manifest.
 * Requires Node.js 18+, no dependencies.
 *
 * Usage:
 *   node scripts/set-version.mjs <target> <version|major|minor|patch> [--dry-run]
 *
 * Targets:
 *   marketplace   Marketplace-level version: "metadata.version" in the .cursor-plugin, .github/plugin,
 *                 .claude-plugin, .grok-plugin and .agents/plugins marketplace.json files, and
 *                 "version" in .devin-plugin/plugin.json and the root package.json (Pi package).
 *   <plugin>      One plugin folder under plugins/ (testo-data-api, testo-real-time-api): its plugin.json,
 *                 package.json, gemini-extension.json, every .*-plugin/plugin.json, its entries in the
 *                 marketplace manifests and the "## Version" line of its *-help skill SKILL.md.
 *   all           The marketplace and every plugin.
 *
 * Version:
 *   - An exact semver such as 1.2.3, or major / minor / patch to bump the current version.
 *   - Bumps start from the plugin's plugin.json (the first marketplace manifest for the marketplace)
 *     and then set the same version in every file.
 *
 * Behaviour:
 *   - Only existing "version" values are rewritten; missing fields are not added and the rest of
 *     each file, including its formatting, is left untouched.
 *   - Fails on an unknown target, an invalid version or a help skill without a "## Version" section.
 *   - --dry-run lists every file with its current and new version without writing anything.
 *
 * Examples:
 *   node scripts/set-version.mjs marketplace 1.0.0           # marketplace manifests only
 *   node scripts/set-version.mjs testo-data-api patch        # one plugin
 *   node scripts/set-version.mjs all minor --dry-run         # marketplace and every plugin, preview only
 *   node scripts/set-version.mjs all 0.1.0                   # align every version
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const pluginsDir = path.join(root, "plugins")

// Marketplace manifests: [file, JSON path of the marketplace version].
const MARKETPLACE_VERSIONS = [
  [".cursor-plugin/marketplace.json", ["metadata", "version"]],
  [".github/plugin/marketplace.json", ["metadata", "version"]],
  [".claude-plugin/marketplace.json", ["metadata", "version"]],
  [".grok-plugin/marketplace.json", ["metadata", "version"]],
  [".agents/plugins/marketplace.json", ["metadata", "version"]],
  [".devin-plugin/plugin.json", ["version"]],
  ["package.json", ["version"]],
]

// Marketplace manifests that may repeat each plugin's version in their "plugins" entries.
const MARKETPLACE_FILES = MARKETPLACE_VERSIONS.map(([file]) => file).filter((file) => file.endsWith("marketplace.json"))

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/
const BUMPS = ["major", "minor", "patch"]

const usage = `Usage: node scripts/set-version.mjs <target> <version|major|minor|patch> [--dry-run]

Targets:
  marketplace   Marketplace manifests (${MARKETPLACE_VERSIONS.map(([file]) => file).join(", ")})
  all           The marketplace and every plugin
  <plugin>      One plugin: ${listPlugins().join(", ")}

A plugin update covers plugin.json, package.json, gemini-extension.json, every .*-plugin/plugin.json,
the plugin's entries in the marketplace manifests and the "## Version" section of its help skill.

Examples:
  node scripts/set-version.mjs marketplace 1.0.0
  node scripts/set-version.mjs testo-data-api patch
  node scripts/set-version.mjs all 1.2.0 --dry-run`

main(process.argv.slice(2))

function main(argv) {
  const dryRun = argv.includes("--dry-run")
  const args = argv.filter((arg) => arg !== "--dry-run")
  if (args.includes("-h") || args.includes("--help")) return console.log(usage)
  if (args.length !== 2) fail(usage)

  const [target, versionArg] = args
  if (!SEMVER.test(versionArg) && !BUMPS.includes(versionArg)) {
    fail(`Invalid version "${versionArg}". Use semver (e.g. 1.2.3) or one of: ${BUMPS.join(", ")}.`)
  }

  const plugins = listPlugins()
  let targets
  if (target === "all") targets = ["marketplace", ...plugins]
  else if (target === "marketplace" || plugins.includes(target)) targets = [target]
  else fail(`Unknown target "${target}". Use marketplace, all or one of: ${plugins.join(", ")}.`)

  const changes = []
  for (const name of targets) {
    const edits = name === "marketplace" ? marketplaceEdits() : pluginEdits(name)
    if (edits.length === 0) fail(`No version fields found for "${name}".`)
    const version = resolveVersion(versionArg, edits[0].current)
    console.log(`${name}: ${version}`)
    for (const edit of edits) {
      console.log(`  ${edit.file}: ${edit.current} -> ${version}`)
      changes.push({ ...edit, version })
    }
  }

  if (dryRun) return console.log("\nDry run, no files written.")
  applyChanges(changes)
  console.log(`\nUpdated ${new Set(changes.map((change) => change.file)).size} file(s).`)
}

function listPlugins() {
  if (!existsSync(pluginsDir)) return []
  return readdirSync(pluginsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function marketplaceEdits() {
  const edits = []
  for (const [file, jsonPath] of MARKETPLACE_VERSIONS) {
    const edit = jsonEdit(file, jsonPath)
    if (edit) edits.push(edit)
  }
  return edits
}

function pluginEdits(plugin) {
  const dir = `plugins/${plugin}`
  const manifests = ["plugin.json", "package.json", "gemini-extension.json"].map((file) => `${dir}/${file}`)
  const toolDirs = readdirSync(path.join(root, dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\..+-plugin$/.test(entry.name))
    .map((entry) => `${dir}/${entry.name}/plugin.json`)
    .sort()

  const edits = []
  for (const file of [...manifests, ...toolDirs]) {
    const edit = jsonEdit(file, ["version"])
    if (edit) edits.push(edit)
    else if (existsSync(path.join(root, file))) console.warn(`  warning: ${file} has no "version" field, skipped`)
  }

  for (const file of MARKETPLACE_FILES) {
    if (!existsSync(path.join(root, file))) continue
    const entries = JSON.parse(readFileSync(path.join(root, file), "utf8")).plugins ?? []
    entries.forEach((entry, index) => {
      if (entry.name !== plugin) return
      const edit = jsonEdit(file, ["plugins", index, "version"])
      if (edit) edits.push(edit)
    })
  }

  edits.push(helpSkillEdit(plugin))
  return edits
}

function helpSkillEdit(plugin) {
  const skillsDir = path.join(root, "plugins", plugin, "skills")
  const helpDirs = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory() && e.name.endsWith("-help"))
    : []
  if (helpDirs.length !== 1) fail(`Expected exactly one *-help skill in plugins/${plugin}/skills, found ${helpDirs.length}.`)

  const file = `plugins/${plugin}/skills/${helpDirs[0].name}/SKILL.md`
  const text = readFileSync(path.join(root, file), "utf8")
  const match = /^## Version[ \t]*\r?\n(?:[ \t]*\r?\n)*([^\s]+)/m.exec(text)
  if (!match) fail(`${file} has no "## Version" section followed by a version line.`)
  const start = match.index + match[0].length - match[1].length
  return { file, current: match[1], start, end: start + match[1].length }
}

function jsonEdit(file, jsonPath) {
  const full = path.join(root, file)
  if (!existsSync(full)) return null
  const text = readFileSync(full, "utf8")
  const span = findStringSpan(text, jsonPath)
  if (!span) return null
  return { file, current: JSON.parse(text.slice(span.start, span.end)), start: span.start, end: span.end, json: true }
}

function resolveVersion(arg, current) {
  if (!BUMPS.includes(arg)) return arg
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(current)
  if (!match) fail(`Cannot bump non-semver version "${current}".`)
  let [major, minor, patch] = match.slice(1).map(Number)
  if (arg === "major") [major, minor, patch] = [major + 1, 0, 0]
  else if (arg === "minor") [minor, patch] = [minor + 1, 0]
  else patch += 1
  return `${major}.${minor}.${patch}`
}

function applyChanges(changes) {
  const byFile = new Map()
  for (const change of changes) byFile.set(change.file, [...(byFile.get(change.file) ?? []), change])
  for (const [file, fileChanges] of byFile) {
    const full = path.join(root, file)
    let text = readFileSync(full, "utf8")
    // Apply from the end so earlier offsets stay valid.
    for (const change of fileChanges.sort((a, b) => b.start - a.start)) {
      const value = change.json ? JSON.stringify(change.version) : change.version
      text = text.slice(0, change.start) + value + text.slice(change.end)
    }
    if (file.endsWith(".json")) JSON.parse(text)
    writeFileSync(full, text)
  }
}

// Returns the source span (including quotes) of the string value at jsonPath, or null.
function findStringSpan(text, jsonPath) {
  let i = 0
  let found = null

  const ws = () => {
    while (/\s/.test(text[i] ?? "")) i++
  }
  const string = () => {
    const start = i++
    while (text[i] !== '"') i += text[i] === "\\" ? 2 : 1
    i++
    return { start, end: i }
  }
  const matches = (current) =>
    current.length === jsonPath.length && current.every((key, index) => key === jsonPath[index])

  const value = (current) => {
    ws()
    const ch = text[i]
    if (ch === "{") {
      i++
      ws()
      while (text[i] !== "}") {
        const key = JSON.parse(text.slice(...Object.values(string())))
        ws()
        i++ // colon
        value([...current, key])
        ws()
        if (text[i] === ",") i++
        ws()
      }
      i++
    } else if (ch === "[") {
      i++
      ws()
      let index = 0
      while (text[i] !== "]") {
        value([...current, index++])
        ws()
        if (text[i] === ",") i++
        ws()
      }
      i++
    } else if (ch === '"') {
      const span = string()
      if (matches(current)) found = span
    } else {
      while (i < text.length && !/[\s,\]}]/.test(text[i])) i++
    }
  }

  JSON.parse(text)
  value([])
  return found
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
