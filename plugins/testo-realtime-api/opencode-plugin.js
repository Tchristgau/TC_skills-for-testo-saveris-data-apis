import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Shared by every plugin in this repository; the plugin id comes from the sibling package.json.
const root = path.dirname(fileURLToPath(import.meta.url))
const skillsDir = path.join(root, "skills")
const { name: id } = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"))

// OpenCode V1: add the bundled skills folder to the skill search paths.
async function server() {
  return {
    async config(config) {
      if (Array.isArray(config.skills)) {
        if (!config.skills.includes(skillsDir)) config.skills.push(skillsDir)
        return
      }
      config.skills ??= {}
      config.skills.paths ??= []
      if (!config.skills.paths.includes(skillsDir)) config.skills.paths.push(skillsDir)
    },
  }
}

// OpenCode V2: register each bundled skill through the skill domain.
async function setup(ctx) {
  const skills = await loadSkills()
  await ctx.skill.transform((editor) => {
    for (const skill of skills) {
      if (!editor.get(skill.id)) editor.add(skill)
    }
  })
}

async function loadSkills() {
  const entries = await readdir(skillsDir, { withFileTypes: true })
  const skills = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const file = path.join(skillsDir, entry.name, "SKILL.md")
    const text = await readFile(file, "utf8").catch(() => undefined)
    const skill = text && parseSkill(entry.name, file, text)
    if (skill) skills.push(skill)
  }
  return skills
}

function parseSkill(dir, file, text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/)
  if (!match) return
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([\w-]+)[ \t]*:[ \t]*(.*)$/)
    if (field) data[field[1]] = field[2].trim().replace(/^(['"])(.*)\1$/, "$2")
  }
  return {
    id: dir,
    name: data.name || dir,
    ...(data.description ? { description: data.description } : {}),
    path: file,
    content: text.slice(match[0].length),
  }
}

export default { id, server, setup }
