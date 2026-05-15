export type DeviceContext = {
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
};

export const initWebGPU = async (
  canvas: HTMLCanvasElement
): Promise<DeviceContext> => {
  if (!navigator.gpu) throw new Error("WebGPU not supported");

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No GPUAdapter available");

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");

  if (!context) throw new Error("Could not get webgpu context");

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "premultiplied" });

  return { device, context, format };
};
