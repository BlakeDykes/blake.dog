import shaderWGSL from "@/shaders/quad_instanced.wgsl?raw";

export class Renderer {
  private device: GPUDevice;
  private context: GPUCanvasContext;
  private format: GPUTextureFormat;

  private pipeline: GPURenderPipeline;
  private quadVB: GPUBuffer;
  private instanceVB: GPUBuffer;

  private instanceCount: number = 0;

  constructor(args: {
    device: GPUDevice;
    context: GPUCanvasContext;
    format: GPUTextureFormat;
    instanceCount: number;
  }) {
    this.device = args.device;
    this.context = args.context;
    this.format = args.format;
    this.instanceCount = args.instanceCount;

    const shader = this.device.createShaderModule({ code: shaderWGSL });

    this.pipeline = this.device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shader,
        entryPoint: "vsMain",
        buffers: [
          {
            arrayStride: 8,
            stepMode: "vertex",
            attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
          },
          {
            arrayStride: 8,
            stepMode: "instance",
            attributes: [{ shaderLocation: 1, offset: 0, format: "float32x2" }],
          },
        ],
      },
      fragment: {
        module: shader,
        entryPoint: "fsMain",
        targets: [{ format: this.format }],
      },
      primitive: { topology: "triangle-list" },
    });

    const quad = new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]);

    this.quadVB = this.device.createBuffer({
      size: quad.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    new Float32Array(this.quadVB.getMappedRange()).set(quad);
    this.quadVB.unmap();

    this.instanceVB = this.device.createBuffer({
      size: this.instanceCount * 2 * 4,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }

  updateInstances(positions: Float32Array) {
    if (positions.buffer instanceof ArrayBuffer) {
      this.device.queue.writeBuffer(
        this.instanceVB,
        0,
        positions.buffer,
        positions.byteOffset,
        positions.byteLength
      );
      return;
    }

    // if using shared memory / pthreads
    const copy = new Float32Array(positions);
    this.device.queue.writeBuffer(this.instanceVB, 0, copy);
  }

  render() {
    const encoder = this.device.createCommandEncoder();
    const view = this.context.getCurrentTexture().createView();

    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          loadOp: "clear",
          clearValue: { r: 0.05, g: 0.06, b: 0.08, a: 1 },
          storeOp: "store",
        },
      ],
    });

    pass.setPipeline(this.pipeline);
    pass.setVertexBuffer(0, this.quadVB);
    pass.setVertexBuffer(1, this.instanceVB);
    pass.draw(6, this.instanceCount);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
