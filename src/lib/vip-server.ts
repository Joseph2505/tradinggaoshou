import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { isPlanId, LIFETIME_CAP, type PlanId } from "@/lib/plans";
import { isSyntheticAuthEmail, normalizePhone } from "@/lib/phone";
import { parseUsdtSettings } from "@/lib/usdt";

export type ApplicationRow = {
  id: number;
  user_id: string;
  plan_id: string;
  full_name: string;
  wechat_id: string;
  phone: string;
  email: string;
  note: string;
  status: string;
  admin_note: string;
  pay_method: string;
  pay_claimed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentQrRow = {
  plan_id: string;
  image_data: string;
  updated_at: string;
};

function validateApplicationInput(input: {
  planId: string;
  fullName: string;
  wechatId: string;
  phone: string;
  email: string;
  note?: string;
}) {
  const fullName = input.fullName.trim();
  const wechatId = input.wechatId.trim();
  const phone = normalizePhone(input.phone);
  let email = input.email.trim().toLowerCase();
  const note = (input.note ?? "").trim();

  if (!isPlanId(input.planId)) throw new Error("请选择有效套餐");
  if (fullName.length < 2 || fullName.length > 40) {
    throw new Error("请填写真实姓名");
  }
  if (wechatId.length < 2 || wechatId.length > 32) {
    throw new Error("请填写微信号");
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    throw new Error("请填写有效的中国手机号");
  }
  if (isSyntheticAuthEmail(email)) email = "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("请填写有效邮箱（QQ / 163 均可），或留空");
  }
  if (note.length > 500) throw new Error("备注过长");

  return {
    planId: input.planId as PlanId,
    fullName,
    wechatId,
    phone,
    email,
    note,
  };
}

async function assertAdmin(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    select user_id from admins where user_id = ${userId} limit 1
  `;
  if (!rows[0]) {
    const err = new Error("没有管理权限");
    (err as Error & { status?: number }).status = 403;
    throw err;
  }
}

async function lifetimeTaken(): Promise<number> {
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select count(*)::int as n
    from applications
    where plan_id = 'lifetime'
      and status in ('pending', 'paid')
      and extract(year from created_at) = extract(year from now())
  `;
  return rows[0]?.n ?? 0;
}

export const getPublicStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const { ensureMentorAccount } = await import("@/lib/mentor-bootstrap");
    await ensureMentorAccount();
    const sql = await getSql();
    const taken = await lifetimeTaken();
    const settings = await sql<{
      discord_url: string;
      usdt_network: string;
      usdt_address: string;
    }>`
      select discord_url, usdt_network, usdt_address
      from mentor_settings where id = 1
    `;
    const checkouts = await sql<{ plan_id: string; whop_url: string }>`
      select plan_id, whop_url from plan_checkouts
    `;
    const { DISCORD_INVITE, WHOP_URLS } = await import("@/lib/plans");
    const whops: Record<string, string> = { ...WHOP_URLS };
    for (const row of checkouts) {
      if (row.whop_url) whops[row.plan_id] = row.whop_url;
    }
    return {
      lifetimeCap: LIFETIME_CAP,
      lifetimeRemaining: Math.max(0, LIFETIME_CAP - taken),
      discordUrl: settings[0]?.discord_url || DISCORD_INVITE,
      usdtNetwork: settings[0]?.usdt_network || "TRC20",
      usdtAddress: "",
      whops,
    };
  },
);

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const mine = await sql<{ user_id: string }>`
      select user_id from admins where user_id = ${context.userId} limit 1
    `;
    const any = await sql<{ n: number }>`
      select count(*)::int as n from admins
    `;
    return {
      isAdmin: Boolean(mine[0]),
      canClaim: (any[0]?.n ?? 0) === 0,
    };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const any = await sql<{ n: number }>`
      select count(*)::int as n from admins
    `;
    if ((any[0]?.n ?? 0) > 0) {
      throw new Error("管理员已存在");
    }
    await sql`insert into admins (user_id) values (${context.userId})`;
    return { ok: true as const };
  });

export const getMyApplication = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ApplicationRow>`
      select id, user_id, plan_id, full_name, wechat_id, phone, email, note,
             status, admin_note, pay_method, pay_claimed_at, created_at, updated_at
      from applications
      where user_id = ${context.userId}
      limit 1
    `;
    return rows[0] ?? null;
  });

