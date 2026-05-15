struct VSOut {
  @builtin(position) pos: vec4f,
}

@vertex
fn vsMain(
  @location(0) corner: vec2f,
  @location(1) instancePos: vec2f
) -> VSOut {
  var out: VSOut;
  let size = 0.01;
  let p = instancePos + corner * size;
  out.pos = vec4f(p, 0.0, 1.0);
  return out;
}

@fragment
fn fsMain() -> @location(0) vec4f {
  return vec4f(0.9, 0.95, 1.0, 1.0);
}