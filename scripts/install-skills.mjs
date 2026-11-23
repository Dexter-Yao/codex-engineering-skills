// ABOUTME: Registers selected catalog entries as directory links in Codex.
// ABOUTME: Resolves dependencies through the source checkout and preserves conflicting entries.

import {
  existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, symlinkSync, unlinkSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const repo = resolve(import.meta.dirname, "..");
const { skills } = JSON.parse(readFileSync(join(repo, "catalog.json"), "utf8"));
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    dest: { type: "string" },
    list: { type: "boolean" },
    help: { type: "boolean", short: "h" },
  },
});

if (values.help) {
  console.log("Usage: node scripts/install-skills.mjs [--dest DIR] [--list] [SKILL ...]");
} else if (values.list) {
  console.log(skills.join("\n"));
} else {
  const destination = resolve(values.dest ?? join(homedir(), ".agents", "skills"));
  const selected = positionals.length ? [...new Set(positionals)] : skills;
  const created = [];

  function alreadyLinksTo({ target, source }) {
    try {
      return lstatSync(target).isSymbolicLink() && realpathSync(target) === source;
    } catch (error) {
      if (error.code === "ENOENT") return false;
      throw error;
    }
  }

  try {
    const plan = selected.map((name) => {
      if (!skills.includes(name)) throw new Error(`Unknown skill: ${name}. Use --list.`);
      const source = realpathSync(join(repo, "skills", name));
      const target = join(destination, name);
      if (!existsSync(join(source, "SKILL.md"))) throw new Error(`Missing SKILL.md for ${name}`);
      const installed = alreadyLinksTo({ target, source });
      if (!installed && lstatSync(target, { throwIfNoEntry: false })) {
        throw new Error(`Existing entry at ${target}. Move it or choose another --dest.`);
      }
      return { source, target, installed };
    });

    mkdirSync(destination, { recursive: true });
    const linkType = process.platform === "win32" ? "junction" : "dir";
    for (const entry of plan) {
      if (entry.installed) continue;
      symlinkSync(entry.source, entry.target, linkType);
      created.push(entry);
    }

    for (const entry of plan) console.log(entry.target);
  } catch (error) {
    for (const entry of created.reverse()) {
      if (alreadyLinksTo(entry)) unlinkSync(entry.target);
    }
    console.error(error.message);
    process.exitCode = 1;
  }
}
