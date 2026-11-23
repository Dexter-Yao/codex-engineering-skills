// ABOUTME: Implements the sample timer with an injected scheduler.
// ABOUTME: The two variants differ only in how they receive an expiry after cancellation.

export class Timer {
  #phase = "idle";

  constructor(schedule, { rejectStale = true } = {}) {
    this.schedule = schedule;
    this.rejectStale = rejectStale;
  }

  get phase() {
    return this.#phase;
  }

  start() {
    if (this.#phase !== "idle") throw new Error("The timer can only start once.");
    this.#phase = "running";
    this.schedule(() => {
      if (!this.rejectStale || this.#phase === "running") {
        this.#phase = "completed";
      }
    });
  }

  cancel() {
    if (this.#phase === "running") this.#phase = "cancelled";
  }
}
