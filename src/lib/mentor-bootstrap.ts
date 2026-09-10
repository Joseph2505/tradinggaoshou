import { hashPassword } from "better-auth/crypto";
import { getSql } from "@/lib/db";

/** Mentor desk login — server-only, never import from client components. */
export const MENTOR_LOGIN = "gaoshou@qq.com";
export const MENTOR_PASSWORD = "JinShi999!";

export async function ensureMentorAccount() {
  const sql = await getSql();
  const email = MENTOR_LOGIN;
  const existing = await sql<{ id: string }>`
    select id from "user" where email = ${email} limit 1
  `;
  let userId = existing[0]?.id;
  if (!userId) {
    userId = crypto.randomUUID();
    const hash = await hashPassword(MENTOR_PASSWORD);
    const accountId = crypto.randomUUID();
    await sql`
      insert into "user" (id, name, email, "emailVerified")
      values (${userId}, 'Trading糕手', ${email}, true)
    `;
    await sql`
      insert into "account"
        (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
      values
        (${accountId}, ${userId}, 'credential', ${userId}, ${hash}, now(), now())
    `;
  }
  await sql`
    insert into admins (user_id) values (${userId})
    on conflict (user_id) do nothing
  `;
  await sql`
    insert into mentor_settings (id, discord_url, updated_by)
    values (
      1,
      'https://discord.gg/rRAVnpF3DU',
      ${userId}
    )
    on conflict (id) do update
      set discord_url = case
        when mentor_settings.discord_url is null or mentor_settings.discord_url = ''
          then excluded.discord_url
        else mentor_settings.discord_url
      end
  `;
  const { WHOP_URLS } = await import("@/lib/plans");
  for (const [planId, url] of Object.entries(WHOP_URLS)) {
    await sql`
      insert into plan_checkouts (plan_id, whop_url, updated_by)
      values (${planId}, ${url}, ${userId})
      on conflict (plan_id) do update
        set whop_url = case
          when plan_checkouts.whop_url is null or plan_checkouts.whop_url = ''
            then excluded.whop_url
          else plan_checkouts.whop_url
        end
    `;
  }
}

export function parseDiscordInvite(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("请填写有效的 Discord 邀请链接");
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const allowed =
    host === "discord.gg" ||
    host === "discord.com" ||
    host === "discordapp.com";
  if (!allowed) throw new Error("只接受 Discord 邀请链接");
  if (host === "discord.com" && !url.pathname.startsWith("/invite/")) {
    throw new Error("请使用 discord.gg 或 discord.com/invite 链接");
  }
  return url.toString();
}
