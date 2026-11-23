# Codex Engineering Skills

A collection of skills for planning engineering work, coordinating agents,
evaluating prompts and workflows, and verifying software behavior.

The collection has 11 selectable entries. Sharpen and Unslop improve prompts
and prose. Poteto Mode, Automate Me, and Arena help organize work. Eval and
Benchmark Checklist evaluate results. Blast Radius, Statechart, and the two
formal-verification skills check changes against behavior and evidence.

## Install

Clone the repository and run the installer from its root with Node.js 22.18+.

```sh
node scripts/install-skills.mjs --list
node scripts/install-skills.mjs
```

To select a subset, name the skills you want:

```sh
node scripts/install-skills.mjs sharpen eval statechart
```

The installer links the selected skills into `~/.agents/skills`. Keep the clone
at its installed path so the links and package-relative dependencies remain
available. Use `--dest <directory>` for a different skill directory, such as
`.agents/skills` within a project. The installer reports a conflicting entry
before it creates links. In Codex, select a skill by name. In the CLI, use its
`$name` mention.

## Skills you can select

Choose the skill by name in Codex. In the CLI, select its `$name` mention.

| Skill | Use it when | What it produces |
| --- | --- | --- |
| [`$sharpen`](skills/sharpen/SKILL.md) | You want to improve a task prompt before running it. | A revised prompt with concrete sources, methods, and a way to verify the result. |
| [`$eval`](skills/eval/SKILL.md) | You want to compare two prompts, skills, models, or context setups. | A controlled protocol and, when run, paired results against the same rubric. |
| [`$poteto-mode`](skills/poteto-mode/SKILL.md) | You have an engineering task and want a workflow matched to it. | The relevant playbook and evidence from carrying it through, within the requested scope. |
| [`$automate-me`](skills/automate-me/SKILL.md) | You want to capture recurring collaboration habits from a project or selected examples. | A personal `-mode` skill draft for review. |
| [`$arena`](skills/arena/SKILL.md) | You want independent attempts at the same design or implementation question. | A synthesized result with the chosen base, useful ideas from alternatives, and verification evidence. |
| [`$unslop`](skills/unslop/SKILL.md) | You want to make prose more direct and specific. | An edit that removes filler and repetitive phrasing. |
| [`$statechart`](skills/statechart/SKILL.md) | You want to see whether a workflow can reach a state that breaks a rule. | A checked TLA+ model, a report, and a Mermaid chart when available. Rule violations include counterexample paths. |
| [`$create-formal-verification-skill`](skills/create-formal-verification-skill/SKILL.md) | A critical rule needs a check that can cover event orders or inputs beyond hand-written examples. | A project-local verification skill, a rerun command, and a control that demonstrates the check can fail. |
| [`$maintain-formal-verification-skill`](skills/maintain-formal-verification-skill/SKILL.md) | The code has changed since a formal check was established. | A check of model-to-code alignment, with evidence for any drift or implementation regression. |
| [`$benchmark-checklist`](skills/benchmark-checklist/SKILL.md) | You want to know whether a benchmark supports a performance claim. | A verdict that accounts for repeatability, configuration, failures, and user-visible relevance. |
| [`$blast-radius`](skills/blast-radius/SKILL.md) | You want to find where else a proposed change can affect behavior. | A trace of affected callers and boundaries, with a test or reproduction for the main assumption. |

## How the package fits together

- [`catalog.json`](catalog.json) declares the selectable skills. [`skills/`](skills)
  contains the entry points and supporting material. Only entries in the catalog
  are registered by the installer.
- [`agents/`](agents) provides role instructions for the workflows that delegate.
  [`docs/`](docs) contains module guides. [`examples/`](examples) contains
  runnable examples with their own inputs and assertions.
- [Statechart](docs/statechart.md) has a CLI, separate Java/TLC setup, and a
  timer example that replays a model counterexample against implementation code.
  The other skills can be selected without provisioning Statechart's runtime.
- [Eval](skills/eval/SKILL.md) and the Eval route in Poteto Mode share the same
  [playbook](skills/poteto-mode/playbooks/eval.md). Prompting and writing skills
  can run as independent entries.
- The optional [PR watcher](skills/poteto-mode/scripts/watch-pr) uses Bun and
  GitHub CLI. To provision its declared dependencies, run
  `bun install --production --frozen-lockfile --ignore-scripts` from
  `skills/poteto-mode/scripts`.

