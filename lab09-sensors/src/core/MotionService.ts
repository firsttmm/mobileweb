import { Motion } from "@capacitor/motion";
import type { AccelSample } from "./types";

export class MotionService {
  private remove?: () => void;

  async start(cb: (s: AccelSample) => void): Promise<void> {
    // ขอ Permission สำหรับ iOS/Android 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      await (DeviceMotionEvent as any).requestPermission();
    }

    const handler = await Motion.addListener("accel", (event) => {
      const a = event.accelerationIncludingGravity;
      if (!a) return;
      cb({ ax: a.x ?? 0, ay: a.y ?? 0, az: a.z ?? 0, t: Date.now() });
    });

    this.remove = () => handler.remove();
  }

  async stop(): Promise<void> {
    this.remove?.();
  }
}