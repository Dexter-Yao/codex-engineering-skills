// ABOUTME: Checks that the bundled PR watcher can load its pinned runtime dependency.
// ABOUTME: Dependency provisioning is an explicit install step.

import { existsSync } from "node:fs";
import { join } from "node:path";

export function ensureDependenciesInstalled(): void {
  const commander = join(import.meta.dir, "node_modules", "commander", "package.json");
  if (!existsSync(commander)) {
    throw new Error("PR watcher dependencies are missing. Run bun install --production --frozen-lockfile --ignore-scripts in this scripts directory.");
  }
}
