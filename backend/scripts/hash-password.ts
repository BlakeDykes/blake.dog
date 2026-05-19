import { hashPassword } from "@/auth/password";

const password = process.argv[2];

if (!password) {
  console.error("Usage: pnpm auth:hash-password <password>");
  process.exit(1);
}

const hash = await hashPassword(password);

console.log(hash);
