const PASSWORD_HASH_VERSION = "pbkdf2";
const PASSWORD_HASH_ALGORITHM = "sha256";
const PASSWORD_HASH_ITERATIONS = 210_000;

const textEncoder = new TextEncoder();

const derivePasswordHash = async ({
  password,
  salt,
  iterations,
}: {
  password: string;
  salt: Uint8Array;
  iterations: number;
}) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    keyMaterial,
    256
  );

  return new Uint8Array(bits);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const hash = await derivePasswordHash({
    password,
    salt,
    iterations: PASSWORD_HASH_ITERATIONS,
  });

  return [
    PASSWORD_HASH_VERSION,
    PASSWORD_HASH_ALGORITHM,
    String(PASSWORD_HASH_ITERATIONS),
    bytesToBase64Url(salt),
    bytesToBase64Url(hash),
  ].join(":");
};

export const verifyPassword = async ({
  password,
  storedHash,
}: {
  password: string;
  storedHash: string;
}): Promise<boolean> => {
  const [version, algorithm, iterationsRaw, saltRaw, hashRaw] =
    storedHash.split(":");
  if (version !== PASSWORD_HASH_VERSION) return false;
  if (algorithm !== PASSWORD_HASH_ALGORITHM) return false;

  const iterations = Number(iterationsRaw);

  if (!Number.isInteger(iterations) || iterations <= 0) return false;

  const salt = base64UrlToBytes(saltRaw);
  const expectedHash = base64UrlToBytes(hashRaw);

  const actualHash = await derivePasswordHash({
    password,
    salt,
    iterations,
  });

  return timingSafeEqual(actualHash, expectedHash);
};

export const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

export const base64UrlToBytes = (value: string): Uint8Array => {
  const padded = value.padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "="
  );
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

export const timingSafeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.byteLength !== b.byteLength) return false;

  let diff = 0;
  for (let i = 0; i < a.byteLength; ++i) {
    diff |= a[i] ^ b[i];
  }

  return diff === 0;
};
