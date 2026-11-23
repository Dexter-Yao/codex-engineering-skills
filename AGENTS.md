# Codex Engineering Skills Agent Guide

The repository owns the selectable Codex skills, supporting workflows, and
runnable examples. `catalog.json` is the installation allowlist.

- Keep skill instructions and their dependencies under `skills/`. Keep role
  prompts in `agents/`. Support directories remain available by package path.
- Keep the standalone Eval entry and Poteto Mode's Eval route on the same
  playbook. Use the existing module entry point when extending a skill.
- Keep exact upstream revisions and the scope of each adaptation in `NOTICE.md` or the
  skill's notice. Preserve the original MIT license and third-party notices.
- Run `node --test scripts/install-skills.test.mjs` for catalog and installer
  changes. Use [the Statechart guide](docs/statechart.md) for engine changes.
- Keep `CLAUDE.md` identical to this file.
