# Statechart

A standalone Codex skill and CLI for checking TLA+ models with TLC. It draws a
Mermaid statechart from the checked model and explains rule violations as
counterexample paths. This repository adapts [Lauren Tan’s pstack
statechart](skills/statechart/NOTICE.md).

## Install for Codex

From the repository root on macOS or Linux:

```sh
mkdir -p ~/.agents/skills
ln -s "$PWD/skills/statechart" ~/.agents/skills/statechart
```

On Windows, copy `skills/statechart` to `%USERPROFILE%\.agents\skills\statechart`.
For project-scoped use, place the skill under the project's `.agents/skills`
directory. In Codex, choose **Statechart** from the skill picker. In the CLI,
select it from `/skills` or select the `$statechart` mention in the composer.

> Use Statechart to model the cancellation and expiry paths for this timer.
> Check that cancellation survives a queued expiry, then replay any counterexample
> through the code's entry points.

### Runtime

Use Node.js 22.18 through 22.x or Node.js 23.6+, and
[Java](https://adoptium.net/temurin/releases/) with [TLC
1.7.4](https://github.com/tlaplus/tlaplus/releases/tag/v1.7.4). The skill uses
local dependencies. Save the release JAR as
`~/.local/share/statechart/tla2tools.jar` or set `TLA2TOOLS` to its absolute
path. Use Java on PATH, set `JAVA` to its executable, or place a standalone
Java runtime under `~/.local/share/statechart/java`.

Expected SHA-256 for `tla2tools.jar` 1.7.4:

```text
936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88
```

TLC 1.7.4 can bind a temporary Java RMI port even during a single-worker local
check. If the host sandbox denies that bind, the check needs a runtime that
permits it. A `--view` module executes locally and should be one you authored
or trust.

## Reproduce the timer race

The sample models one timer with a callback pending when cancellation occurs.
The invariant says that a cancelled timer never completes. TLC finds the
three-step path in the buggy configuration. The replay drives the example
implementation using that path from the generated report, observes the failure,
and checks that the fixed implementation still completes on normal expiry.

```sh
node --test examples/timer/replay.test.mjs
```

To keep the chart, report, and TLC output from the failing model:

```sh
scratch="$(mktemp -d)"
sh skills/statechart/scripts/statechart examples/timer/Timer.tla \
  --config examples/timer/buggy.cfg --view examples/timer/view.mjs \
  --out "$scratch/buggy"
```

Exit code `1` means the model broke a rule and the command wrote its report.
Use `fixed.cfg` and a fresh output directory for the control, which exits `0`.
The sample excludes timer reuse, multiple outstanding callbacks, and persistence.
For a project-specific check, keep the model's bounds and the implementation
replay with the code they cover.

## Develop

```sh
npm --prefix skills/statechart/scripts ci
npm --prefix skills/statechart/scripts test
```

Set `TLA2TOOLS` and point `JAVA` to a JDK executable for the upstream suite's
TLC-backed Java source oracle. See the [skill](skills/statechart/SKILL.md) for
chart generation and [rendering guidance](skills/statechart/references/render.md)
for SVG export.

The [MIT license](LICENSE) applies to this repository. See the [attribution and
upstream revision](skills/statechart/NOTICE.md).
