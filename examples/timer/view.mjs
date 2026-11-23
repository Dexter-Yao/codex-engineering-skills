// ABOUTME: Maps TLC events to the timer behavior visible to a reviewer.
// ABOUTME: Distinguishes a pending callback so the chart retains the race.

export const title = "Timer cancellation and a late callback";

export function state({ phase, cancelled, callbackPending }) {
  if (phase === "completed" && cancelled) return "Completed after cancellation";
  if (phase === "cancelled" && callbackPending) return "Cancelled with callback pending";
  return { idle: "Idle", running: "Running", cancelled: "Cancelled", completed: "Completed" }[phase];
}

export function step(action) {
  return {
    Start: "Start the timer",
    Cancel: "Cancel the timer",
    Expire: "Deliver the expiry callback",
    Done: "Stay finished",
  }[action];
}
