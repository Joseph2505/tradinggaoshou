/**
 * Whop (Cloudflare Workers) serves the already-published GitHub Pages site.
 * The React server crashes there because it needs a database the worker cannot
 * open. This entry only forwards each request to the static site.
 */
const SITE = "https://joseph2505.github.io/tradinggaoshou";

async function mirror(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const incoming = new URL(request.url);
  const path = incoming.pathname.startsWith("/") ? incoming.pathname : `/${incoming.pathname}`;
  const target = new URL(`${SITE}${path}${incoming.search}`);
  const upstream = await fetch(target, {
    method: request.method,
    redirect: "follow",
    headers: { accept: request.headers.get("accept") ?? "*/*" },
  });
  const headers = new Headers(upstream.headers);
  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("x-frame-options");
  headers.set("cache-control", "public, max-age=120");
  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export function createServerEntry(entry: { fetch: typeof mirror }) {
  return { fetch: (...args: Parameters<typeof mirror>) => entry.fetch(...args) };
}

export default { fetch: mirror };
