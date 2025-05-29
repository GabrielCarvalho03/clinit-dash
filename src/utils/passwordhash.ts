import crypto from "crypto";

export function hashPassword(password: string): string {
  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  return hashPassword;
}
