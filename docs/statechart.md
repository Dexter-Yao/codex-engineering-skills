# Statechart

A Codex skill and CLI for checking TLA+ models with TLC. It draws a
Mermaid statechart from the checked model and explains rule violations as
counterexample paths. This repository adapts [Lauren Tan’s pstack
statechart](../skills/statechart/NOTICE.md).

## Statechart components

| Component | What it does |
| --- | --- |
| [Statechart skill](../skills/statechart/SKILL.md) | Guides Codex through writing a TLA+ model for a workflow, checking its rules, and replaying any counterexample against the implementation. |
| [Command-line tool](../skills/statechart/scripts/statechart) | Runs TLC on a TLA+ model and configuration. A completed check writes a report and TLC output. The tool draws the full Mermaid chart within its state budget, or the available counterexample paths for larger models. An optional view module labels states and actions in the reader's terms. |
| [SVG rendering guide](../skills/statechart/references/render.md) | Explains how to render the generated Mermaid diagram as a themed SVG with Pele. |
| [Timer example](../examples/timer/replay.test.mjs) | Starts and cancels a timer, then delivers a queued expiry callback. The test replays the model's counterexample and checks the same invariant in a fixed configuration. |
| [Regression suite](../skills/statechart/scripts/test) | Exercises the compiler, CLI, and upstream corpus, including how TLC outputs are translated into diagrams and reports. |

TLC verifies the rules within the model and configuration you supply. A replay
checks whether the same sequence occurs in the implementation.

## Install for Codex

From the repository root, register only Statechart with Codex.

```sh
node scripts/install-skills.mjs statechart
```

Choose **Statechart** from the skill picker or select the `$statechart` mention
in the CLI. See the [collection README](../README.md) for more installation
options.

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
TLC-backed Java source oracle. See the [skill](../skills/statechart/SKILL.md) for
chart generation and [rendering guidance](../skills/statechart/references/render.md)
for SVG export.

## Acknowledgments

Thanks to Lauren Tan (poteto) and the pstack contributors for the original
Statechart skill and its TypeScript tool. Their work connects model checking to
a diagram that engineers and product reviewers can walk through together. The
chart pipeline, rendering guidance, and original test corpus come from pstack.
[Original pstack Statechart](https://github.com/cursor/plugins/blob/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack/skills/statechart/SKILL.md)

This adaptation adds Codex invocation metadata, a local runtime setup, and a
timer example with an executable counterexample replay. Thanks also to the
contributors who maintain TLC, Mermaid, and Pele.
[TLA+ Tools](https://github.com/tlaplus/tlaplus) · [Mermaid](https://mermaid.js.org/) · [Pele](https://pele.run/)

The [full MIT license](../LICENSE) retains Lauren Tan's copyright notice. The
[attribution file](../skills/statechart/NOTICE.md) records the pinned upstream
revision and distinguishes the separately obtained tools.
