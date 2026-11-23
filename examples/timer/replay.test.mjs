// ABOUTME: Runs the sample through TLC and replays the reported events against Timer.
// ABOUTME: Covers both the failure and the control with exactly the same invariant.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { Timer } from "./timer.mjs";

const model = join(import.meta.dirname, "Timer.tla");
const view = join(import.meta.dirname, "view.mjs");
const cli = join(import.meta.dirname, "../../skills/statechart/scripts/statechart.ts");

function check(variant, expectedExit, dir) {
  const out = join(dir, variant);
  const result = spawnSync(process.execPath, [
    cli, model, "--config", join(import.meta.dirname, `${variant}.cfg`),
    "--view", view, "--out", out,
  ], { encoding: "utf8", timeout: 30_000 });
  assert.ifError(result.error);
  assert.equal(result.status, expectedExit, result.stderr);
  return {
    report: readFileSync(join(out, "report.md"), "utf8"),
    chart: readFileSync(join(out, "chart.mmd"), "utf8"),
  };
}

function replay(events, rejectStale) {
  const scheduled = [];
  const timer = new Timer((callback) => scheduled.push(callback), { rejectStale });
  const actions = new Map([
    ["Start the timer", () => timer.start()],
    ["Cancel the timer", () => timer.cancel()],
    ["Deliver the expiry callback", () => {
      assert.equal(scheduled.length, 1);
      scheduled.shift()();
    }],
  ]);
  return events.map((event) => {
    assert.ok(actions.has(event), `Unknown timer event: ${event}`);
    actions.get(event)();
    return timer.phase;
  });
}

test("the TLC counterexample reproduces on the buggy timer and is blocked by the fix", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "statechart-timer-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const buggy = check("buggy", 1, dir);
  assert.match(buggy.report, /^## NeverCompleteCancelled breaks$/m);
  assert.match(buggy.report, /The shortest path has 3 steps/);
  assert.match(buggy.chart, /^  class s\d+ breaks$/m);
  const events = Array.from(buggy.report.matchAll(/^[1-9]\d*\. ([^:\n]+):/gm), ([, event]) => event);
  assert.deepEqual(events, ["Start the timer", "Cancel the timer", "Deliver the expiry callback"]);
  assert.deepEqual(replay(events, false), ["running", "cancelled", "completed"]);
  assert.deepEqual(replay(events, true), ["running", "cancelled", "cancelled"]);
  assert.deepEqual(replay([events[0], events[2]], true), ["running", "completed"]);

  const fixed = check("fixed", 0, dir);
  assert.match(fixed.report, /^## Rules that hold\n.*\bNeverCompleteCancelled\b/m);
  assert.doesNotMatch(fixed.chart, /^  class \S+ (?:mayBreak|breaks)$/m);
});
