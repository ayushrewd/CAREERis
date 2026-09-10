import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string | null): boolean {
  if (!storedHash) return false;
  const [algorithm, salt, expectedHex] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  const actual = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
