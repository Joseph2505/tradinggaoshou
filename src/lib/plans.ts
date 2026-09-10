export const PLAN_IDS = ["monthly", "halfyear", "yearly", "lifetime"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type Plan = {
  id: PlanId;
  name: string;
  lucky: string;
  luckyHint: string;
  headline: string;
  price: number;
  period: string;
  months: number | null;
  featured: boolean;
  blurb: string;
};

export const LIFETIME_CAP = 20;

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "月卡",
    lucky: "一路发",
    luckyHint: "168",
    headline: "按月做黄金",
    price: 168,
    period: "每月",
    months: 1,
    featured: false,
    blurb: "信号、每日分析、帮你看你的单。随时开始。",
  },
  {
    id: "halfyear",
    name: "半年卡",
    lucky: "顺又发",
    luckyHint: "688",
    headline: "把纪律养成习惯",
    price: 688,
    period: "六个月",
    months: 6,
    featured: false,
    blurb: "相当于每月约 $115。把风险管理做成习惯。",
  },
  {
    id: "yearly",
    name: "年卡",
    lucky: "发发发",
    luckyHint: "888",
    headline: "完整走过一轮金市",
    price: 888,
    period: "一年",
    months: 12,
    featured: false,
    blurb: "相当于每月 $74。目标：成为能管住风险的盈利交易者。",
  },
  {
    id: "lifetime",
    name: "终身席位",
    lucky: "长长久久",
    luckyHint: "999",
    headline: "专属计划 + 陪伴",
    price: 999,
    period: "一次",
    months: null,
    featured: true,
    blurb: "不是网课。按你的情况写计划，陪你把黄金做成能赚钱的手艺。",
  },
];

export const DISCORD_INVITE = "https://discord.gg/rRAVnpF3DU";
export const DISCORD_HANDLE = "tradinggaoshou";
export const BIANFU_ID = "154375295";
export const SUPPORT_HANDLE = "keer0501";

export const WHOP_URLS: Record<PlanId, string> = {
  monthly:
    "https://whop.com/tradinggaoshou/products/65dfbc5e-de1c-4b89-a972-79c52bf991d0/",
  halfyear:
    "https://whop.com/tradinggaoshou/products/6f919675-3a63-4c2d-890f-599c453e014a/",
  yearly:
    "https://whop.com/tradinggaoshou/products/4ecf2972-a499-4829-a18e-1562ae94fed6/",
  lifetime:
    "https://whop.com/tradinggaoshou/products/c5a96db9-8a18-47a7-9271-62eba5b8d0b7/",
};

export const MEMBER_CHECKS = [
  "只做黄金",
  "有机会才给 1–3 个信号，没有就不硬给",
  "每日黄金分析：从哪做、为什么",
  "VIP 有效期内，每笔交易都可复盘",
  "你自己做的单，发给我，我帮你拆",
  "主社群 Discord；没有 VPN 可用蝙蝠",
];

export const LIFETIME_CHECKS = [
  "只做黄金",
  "有机会才给 1–3 个信号，没有就不硬给",
  "每日黄金分析：从哪做、为什么",
  "VIP 有效期内，每笔交易都可复盘",
  "你自己做的单，发给我，我帮你拆",
  "主社群 Discord；没有 VPN 可用蝙蝠",
  "专属风险管理与手数计划：每笔下多少 lot，写清楚",
  "不是课程，是一对一陪伴与加深",
  "已有基础想加深，或有经验但还不稳，或新手陪着学",
  "15 小时一对一：八周，每周两次",
];

export const LIFETIME_PERKS = [
  {
    title: "风险管理与手数计划",
    body: "终身席位多出来的，是一份只属于你的计划：止损、仓位、每笔下多少 lot。按你的本金写死，而不是套一套网课。",
  },
  {
    title: "不是课程，是陪伴",
    body: "没有录播课表。已有知识想加深的、做了几年还不稳的、刚入门需要人带着的，都可以。我陪你学，不替你上课。",
  },
  {
    title: "15 小时一对一",
    body: "八周，每周两次。复盘你的黄金单，把正在亏钱的习惯改掉。",
  },
  {
    title: "目标是活下来，不是全垒打",
    body: "不关心一笔赚了多少。关心 RR、你有没有爆仓、本金还在不在。信号有就给，没有就看每日分析。",
  },
];

