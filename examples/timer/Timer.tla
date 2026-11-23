---- MODULE Timer ----
\* ABOUTME: Models one timer and a callback that may arrive after cancellation.
\* ABOUTME: Both configurations check the same rule with the same state space variables.

CONSTANT RejectStale
VARIABLES phase, callbackPending, cancelled

vars == <<phase, callbackPending, cancelled>>

Init ==
  /\ phase = "idle"
  /\ callbackPending = FALSE
  /\ cancelled = FALSE

Start ==
  /\ phase = "idle"
  /\ phase' = "running"
  /\ callbackPending' = TRUE
  /\ UNCHANGED cancelled

Cancel ==
  /\ phase = "running"
  /\ phase' = "cancelled"
  /\ cancelled' = TRUE
  /\ UNCHANGED callbackPending

Expire ==
  /\ callbackPending
  /\ callbackPending' = FALSE
  /\ phase' = IF phase = "running" \/ ~RejectStale THEN "completed" ELSE phase
  /\ UNCHANGED cancelled

Done ==
  /\ phase \in {"completed", "cancelled"}
  /\ ~callbackPending
  /\ UNCHANGED vars

Next == Start \/ Cancel \/ Expire \/ Done
NeverCompleteCancelled == ~(cancelled /\ phase = "completed")

====
