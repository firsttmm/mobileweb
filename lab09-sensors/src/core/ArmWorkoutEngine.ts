import type { AccelSample, WorkoutState } from "./types";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();
  private lastRepTime = 0;
  private peak = 0;
  private valley = 0;
  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: { repsTotal: 0, repsOk: 0, repsBad: 0, score: 0, avgRepMs: 0 },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() { this.listeners.forEach((cb) => cb(this.clone())); }
  private clone(): WorkoutState { return JSON.parse(JSON.stringify(this.state)); }

  start() {
    this.state = { status: "RUNNING", repDisplay: 0, 
      stats: { repsTotal: 0, repsOk: 0, repsBad: 0, score: 0, avgRepMs: 0 } 
    };
    this.phase = "WAIT_UP";
    this.emit();
  }

  stop() { this.state.status = "STOPPED"; this.emit(); }

  process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;
    const y = sample.ay;
    const sideDistortion = Math.abs(sample.ax) + Math.abs(sample.az);

    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);
      if (y > 2.0) this.phase = "WAIT_DOWN"; // เริ่มยกขึ้น
    } else {
      this.valley = Math.min(this.valley, y);
      if (y < -1.0) { // ลดแขนลงสุด
        const repMs = sample.t - (this.lastRepTime || sample.t);
        this.lastRepTime = sample.t;
        this.state.stats.repsTotal++;

        const rom = this.peak - this.valley;
        let ok = true;
        let msg = "OK";

        if (rom < 3.0) { ok = false; msg = "ยกแขนต่ำเกินไป"; }
        else if (repMs < 800) { ok = false; msg = "เร็วเกินไป"; }
        else if (sideDistortion > 15.0) { ok = false; msg = "กรุณายกแนวตั้ง"; }

        if (ok) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score += 10;
        } else {
          this.state.stats.repsBad++;
        }

        this.state.stats.lastMessage = msg;
        this.phase = "WAIT_UP"; this.peak = 0; this.valley = 0;
        this.emit();
      }
    }
  }
}