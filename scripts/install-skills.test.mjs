// ABOUTME: Checks the collection's selectable entry list and directory-link installer.
// ABOUTME: Uses isolated destinations so tests leave existing Codex skills alone.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, realpathSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const installer = join(import.meta.dirname, "install-skills.mjs");
const repo = join(import.meta.dirname, "..");

function temporaryDirectory(t) {
  const directory = mkdtempSync(join(tmpdir(), "codex-skill-install-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function run(destination, ...args) {
  const result = spawnSync(process.execPath, [installer, "--dest", destination, ...args], {
    encoding: "utf8",
  });
  assert.ifError(result.error);
  return result;
}

test("the README and full installation match the catalog", (t) => {
  const destination = temporaryDirectory(t);
  const { skills } = JSON.parse(readFileSync(join(repo, "catalog.json"), "utf8"));
  assert.equal(new Set(skills).size, skills.length);
  const readme = readFileSync(join(repo, "README.md"), "utf8");
  const documented = Array.from(
    readme.matchAll(/^\| \[\x60\$([a-z-]+)\x60\]\(skills\/\1\/SKILL\.md\)/gm),
    ([, name]) => name,
  );
  assert.deepEqual(documented, skills);

  const result = run(destination);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readdirSync(destination).sort(), [...skills].sort());
  for (const name of skills) {
    assert.equal(realpathSync(join(destination, name)), realpathSync(join(repo, "skills", name)));
  }
});

test("a subset can be reinstalled and a conflict blocks new links", (t) => {
  const destination = temporaryDirectory(t);
  for (const attempt of [1, 2]) {
    const result = run(destination, "sharpen");
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(readdirSync(destination), ["sharpen"], `attempt ${attempt}`);
  }

  const conflict = join(destination, "automate-me");
  writeFileSync(conflict, "existing user file", "utf8");
  const result = run(destination, "eval", "automate-me");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Existing entry/);
  assert.deepEqual(readdirSync(destination).sort(), ["automate-me", "sharpen"]);
  assert.equal(readFileSync(conflict, "utf8"), "existing user file");
  const invalid = run(destination, "architect");
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Unknown skill/);
});
