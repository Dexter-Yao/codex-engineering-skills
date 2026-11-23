# Eval

Read the [Codex runtime contract](../references/codex-runtime.md). This playbook
can run directly through `$eval` or from `$poteto-mode`.

1. **Frame.** State the variant and the behavior it should change. Choose
   representative cases, 3–6 observable criteria, and any deterministic
   outcomes. Record the planned sample and any assignment or exposure limits.
2. **Isolate.** Each candidate runs in a separate clean context or supplied
   output set. Hold the case, starting artifact, tools, model and effort constant
   when testing a prompt, skill or context change. For a model comparison,
   vary the model and hold the prompt and fixture constant. For a prompt
   comparison, the prompt is the intentional difference. Use realistic tasks
   and fixtures. Keep the rubric, other variants, and evaluation labels out of
   candidate-visible materials. Ordinary project tests stay in the task.
3. **Run.** Use the isolation and dispatch pattern in
   [Arena Phase B](../../arena/SKILL.md#phase-b-fan-out). Pass each candidate
   only its assigned prompt and context. Keep private data in the authorized
   environment. Use existing outputs when supplied. If independent runs are
   unavailable, deliver the requested protocol or score supplied outputs and
   label the evidence accordingly.
4. **Score.** Apply executable checks where possible. Give the same rubric and
   sanitized outputs together to the blind judge. Keep the mapping from labels
   to variants outside the judge's context. Use the [Arena Phase C](../../arena/SKILL.md#phase-c-cross-judge)
   selection method for an independent reviewer where available. Identify a
   same-model judge or review by the coordinator as such.
5. **Verify.** Read the artifacts and check any disagreement. Use actual tool
   traces for claims about file reads, skill use and tool calls. Mark missing
   traces or failed runs explicitly. Preserve the evidence that supports each
   score.
6. **Report.** Explain the paired results, sample size, failures, rubric and
   limits. Label missing independence or model diversity. Recommend promotion
   only to the extent the observed comparison supports it.
