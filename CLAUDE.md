# Statechart Agent Guide

This repository distributes one Codex skill and its CLI. `skills/statechart/`
owns invocation, runtime discovery, model checking, rendering and the license
files that travel with a standalone installation. `examples/timer/` exercises
the same CLI against real TLC and replays the resulting path against sample code.

- Keep the upstream revision and adaptations traceable in `skills/statechart/NOTICE.md`.
- Preserve the upstream corpus and keep the root and skill copies of `LICENSE`
  byte-identical. Runtime distributions are provisioned separately.
- Verify runtime or chart changes with the commands in `README.md`, using both
  the failing model and the passing control. Keep product data and generated
  output outside the repository.
- Keep `CLAUDE.md` identical to this file.
