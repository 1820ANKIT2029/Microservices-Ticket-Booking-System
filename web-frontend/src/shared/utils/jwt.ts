/**
 * Decodes a JWT token and returns its payload.
 */
export function decodeJwt(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    let decodedStr: string;
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      decodedStr = window.atob(base64);
    } else {
      decodedStr = Buffer.from(base64, "base64").toString("utf-8");
    }

    return JSON.parse(decodedStr);
  } catch (e) {
    return null;
  }
}

/**
 * Extracts the user ID from a JWT token's payload.
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  if (!payload) return null;

  // Look for common user ID claim names in microservice JWTs
  const userId = payload.userId || payload.id || payload.sub || payload.uid;
  return userId ? String(userId) : null;
}

export type AppRole = "CONSUMER" | "ORGANIZER" | "ADMIN";

/**
 * Extracts the user role from a JWT token's payload.
 * Falls back to CONSUMER if the claim is missing or unrecognised.
 */
export function getRoleFromToken(token: string): AppRole {
  const payload = decodeJwt(token);
  if (!payload) return "CONSUMER";

  // Common claim names backends use for roles
  const raw: string | undefined =
    payload.role ||
    payload.roles?.[0] ||
    payload.authorities?.[0] ||
    payload.scope;

  if (!raw) return "CONSUMER";
  const normalised = raw.toUpperCase().replace(/^ROLE_/, "");
  if (normalised === "ORGANIZER") return "ORGANIZER";
  if (normalised === "ADMIN" || normalised === "SUPERADMIN" || normalised === "SUPER_ADMIN") return "ADMIN";
  return "CONSUMER";
}