export const submitApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) =>
    validateApplicationInput(raw as Parameters<typeof validateApplicationInput>[0]),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<ApplicationRow>`
      select id, user_id, plan_id, full_name, wechat_id, phone, email, note,
             status, admin_note, pay_method, pay_claimed_at, created_at, updated_at
      from applications
      where user_id = ${context.userId}
      limit 1
    `;
    const current = existing[0];

    if (current && current.status === "paid") {
      throw new Error("会员已开通，如需变更请联系导师");
    }
    if (current && current.status !== "pending") {
      throw new Error("当前申请无法修改");
    }

    if (current) {
      const rows = await sql<ApplicationRow>`
        update applications
        set plan_id = ${data.planId},
            full_name = ${data.fullName},
            wechat_id = ${data.wechatId},
            phone = ${data.phone},
            email = ${data.email},
            note = ${data.note},
            updated_at = now()
        where user_id = ${context.userId} and status = 'pending'
        returning id, user_id, plan_id, full_name, wechat_id, phone, email, note,
                  status, admin_note, pay_method, pay_claimed_at, created_at, updated_at
      `;
      return rows[0];
    }

    const rows = await sql<ApplicationRow>`
      insert into applications
        (user_id, plan_id, full_name, wechat_id, phone, email, note)
      values
        (${context.userId}, ${data.planId}, ${data.fullName}, ${data.wechatId},
         ${data.phone}, ${data.email}, ${data.note})
      returning id, user_id, plan_id, full_name, wechat_id, phone, email, note,
                status, admin_note, pay_method, pay_claimed_at, created_at, updated_at
    `;
    return rows[0];
  });

export const getMyPaymentQr = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const app = await sql<{
      plan_id: string;
      status: string;
      pay_method: string;
      pay_claimed_at: string | null;
    }>`
      select plan_id, status, pay_method, pay_claimed_at
      from applications where user_id = ${context.userId} limit 1
    `;
    if (!app[0]) {
      return {
        qr: null as PaymentQrRow | null,
        wechat: "",
        discordUrl: "",
        usdtNetwork: "TRC20",
        usdtAddress: "",
        whopUrl: "",
        payMethod: "",
        payClaimedAt: null as string | null,
      };
    }
    const qr = await sql<PaymentQrRow>`
      select plan_id, image_data, updated_at
      from payment_qrs
      where plan_id = ${app[0].plan_id}
      limit 1
    `;
    const settings = await sql<{
      wechat_id: string;
      discord_url: string;
      usdt_network: string;
      usdt_address: string;
    }>`
      select wechat_id, discord_url, usdt_network, usdt_address
      from mentor_settings where id = 1
    `;
    const checkout = await sql<{ whop_url: string }>`
      select whop_url from plan_checkouts where plan_id = ${app[0].plan_id} limit 1
    `;
    const paid = app[0].status === "paid";
    return {
      qr: qr[0] ?? null,
      wechat: settings[0]?.wechat_id ?? "",
      discordUrl: paid ? (settings[0]?.discord_url ?? "") : "",
      usdtNetwork: settings[0]?.usdt_network || "TRC20",
      usdtAddress: paid ? "" : (settings[0]?.usdt_address ?? ""),
      whopUrl: paid ? "" : (checkout[0]?.whop_url ?? ""),
      payMethod: app[0].pay_method ?? "",
      payClaimedAt: app[0].pay_claimed_at,
      planId: app[0].plan_id,
      status: app[0].status,
    };
  });

export const listApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    return sql<ApplicationRow>`
      select id, user_id, plan_id, full_name, wechat_id, phone, email, note,
             status, admin_note, pay_method, pay_claimed_at, created_at, updated_at
      from applications
      order by created_at desc
    `;
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => {
    const data = raw as { id: number; status: string; adminNote?: string };
    if (!Number.isFinite(data.id)) throw new Error("申请无效");
    if (!["pending", "paid", "rejected"].includes(data.status)) {
      throw new Error("状态无效");
    }
    return {
      id: data.id,
      status: data.status,
      adminNote: (data.adminNote ?? "").trim().slice(0, 400),
    };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<ApplicationRow>`
      update applications
      set status = ${data.status},
          admin_note = ${data.adminNote},
          updated_at = now()
      where id = ${data.id}
      returning id, user_id, plan_id, full_name, wechat_id, phone, email, note,
                status, admin_note, pay_method, pay_claimed_at, created_at, updated_at
    `;
    if (!rows[0]) throw new Error("申请不存在");
    return rows[0];
  });

export const listPaymentQrs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    return sql<PaymentQrRow>`
      select plan_id, image_data, updated_at from payment_qrs
    `;
  });

