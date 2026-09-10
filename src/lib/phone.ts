export const PHONE_AUTH_DOMAIN = "phone.local";

export function normalizePhone(raw: string) {
  return raw.replace(/[\s-]/g, "").replace(/^\+?86/, "");
}

export function isCnMobile(raw: string) {
  return /^1[3-9]\d{9}$/.test(normalizePhone(raw));
}

export function isLikelyEmail(raw: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

/** Better Auth needs an email. Phone logins use a synthetic address. */
export function toAuthEmail(identifier: string) {
  const trimmed = identifier.trim();
  if (isCnMobile(trimmed)) return `${normalizePhone(trimmed)}@${PHONE_AUTH_DOMAIN}`;
  return trimmed.toLowerCase();
}

export function phoneFromAuthEmail(email: string | null | undefined) {
  if (!email) return "";
  const match = email.toLowerCase().match(/^(1[3-9]\d{9})@phone\.local$/);
  return match ? match[1] : "";
}

export function isSyntheticAuthEmail(email: string | null | undefined) {
  return Boolean(phoneFromAuthEmail(email));
}

export function parseLoginId(raw: string) {
  const trimmed = raw.trim();
  if (isCnMobile(trimmed)) {
    return { ok: true as const, email: toAuthEmail(trimmed), phone: normalizePhone(trimmed) };
  }
  if (isLikelyEmail(trimmed)) {
    return { ok: true as const, email: trimmed.toLowerCase(), phone: "" };
  }
  return { ok: false as const, error: "请填写中国手机号，或 QQ / 163 等邮箱" };
}
