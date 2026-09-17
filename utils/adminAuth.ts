import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "workshop123",
    secret: process.env.ADMIN_SECRET || "workshop-secret",
  };
}

export function createAdminSessionToken(username: string) {
  const { secret } = getAdminCredentials();
  const hash = crypto.createHmac("sha256", secret).update(username).digest("hex");
  return `${username}:${hash}`;
}

export function validateAdminSession(token?: string) {
  if (!token) return false;

  const { username, secret } = getAdminCredentials();
  const [candidateUser, candidateHash] = token.split(":");
  if (!candidateUser || !candidateHash) return false;

  const expectedHash = crypto.createHmac("sha256", secret).update(candidateUser).digest("hex");
  return candidateUser === username && candidateHash === expectedHash;
}

export function verifyAdminLogin(username: string, password: string) {
  const creds = getAdminCredentials();
  return username === creds.username && password === creds.password;
}