export const FAQS = [
  {
    q: "如何加入？",
    a: "两种付法。有 Visa / Mastercard / PayPal：走 Whop，直接跳转到该套餐产品页，付完可在 Whop 进 Discord，不必再联系我们。只有银联、人民币、微信支付或支付宝：先换成 USDT，再联系我们转账——蝙蝠 ID 154375295，Discord Trading糕手 @tradinggaoshou，或 Discord 客服 @keer0501。付款后概不退款。",
  },
  {
    q: "我只有银联 / 微信 / 支付宝，怎么办？",
    a: "先在交易所或钱包把人民币换成 USDT，然后联系导师或客服，按套餐金额转过来。不要自己随便转。网站不显示钱包地址。",
  },
  {
    q: "社群在哪？",
    a: "没有微信群。主社群是 Discord。打不开 Discord、没有 VPN 的，用蝙蝠。VIP 有效期内，每笔交易都可以复盘。",
  },
  {
    q: "有录播课吗？",
    a: "没有。这不是网课。订阅是跟盘、分析、帮你看你的单。终身席位是专属计划与一对一陪伴。",
  },
  {
    q: "每天都有信号吗？",
    a: "不保证。有机会才给 1–3 个黄金信号。没有机会，仍有每日分析：结构、关键位、从哪考虑进场。宁缺毋滥。",
  },
  {
    q: "我自己做的单，你帮看吗？",
    a: "帮。只要还是 VIP，你自己做的黄金单随时发给我，我帮你拆。不看你这一单赚了多少，看 RR、看你有没有把本金保住。",
  },
  {
    q: "做哪些品种？",
    a: "黄金。信号、分析、复盘都围绕黄金。",
  },
  {
    q: "终身席位适合谁？",
    a: "三种人：已有基础想加深；做了一段时间但还不稳、还不盈利；新手——没有课程，但可以陪着你学。多出来的是一份清晰的风险管理与手数计划。",
  },
  {
    q: "保证盈利吗？",
    a: "不保证。交易不是全垒打。我们不关心一笔赚了多少，关心你做了多少 RR、有没有爆仓。先活下来，再谈赚钱。不构成投资建议。",
  },
  {
    q: "用什么语言？",
    a: "全程中文。社群、分析、私教都是普通话。",
  },
  {
    q: "Whop 是什么？",
    a: "有 Visa、Mastercard 或 PayPal 的人用。信用卡和 PayPal 在他们的页面完成，本教室不经手卡号。付完可在 Whop 直接进 Discord。只有银联、微信、支付宝的，请走 USDT。",
  },
  {
    q: "付款后可以退款吗？",
    a: "不可以。数字产品一经开通，概不退款。请在付款前确认套餐。",
  },
];

export function planById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function isPlanId(id: string): id is PlanId {
  return (PLAN_IDS as readonly string[]).includes(id);
}

export function monthlyEquivalent(plan: Plan): number | null {
  if (!plan.months || plan.months <= 1) return null;
  return Math.round(plan.price / plan.months);
}

export function savingsVsMonthly(plan: Plan): number | null {
  if (!plan.months || plan.months <= 1) return null;
  return 168 * plan.months - plan.price;
}

export const STATUS_LABEL: Record<string, string> = {
  pending: "待付款",
  awaiting: "待确认",
  paid: "已开通",
  rejected: "未通过",
};

export const PAY_METHOD_LABEL: Record<string, string> = {
  usdt: "USDT",
  whop: "Whop · 卡 / PayPal",
};

export function displayStatus(app: {
  status: string;
  pay_claimed_at?: string | null;
}) {
  if (app.status === "pending" && app.pay_claimed_at) return "awaiting";
  return app.status;
}
