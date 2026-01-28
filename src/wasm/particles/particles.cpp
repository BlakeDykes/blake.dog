#include <cstdint>
#include <cstdlib>
#include <cmath>

#ifdef __EMSCRIPTEN__
  #include <emscripten/emscripten.h>
  #define EXPORT EMSCRIPTEN_KEEPALIVE
#else
  #define EXPORT
#endif

static int g_count = 0;
static float* g_pos = nullptr; // [x0,y0,x1,y1,...]
static float* g_vel = nullptr;

static uint32_t rng_state = 0x12345678u;
static inline uint32_t xorshift32() {
  uint32_t x = rng_state;
  x ^= x << 13; x ^= x >> 17; x ^= x << 5;
  rng_state = x;
  return x;
}
static inline float frand(float a, float b) {
  // [0,1)
  float t = (xorshift32() & 0x00FFFFFF) / float(0x01000000);
  return a + (b - a) * t;
}

extern "C" {

EXPORT void init_particles(int count) {
  if (count <= 0) count = 1;

  if (g_pos) { std::free(g_pos); g_pos = nullptr; }
  if (g_vel) { std::free(g_vel); g_vel = nullptr; }

  g_count = count;
  g_pos = (float*)std::malloc(sizeof(float) * g_count * 2);
  g_vel = (float*)std::malloc(sizeof(float) * g_count * 2);

  for (int i = 0; i < g_count; i++) {
    // positions in NDC-ish space
    g_pos[i * 2 + 0] = frand(-0.95f, 0.95f);
    g_pos[i * 2 + 1] = frand(-0.95f, 0.95f);

    // small velocities
    g_vel[i * 2 + 0] = frand(-0.35f, 0.35f);
    g_vel[i * 2 + 1] = frand(-0.35f, 0.35f);
  }
}

EXPORT int get_count() { return g_count; }

// Returns a pointer (byte offset) to the float array in WASM memory.
EXPORT float* get_positions() { return g_pos; }

EXPORT void step_particles(float dt) {
  if (!g_pos || !g_vel) return;

  // clamp dt to avoid big jumps
  if (dt < 0.0f) dt = 0.0f;
  if (dt > 0.05f) dt = 0.05f;

  for (int i = 0; i < g_count; i++) {
    float& x = g_pos[i * 2 + 0];
    float& y = g_pos[i * 2 + 1];
    float& vx = g_vel[i * 2 + 0];
    float& vy = g_vel[i * 2 + 1];

    x += vx * dt;
    y += vy * dt;

    // bounce off bounds
    const float minB = -0.98f;
    const float maxB =  0.98f;

    if (x < minB) { x = minB; vx = -vx; }
    if (x > maxB) { x = maxB; vx = -vx; }
    if (y < minB) { y = minB; vy = -vy; }
    if (y > maxB) { y = maxB; vy = -vy; }
  }
}

} // extern "C"