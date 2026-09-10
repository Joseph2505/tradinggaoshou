import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { o as authMiddleware, s as isPlanId } from "./plans-ByifEzY-.mjs";
import { r as getSql } from "./db-COE_TZEs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vip-server-CYym_zyA.js
function normalizePhone(raw) {
	return raw.replace(/[\s-]/g, "").replace(/^\+?86/, "");
}
function validateApplicationInput(input) {
	const fullName = input.fullName.trim();
	const wechatId = input.wechatId.trim();
	const phone = normalizePhone(input.phone);
	const email = input.email.trim().toLowerCase();
	const note = (input.note ?? "").trim();
	if (!isPlanId(input.planId)) throw new Error("请选择有效套餐");
	if (fullName.length < 2 || fullName.length > 40) throw new Error("请填写真实姓名");
	if (wechatId.length < 2 || wechatId.length > 32) throw new Error("请填写微信号");
	if (!/^1[3-9]\d{9}$/.test(phone)) throw new Error("请填写有效的中国手机号");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("请填写有效邮箱");
	if (note.length > 500) throw new Error("备注过长");
	return {
		planId: input.planId,
		fullName,
		wechatId,
		phone,
		email,
		note
	};
}
async function assertAdmin(userId) {
	if (!(await (await getSql())`
    select user_id from admins where user_id = ${userId} limit 1
  `)[0]) {
		const err = /* @__PURE__ */ new Error("没有管理权限");
		err.status = 403;
		throw err;
	}
}
async function lifetimeTaken() {
	return (await (await getSql())`
    select count(*)::int as n
    from applications
    where plan_id = 'lifetime'
      and status in ('pending', 'paid')
      and extract(year from created_at) = extract(year from now())
  `)[0]?.n ?? 0;
}
var getPublicStats_createServerFn_handler = createServerRpc({
	id: "74f6d3961934e041a8cb7607344b754b8cca2541ee3ffadff290a54615e6af1e",
	name: "getPublicStats",
	filename: "src/lib/vip-server.ts"
}, (opts) => getPublicStats.__executeServer(opts));
var getPublicStats = createServerFn({ method: "GET" }).handler(getPublicStats_createServerFn_handler, async () => {
	const taken = await lifetimeTaken();
	return {
		lifetimeCap: 20,
		lifetimeRemaining: Math.max(0, 20 - taken)
	};
});
var getAdminStatus_createServerFn_handler = createServerRpc({
	id: "82b04b6252a0810f31c8e2f8ca2fcea6a8a09a1c51853ea8d4fdfede1db300e0",
	name: "getAdminStatus",
	filename: "src/lib/vip-server.ts"
}, (opts) => getAdminStatus.__executeServer(opts));
var getAdminStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminStatus_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const mine = await sql`
      select user_id from admins where user_id = ${context.userId} limit 1
    `;
	const any = await sql`
      select count(*)::int as n from admins
    `;
	return {
		isAdmin: Boolean(mine[0]),
		canClaim: (any[0]?.n ?? 0) === 0
	};
});
var claimAdmin_createServerFn_handler = createServerRpc({
	id: "42292d99efd8653f6f499f0dae917e4d21ca9f9da0ab46e76227dabddc161470",
	name: "claimAdmin",
	filename: "src/lib/vip-server.ts"
}, (opts) => claimAdmin.__executeServer(opts));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimAdmin_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	if (((await sql`
      select count(*)::int as n from admins
    `)[0]?.n ?? 0) > 0) throw new Error("管理员已存在");
	await sql`insert into admins (user_id) values (${context.userId})`;
	return { ok: true };
});
var getMyApplication_createServerFn_handler = createServerRpc({
	id: "3be4ed831ad73d5ca9a05a5d5ed0113ebac75932c6ddbb1f0245eeb94c3bf24c",
	name: "getMyApplication",
	filename: "src/lib/vip-server.ts"
}, (opts) => getMyApplication.__executeServer(opts));
var getMyApplication = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyApplication_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, user_id, plan_id, full_name, wechat_id, phone, email, note,
             status, admin_note, created_at, updated_at
      from applications
      where user_id = ${context.userId}
      limit 1
    `)[0] ?? null;
});
var submitApplication_createServerFn_handler = createServerRpc({
	id: "fed94e219af53e74ce2def89998730eb6849bb922aa6071de10507cbac509fac",
	name: "submitApplication",
	filename: "src/lib/vip-server.ts"
}, (opts) => submitApplication.__executeServer(opts));
var submitApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => validateApplicationInput(raw)).handler(submitApplication_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const current = (await sql`
      select id, user_id, plan_id, full_name, wechat_id, phone, email, note,
             status, admin_note, created_at, updated_at
      from applications
      where user_id = ${context.userId}
      limit 1
    `)[0];
	if (current && current.status === "paid") throw new Error("会员已开通，如需变更请联系导师");
	if (current && current.status !== "pending") throw new Error("当前申请无法修改");
	if (data.planId === "lifetime") {
		const taken = await lifetimeTaken();
		if (!(current?.plan_id === "lifetime" && current.status === "pending") && taken >= 20) throw new Error("本年终身席位已满");
	}
	if (current) return (await sql`
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
                  status, admin_note, created_at, updated_at
      `)[0];
	return (await sql`
      insert into applications
        (user_id, plan_id, full_name, wechat_id, phone, email, note)
      values
        (${context.userId}, ${data.planId}, ${data.fullName}, ${data.wechatId},
         ${data.phone}, ${data.email}, ${data.note})
      returning id, user_id, plan_id, full_name, wechat_id, phone, email, note,
                status, admin_note, created_at, updated_at
    `)[0];
});
var getMyPaymentQr_createServerFn_handler = createServerRpc({
	id: "9cd1a5a25d12b4a7cb7fb12c5f719818b4acd3ec724d623c5ed6f5bca70784be",
	name: "getMyPaymentQr",
	filename: "src/lib/vip-server.ts"
}, (opts) => getMyPaymentQr.__executeServer(opts));
var getMyPaymentQr = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyPaymentQr_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const app = await sql`
      select plan_id, status from applications where user_id = ${context.userId} limit 1
    `;
	if (!app[0]) return {
		qr: null,
		wechat: ""
	};
	const qr = await sql`
      select plan_id, image_data, updated_at
      from payment_qrs
      where plan_id = ${app[0].plan_id}
      limit 1
    `;
	const settings = await sql`
      select wechat_id from mentor_settings where id = 1
    `;
	return {
		qr: qr[0] ?? null,
		wechat: settings[0]?.wechat_id ?? "",
		planId: app[0].plan_id,
		status: app[0].status
	};
});
var listApplications_createServerFn_handler = createServerRpc({
	id: "af3318f35c0ab1b54b570fe9081a85029a1aeb9f143e2547f9c899e536140b82",
	name: "listApplications",
	filename: "src/lib/vip-server.ts"
}, (opts) => listApplications.__executeServer(opts));
var listApplications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listApplications_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	return (await getSql())`
      select id, user_id, plan_id, full_name, wechat_id, phone, email, note,
             status, admin_note, created_at, updated_at
      from applications
      order by created_at desc
    `;
});
var updateApplicationStatus_createServerFn_handler = createServerRpc({
	id: "7e3cbc1597d20309b7d20ec688bed453280097bf2da02eccc30217d5d9c13448",
	name: "updateApplicationStatus",
	filename: "src/lib/vip-server.ts"
}, (opts) => updateApplicationStatus.__executeServer(opts));
var updateApplicationStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => {
	const data = raw;
	if (!Number.isFinite(data.id)) throw new Error("申请无效");
	if (![
		"pending",
		"paid",
		"rejected"
	].includes(data.status)) throw new Error("状态无效");
	return {
		id: data.id,
		status: data.status,
		adminNote: (data.adminNote ?? "").trim().slice(0, 400)
	};
}).handler(updateApplicationStatus_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	const rows = await (await getSql())`
      update applications
      set status = ${data.status},
          admin_note = ${data.adminNote},
          updated_at = now()
      where id = ${data.id}
      returning id, user_id, plan_id, full_name, wechat_id, phone, email, note,
                status, admin_note, created_at, updated_at
    `;
	if (!rows[0]) throw new Error("申请不存在");
	return rows[0];
});
var listPaymentQrs_createServerFn_handler = createServerRpc({
	id: "7d4613b484e41e0f9f7453f7469369b64d56413cf485399a736e85c99145fb8d",
	name: "listPaymentQrs",
	filename: "src/lib/vip-server.ts"
}, (opts) => listPaymentQrs.__executeServer(opts));
var listPaymentQrs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPaymentQrs_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	return (await getSql())`
      select plan_id, image_data, updated_at from payment_qrs
    `;
});
var uploadPaymentQr_createServerFn_handler = createServerRpc({
	id: "2de89e1220b8041d6c110571d9ad50e3bc64695344547186d9b553fbefdbd37e",
	name: "uploadPaymentQr",
	filename: "src/lib/vip-server.ts"
}, (opts) => uploadPaymentQr.__executeServer(opts));
var uploadPaymentQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => {
	const data = raw;
	if (!isPlanId(data.planId)) throw new Error("套餐无效");
	if (!data.imageData.startsWith("data:image/")) throw new Error("请上传图片文件");
	if (data.imageData.length > 9e5) throw new Error("图片过大，请压缩后再传");
	return {
		planId: data.planId,
		imageData: data.imageData
	};
}).handler(uploadPaymentQr_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	return (await (await getSql())`
      insert into payment_qrs (plan_id, image_data, updated_by)
      values (${data.planId}, ${data.imageData}, ${context.userId})
      on conflict (plan_id) do update
        set image_data = excluded.image_data,
            updated_at = now(),
            updated_by = excluded.updated_by
      returning plan_id, image_data, updated_at
    `)[0];
});
var getMentorWechat_createServerFn_handler = createServerRpc({
	id: "0f0ff0c4779db0934185385a36e8ec89996942733393d25a1ecec52f0a4a1abd",
	name: "getMentorWechat",
	filename: "src/lib/vip-server.ts"
}, (opts) => getMentorWechat.__executeServer(opts));
var getMentorWechat = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMentorWechat_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	return { wechatId: (await (await getSql())`
      select wechat_id from mentor_settings where id = 1
    `)[0]?.wechat_id ?? "" };
});
var updateMentorWechat_createServerFn_handler = createServerRpc({
	id: "32190cbcc3922857f90dbc139e0869b5c8942a80dbf0cc32e846418a3e6a40c9",
	name: "updateMentorWechat",
	filename: "src/lib/vip-server.ts"
}, (opts) => updateMentorWechat.__executeServer(opts));
var updateMentorWechat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => {
	const wechatId = String(raw.wechatId ?? "").trim();
	if (wechatId.length > 32) throw new Error("微信号过长");
	return { wechatId };
}).handler(updateMentorWechat_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	await (await getSql())`
      insert into mentor_settings (id, wechat_id, updated_by)
      values (1, ${data.wechatId}, ${context.userId})
      on conflict (id) do update
        set wechat_id = excluded.wechat_id,
            updated_at = now(),
            updated_by = excluded.updated_by
    `;
	return { wechatId: data.wechatId };
});
//#endregion
export { claimAdmin_createServerFn_handler, getAdminStatus_createServerFn_handler, getMentorWechat_createServerFn_handler, getMyApplication_createServerFn_handler, getMyPaymentQr_createServerFn_handler, getPublicStats_createServerFn_handler, listApplications_createServerFn_handler, listPaymentQrs_createServerFn_handler, submitApplication_createServerFn_handler, updateApplicationStatus_createServerFn_handler, updateMentorWechat_createServerFn_handler, uploadPaymentQr_createServerFn_handler };