## What the package loads for its workflows

Poteto Mode reads its [runtime contract](skills/poteto-mode/references/codex-runtime.md)
and loads the applicable [playbook](skills/poteto-mode/playbooks). The package
contains 23 playbooks, 24 engineering principles, and two role prompts. Those
files inform an invoked workflow and use the tools available in the current
Codex session.

| Playbooks | Included workflows |
| --- | --- |
| Investigation and diagnosis | Investigation, Bug Fix, Perf Issue, Hillclimb, Runtime Forensics, Trace Forensics |
| Design and implementation | Feature, Refactoring, Prototype, Visual Parity, Authoring a Skill, Eval, Multi-Phase Plan |
| Coordination and delivery | Autonomous Run, Orchestrate, Autopilot Full, Autopilot Stack, Babysit, Opening a PR, Shipping, Session Pickup, Pause Safely, Worktree Cleanup |

The supporting skills below are available to the workflows by package path.

| Helper | What it contributes |
| --- | --- |
| [Architect](skills/architect/SKILL.md) | Works out data shapes, boundaries, and caller interfaces before implementation. |
| [Bro](skills/bro/SKILL.md) | Restates a message in plain language. |
| [Create Verification Skill](skills/create-verification-skill/SKILL.md) | Builds project-specific checks that exercise a real user or client entry point. |
| [Figure It Out](skills/figure-it-out/SKILL.md) | Designs an evidence-driven workflow for a task that spans several steps or has no matching playbook. |
| [How](skills/how/SKILL.md) | Traces how a subsystem works today and where its responsibilities live. |
| [In Your Own Words](skills/in-your-own-words/SKILL.md) | Restates the operator's goal and the problem to solve. |
| [Interrogate](skills/interrogate/SKILL.md) | Challenges a proposed change and retains findings supported by an executable check. |
| [Ketchup](skills/ketchup/SKILL.md) | Summarizes recent progress in the current chat and highlights decisions awaiting the operator. |
| [Maintain Verification Skill](skills/maintain-verification-skill/SKILL.md) | Compares verification instructions and feature coverage against the current app. |
| [No Comments](skills/no-comments/SKILL.md) | Reviews whether comments carry useful constraints or merely repeat the code. |
| [Reflect](skills/reflect/SKILL.md) | Proposes durable skill edits based on corrections and evidence from the active conversation. |
| [Setup Pstack](skills/setup-pstack/SKILL.md) | Configures model and reasoning preferences for Pstack roles when requested. |
| [Show Me Your Work](skills/show-me-your-work/SKILL.md) | Records an evidence-linked decision trail for work that spans several steps. |
| [Swarm](skills/swarm/SKILL.md) | Assigns distinct slices of a task to workers and combines their findings. |
| [TDD](skills/tdd/SKILL.md) | Starts a narrowly scoped fix with a failing behavior test when the regression is cheap to reproduce. |
| [Technical Writing](skills/technical-writing/SKILL.md) | Shapes engineering documents around the reader and the job the document serves. |
| [Why](skills/why/SKILL.md) | Traces decisions through commits, discussions, and other records and labels gaps in the evidence. |

Poteto Agent is the scoped implementation delegate. Comment Sicko is the
comment-review role. The package also includes a plan checker, a worktree
audit, and a GitHub PR watcher for workflows that call them. Publication,
external messages, and merges require authorization for the current task.
[Poteto Agent](agents/poteto-agent.md) · [Comment Sicko](agents/comment-sicko.md) · [Helper scripts](skills/poteto-mode/scripts)

## Acknowledgments

Thanks to Lauren Tan (poteto) and the pstack contributors for turning practical
engineering work into reusable skills. The original prompts, playbooks, and
engineering principles come from pstack. Thanks to mnlauaa and contributors for
adapting how these workflows load tools, delegate work, and handle model choices
in Codex. This collection exposes Eval as a standalone skill and integrates
verification skills and the Statechart CLI into the same installation.
[Original pstack](https://github.com/cursor/plugins/tree/main/pstack) · [Pstack-Codex](https://github.com/mnlauaa/Pstack-Codex)

The [attribution and provenance record](NOTICE.md) identifies the pinned
revisions. The [full MIT license](LICENSE) retains the original copyright notice.
