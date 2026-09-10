import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans-ByifEzY-.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-DcyU7qsV.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var PLAN_IDS = [
	"monthly",
	"halfyear",
	"yearly",
	"lifetime"
];
var PLANS = [
	{
		id: "monthly",
		name: "月卡",
		lucky: "一路发",
		luckyHint: "168",
		price: 168,
		period: "每月",
		months: 1,
		featured: false,
		blurb: "按月跟随实盘、信号与社群。随时开始。"
	},
	{
		id: "halfyear",
		name: "半年卡",
		lucky: "顺又发",
		luckyHint: "688",
		price: 688,
		period: "六个月",
		months: 6,
		featured: false,
		blurb: "相当于每月约 $115，把纪律养成习惯。"
	},
	{
		id: "yearly",
		name: "年卡",
		lucky: "发发发",
		luckyHint: "888",
		price: 888,
		period: "一年",
		months: 12,
		featured: false,
		blurb: "相当于每月 $74。完整走过一轮市场。"
	},
	{
		id: "lifetime",
		name: "终身席位",
		lucky: "长长久久",
		luckyHint: "999",
		price: 999,
		period: "一次",
		months: null,
		featured: true,
		blurb: "十五小时一对一，全年仅二十席。"
	}
];
var SUBSCRIPTION_PERKS = [
	{
		title: "实盘录像与点评",
		body: "我的真实成交会被录下来，并逐笔讲清：为什么进、为什么出、当时看见了什么。"
	},
	{
		title: "每个交易时段都有人",
		body: "不是沉寂的信号群。伦敦、纽约时段，社群里都是在场的交易者。"
	},
	{
		title: "你写，我回",
		body: "会员可直接联系我。不是机器人，也不是助理代回复。"
	},
	{
		title: "每日 1–3 个黄金信号",
		body: "精，不滥。给方向、给理由，执行仍是你自己的事。"
	}
];
var LIFETIME_PERKS = [
	{
		title: "15 小时一对一私教",
		body: "八周，每周两次。复盘你的单、打磨技术、改掉正在亏钱的习惯。"
	},
	{
		title: "每周拆我的交易",
		body: "除了你自己的单，你还会拿到我对当周交易的深度复盘，直接、具体。"
	},
	{
		title: "按你的资金写计划",
		body: "本金不同，风险不同。我会按你的账户与风险偏好，写一份只属于你的行动计划。"
	},
	{
		title: "席位有限，是为了跟得住",
		body: "超过二十人，我就无法认真看每一个人。所以每年只开二十席。"
	}
];
var FAQS = [
	{
		q: "如何付款？",
		a: "申请后页面会显示导师上传的收款二维码（微信 / 支付宝）。二维码会不定期更换。你付款后保留截图，导师确认到账即开通。"
	},
	{
		q: "需要什么基础？",
		a: "有可承受亏损的本金，愿意按纪律执行。不是教你一夜翻倍，是把交易做成可重复的手艺。"
	},
	{
		q: "保证盈利吗？",
		a: "不保证。黄金交易有亏损风险，过往表现不代表未来。会员服务是教育、陪伴与实盘展示，不构成投资建议。"
	},
	{
		q: "用什么语言？",
		a: "全程中文。社群、点评、私教、信号都是普通话。"
	},
	{
		q: "终身席位包含订阅内容吗？",
		a: "包含。实盘录像、社群、直接沟通与每日信号，终身席位都有。另外再加上八周一对一与专属计划。"
	},
	{
		q: "八周之后呢？",
		a: "一对一集中在前八周。之后你仍保留社群、实盘与信号权限。需要加课时，再单独约。"
	}
];
function planById(id) {
	return PLANS.find((p) => p.id === id);
}
function isPlanId(id) {
	return PLAN_IDS.includes(id);
}
function monthlyEquivalent(plan) {
	if (!plan.months || plan.months <= 1) return null;
	return Math.round(plan.price / plan.months);
}
function savingsVsMonthly(plan) {
	if (!plan.months || plan.months <= 1) return null;
	return 168 * plan.months - plan.price;
}
var STATUS_LABEL = {
	pending: "待付款",
	paid: "已开通",
	rejected: "未通过"
};
//#endregion
export { SUBSCRIPTION_PERKS as a, monthlyEquivalent as c, STATUS_LABEL as i, planById as l, LIFETIME_PERKS as n, authMiddleware as o, PLANS as r, isPlanId as s, FAQS as t, savingsVsMonthly as u };
