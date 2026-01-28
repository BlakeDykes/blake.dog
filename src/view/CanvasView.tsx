import { useEffect, useRef, useState } from "react";
import { resizeCanvasToDisplaySize } from "../gpu/utils";
import { initWebGPU } from "../gpu/initWebGPU";
import { loadParticlesModule } from "../wasm/particles/loadParticles";
import { Renderer } from "../renderer/Renderer";

const PARTICLE_COUNT = 50_000;

export const CanvasView = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        resizeCanvasToDisplaySize(canvas);

        const [{ device, context, format }, wasm] = await Promise.all([
          initWebGPU(canvas),
          loadParticlesModule(),
        ]);

        if (cancelled) return;

        wasm._init_particles(PARTICLE_COUNT);
        const count = wasm._get_count();
        const ptr = wasm._get_positions();

        let heapBuffer = wasm.HEAPF32.buffer;
        let positions = new Float32Array(heapBuffer, ptr, count * 2);

        const renderer = new Renderer({
          device,
          context,
          format,
          instanceCount: count,
        });

        let last = performance.now();

        const frame = (now: number) => {
          if (cancelled) return;

          // if memory changes, recreate the view
          if (wasm.HEAPF32.buffer !== heapBuffer) {
            heapBuffer = wasm.HEAPF32.buffer;
            positions = new Float32Array(heapBuffer, ptr, count * 2);
          }

          if (resizeCanvasToDisplaySize(canvas)) {
            context.configure({ device, format, alphaMode: "premultiplied" });
          }

          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;

          wasm._step_particles(dt);

          renderer.updateInstances(positions);
          renderer.render();

          rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    };

    start();

    return () => {
      cancelled = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  if (error) return <div style={{ padding: 16 }}>Error: {error}</div>;

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};
