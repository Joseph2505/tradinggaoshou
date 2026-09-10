export function parseWhopUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("请填写有效的 Whop 链接");
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host !== "whop.com") throw new Error("只接受 whop.com 结账链接");
  if (url.protocol !== "https:") throw new Error("请使用 https 链接");
  return url.toString();
}
