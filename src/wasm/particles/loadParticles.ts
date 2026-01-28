import createModule from "./particles";

export type ParticlesModule = {
  HEAPF32: Float32Array;
  _init_particles(count: number): void;
  _get_count(): number;
  _get_positions(): number; // pointer (byte offset)
  _step_particles(dt: number): void;
};

export const loadParticlesModule = async () =>
  (await createModule({
    locateFile: (path: string) => {
      if (path.endsWith(".wasm")) {
        return new URL("./particles.wasm", import.meta.url).toString();
      }
      return path;
    },
  })) as ParticlesModule;