export const uploadPaymentQr = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => {
    const data = raw as { planId: string; imageData: string };
    if (!isPlanId(data.planId)) throw new Error("套餐无效");
    if (!data.imageData.startsWith("data:image/")) {
      throw new Error("请上传图片文件");
    }
    if (data.imageData.length > 900_000) {
      throw new Error("图片过大，请压缩后再传");
    }
    return { planId: data.planId as PlanId, imageData: data.imageData };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<PaymentQrRow>`
      insert into payment_qrs (plan_id, image_data, updated_by)
      values (${data.planId}, ${data.imageData}, ${context.userId})
      on conflict (plan_id) do update
        set image_data = excluded.image_data,
            updated_at = now(),
            updated_by = excluded.updated_by
      returning plan_id, image_data, updated_at
    `;
    return rows[0];
  });

export const getMentorWechat = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      wechat_id: string;
      discord_url: string;
      usdt_network: string;
      usdt_address: string;
    }>`
      select wechat_id, discord_url, usdt_network, usdt_address
      from mentor_settings where id = 1
    `;
    return {
      wechatId: rows[0]?.wechat_id ?? "",
      discordUrl: rows[0]?.discord_url ?? "",
      usdtNetwork: rows[0]?.usdt_network || "TRC20",
      usdtAddress: rows[0]?.usdt_address ?? "",
    };
  });

export const updateMentorWechat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => {
    const wechatId = String((raw as { wechatId?: string }).wechatId ?? "").trim();
    if (wechatId.length > 32) throw new Error("微信号过长");
    return { wechatId };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    await sql`
      insert into mentor_settings (id, wechat_id, updated_by)
      values (1, ${data.wechatId}, ${context.userId})
      on conflict (id) do update
        set wechat_id = excluded.wechat_id,
            updated_at = now(),
            updated_by = excluded.updated_by
    `;
    return { wechatId: data.wechatId };
  });

export const updateMentorDiscord = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => {
    const discordUrl = String((raw as { discordUrl?: string }).discordUrl ?? "");
    return { discordUrl };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { parseDiscordInvite } = await import("@/lib/mentor-bootstrap");
    const discordUrl = parseDiscordInvite(data.discordUrl);
    const sql = await getSql();
    await sql`
      insert into mentor_settings (id, discord_url, updated_by)
      values (1, ${discordUrl}, ${context.userId})
      on conflict (id) do update
        set discord_url = excluded.discord_url,
            updated_at = now(),
            updated_by = excluded.updated_by
    `;
    return { discordUrl };
  });

export const updateMentorUsdt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => {
    return parseUsdtSettings(raw as { network?: string; address?: string });
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    await sql`
      insert into mentor_settings (id, usdt_network, usdt_address, updated_by)
      values (1, ${data.network}, ${data.address}, ${context.userId})
      on conflict (id) do update
        set usdt_network = excluded.usdt_network,
            usdt_address = excluded.usdt_address,
            updated_at = now(),
            updated_by = excluded.updated_by
    `;
    return { network: data.network, address: data.address };
  });

export const claimPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => {
    const method = String((raw as { method?: string }).method ?? "");
    if (method !== "usdt" && method !== "whop") {
      throw new Error("请选择 USDT 或信用卡支付");
    }
    return { method: method as "usdt" | "whop" };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<ApplicationRow>`
      update applications
      set pay_method = ${data.method},
          pay_claimed_at = now(),
          updated_at = now()
      where user_id = ${context.userId} and status = 'pending'
      returning id, user_id, plan_id, full_name, wechat_id, phone, email, note,
                status, admin_note, pay_method, pay_claimed_at, created_at, updated_at
    `;
    if (!rows[0]) throw new Error("没有待付款的申请");
    return rows[0];
  });

export const listPlanCheckouts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    return sql<{ plan_id: string; whop_url: string }>`
      select plan_id, whop_url from plan_checkouts
    `;
  });

export const updatePlanWhop = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => {
    const planId = String((raw as { planId?: string }).planId ?? "");
    const whopUrl = String((raw as { whopUrl?: string }).whopUrl ?? "");
    if (!isPlanId(planId)) throw new Error("套餐无效");
    return { planId: planId as PlanId, whopUrl };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { parseWhopUrl } = await import("@/lib/whop");
    const whopUrl = parseWhopUrl(data.whopUrl);
    const sql = await getSql();
    await sql`
      insert into plan_checkouts (plan_id, whop_url, updated_by)
      values (${data.planId}, ${whopUrl}, ${context.userId})
      on conflict (plan_id) do update
        set whop_url = excluded.whop_url,
            updated_at = now(),
            updated_by = excluded.updated_by
    `;
    return { planId: data.planId, whopUrl };
  });
