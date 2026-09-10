import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Copy,
  GraduationCap,
  Landmark,
  LineChart,
  MapPin,
  Shield,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  FAQS,
  DISCORD_INVITE,
  DISCORD_HANDLE,
  BIANFU_ID,
  SUPPORT_HANDLE,
  LIFETIME_CHECKS,
  LIFETIME_PERKS,
  MEMBER_CHECKS,
  PLANS,
  WHOP_URLS,
  isPlanId,
  monthlyEquivalent,
  savingsVsMonthly,
  type Plan,
  type PlanId,
} from "@/lib/plans";
import { getPublicStats } from "@/lib/vip-server";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [discordUrl, setDiscordUrl] = useState(DISCORD_INVITE);
  const [whops, setWhops] = useState<Record<string, string>>({});

  useEffect(() => {
    getPublicStats()
      .then((s) => {
        if (s.discordUrl) setDiscordUrl(s.discordUrl);
        setWhops(s.whops ?? {});
      })
      .catch(() => {});
  }, []);

  return (
    <AppShell>
      <Hero />
      <Stats />
      <Plans />
      <Mentor />
      <Risk />
      <Lifetime />
      <Process />
      <Faq />
      <Contact discordUrl={discordUrl} whops={whops} />
      <Closing />
    </AppShell>
  );
}

function JoinLink({
  children,
  href = "#contact",
  variant = "default",
  size = "lg",
  className,
}: {
  children: ReactNode;
  href?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "lg" | "default";
  className?: string;
}) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={href}>
        {children}
        <ArrowRight />
      </a>
    </Button>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <img
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/35" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20">
        <p className="reveal text-xs tracking-[0.28em] text-champagne uppercase">
          黄金实盘
        </p>
        <h1 className="reveal mt-5 font-display text-display text-fg">
          Trading糕手
        </h1>
        <p className="reveal mt-5 max-w-xl text-lead text-fg/90">
          三年专职交易，两年半稳定盈利。
          <br className="hidden sm:block" />
          目标：让你成为能管住风险的盈利交易者。
        </p>
        <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <JoinLink href="#plans">查看套餐</JoinLink>
          <Button asChild variant="outline" size="lg">
            <a href="#mentor">认识导师</a>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-4">
          {PLANS.map((p) => (
            <a
              key={p.id}
              href={`#pay-${p.id}`}
              className="bg-bg/80 px-4 py-4 backdrop-blur-sm transition-colors duration-150 hover:bg-surface"
            >
              <p className="font-display text-2xl text-champagne-soft tabular-nums">
                ${p.price}
              </p>
              <p className="mt-1 text-xs text-muted">
                {p.name} · {p.lucky}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { k: "3 年", v: "专职交易" },
    { k: "2.5 年", v: "持续稳定盈利" },
    { k: "黄金", v: "只做这一品种" },
    { k: "风险优先", v: "先活下来再赚钱" },
  ];
  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.v}
            className={
              "px-5 py-8 md:px-8 " +
              (i < items.length - 1 ? "md:border-r md:border-border" : "")
            }
          >
            <p className="font-display text-2xl text-fg md:text-3xl">{it.k}</p>
            <p className="mt-1 text-sm text-muted">{it.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const monthly = monthlyEquivalent(plan);
  const saved = savingsVsMonthly(plan);
  const checks = plan.id === "lifetime" ? LIFETIME_CHECKS : MEMBER_CHECKS;
  const compare =
    plan.months && plan.months > 1 ? 168 * plan.months : null;

  return (
    <article
      className={
        "relative flex h-full flex-col rounded-2xl bg-surface p-6 shadow-border md:p-8 " +
        (plan.id === "lifetime"
          ? "ring-2 ring-champagne md:p-9"
          : plan.featured
            ? "ring-1 ring-champagne/50"
            : "")
      }
    >
      {plan.id === "lifetime" ? (
        <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-champagne px-3 py-1 text-xs font-medium text-champagne-fg">
          最受欢迎
        </p>
      ) : null}

      <h3 className="font-display text-3xl leading-tight text-fg md:text-4xl">
        {plan.name} · {plan.lucky}
      </h3>
      <p className="mt-2 text-sm text-muted md:text-base">{plan.headline}</p>

      <div className="mt-6">
        {compare ? (
          <p className="text-sm text-subtle line-through tabular-nums">${compare}</p>
        ) : null}
        <p
          className={
            "font-display leading-none text-fg tabular-nums " +
            (plan.id === "lifetime" ? "text-6xl md:text-7xl" : "text-5xl")
          }
        >
          ${plan.price}
        </p>
        <p className="mt-2 text-sm text-subtle">{plan.period}</p>
        {plan.id === "lifetime" ? (
          <p className="mt-1 text-sm text-champagne">一次付清 · 专属计划与陪伴</p>
        ) : (
          <p className="mt-1 text-sm text-champagne">
            随时开始，不限名额
            {monthly
              ? ` · 相当于每月 $${monthly}${saved && saved > 0 ? ` · 省 $${saved}` : ""}`
              : ""}
          </p>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-2.5">
        {checks.map((line) => (
          <li key={line} className="flex gap-2 text-sm text-fg">
            <Check className="mt-0.5 size-4 shrink-0 text-champagne" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3">
        <Button asChild variant={plan.id === "lifetime" ? "default" : "secondary"} className="w-full" size="lg">
          <a href={WHOP_URLS[plan.id]} target="_blank" rel="noreferrer">
            去 Whop 付款
            <ArrowRight />
          </a>
        </Button>
        <a
          href={`#pay-${plan.id}`}
          className="text-center text-sm text-muted hover:text-fg"
        >
          用 USDT？银联 / 微信 / 支付宝先换成 USDT，再联系我们
        </a>
      </div>
    </article>
  );
}

function Plans() {
  const compact = PLANS.filter((p) => p.id === "monthly" || p.id === "halfyear");
  const highlight = PLANS.filter((p) => p.id === "yearly" || p.id === "lifetime");
  return (
    <section id="plans" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs tracking-[0.28em] text-champagne uppercase">
          一次加入
        </p>
        <h2 className="mt-3 text-center font-display text-title text-fg">
          权限清楚。付一次，按档进来。
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted">
          168 一路发，688 顺又发，888 发发发，999 长长久久。
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {compact.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {highlight.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-subtle">
          银联、微信、支付宝 → 换成 USDT 再联系我们　·　Visa / Mastercard / PayPal → Whop　·　付款后概不退款
        </p>
      </div>
    </section>
  );
}

function Mentor() {
  return (
    <section id="mentor" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <img
            src="/images/city.jpg"
            alt="现居中国的窗景"
            className="frame aspect-video w-full rounded-xl object-cover"
          />
        </div>
        <div>
          <p className="text-xs tracking-[0.28em] text-champagne-soft uppercase">
            导师
          </p>
          <h2 className="mt-3 font-display text-title text-fg">
            法国出生，中文授课。
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            我在法国出生，一直在法国读书、工作，后来学了中文。毕业于巴黎
            EFREI，数据工程与金融人工智能硕士。曾在瑞士银行任职，也在威立雅做过人工智能工程师。
          </p>
          <p className="mt-3 text-muted leading-relaxed">
            三年前离开机构，专职交易。两年半稳定盈利。做外汇，现在更专注黄金。旅居过不同国家之后，我决定在中国定居，用中文带学员。
          </p>
          <ul className="mt-6 space-y-3 text-sm text-fg">
            <li className="flex items-center gap-2">
              <GraduationCap className="size-4 text-champagne" />
              巴黎 EFREI · 数据工程与金融人工智能硕士
            </li>
            <li className="flex items-center gap-2">
              <Landmark className="size-4 text-champagne" />
              瑞士银行 · 威立雅人工智能工程师
            </li>
            <li className="flex items-center gap-2">
              <LineChart className="size-4 text-champagne" />
              三年专职 · 两年半稳定盈利 · 只做黄金
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-champagne" />
              现居中国 · 中文授课
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Risk() {
  return (
    <section className="border-y border-border bg-bg-elevated px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Shield className="mx-auto size-6 text-champagne" />
        <p className="mt-4 text-xs tracking-[0.28em] text-champagne-soft uppercase">
          风险管理
        </p>
        <h2 className="mt-3 font-display text-title text-fg">先活下来，再谈赚钱。</h2>
        <p className="mt-5 text-muted leading-relaxed">
          交易不是全垒打，不是一笔把钱赚完。我们不关心你这一单赚了多少——关心的是你做了多少
          RR，你怎么做到没爆仓、把本金保住。永远不要把全部资金押上去。每一笔先问三件事：止损在哪、手数多大、最坏能亏多少。信号只给方向和理由，执行是你的。你自己做的单，随时发给我，我帮你拆。
        </p>
      </div>
    </section>
  );
}

function Lifetime() {
  return (
    <section
      id="lifetime"
      className="scroll-mt-20 border-y border-border bg-bg-elevated px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs tracking-[0.28em] text-champagne-soft uppercase">
            $999 · 长长久久
          </p>
          <h2 className="mt-3 font-display text-title text-fg">
            终身席位，不是一门课。
          </h2>
          <p className="mt-4 text-muted">
            没有录播课表。多出来的是一份清晰的风险管理与手数计划。已有基础想加深、有经验但还不盈利、或新手需要人带着，都可以。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {LIFETIME_PERKS.map((perk) => (
              <div key={perk.title} className="rounded-lg bg-surface p-5 shadow-border">
                <h3 className="font-display text-lg text-fg">{perk.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{perk.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href={WHOP_URLS.lifetime} target="_blank" rel="noreferrer">
                去 Whop 付款 · $999
                <ArrowRight />
              </a>
            </Button>
            <p className="text-sm text-subtle">含全部订阅权益，一次付清。</p>
          </div>
        </div>
        <img
          src="/images/mentor.jpg"
          alt="一对一复盘"
          className="frame aspect-video w-full rounded-xl object-cover"
        />
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "选套餐", d: "月卡、半年、年卡或终身席位。数字即口彩。" },
    { n: "02", t: "USDT 或 Whop", d: "有 Visa / Mastercard / PayPal 走 Whop。只有银联、微信、支付宝的，换成 USDT 后联系我们。" },
    { n: "03", t: "进 Discord", d: "随时可进。主社群是 Discord。没有 VPN 用蝙蝠。" },
    { n: "04", t: "开通权益", d: "确认到账后，VIP 有效期内每笔都可复盘。" },
  ];
  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs tracking-[0.28em] text-champagne-soft uppercase">
          流程
        </p>
        <h2 className="mt-3 font-display text-title text-fg">四步，没有中间商。</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="font-display text-3xl text-champagne/70">{s.n}</p>
              <h3 className="mt-3 font-display text-xl text-fg">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs tracking-[0.28em] text-champagne-soft uppercase">FAQ</p>
          <h2 className="mt-3 font-display text-title text-fg">先把话说清楚。</h2>
        </div>
        <div className="divide-y divide-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-fg">
                {item.q}
                <span className="text-subtle transition-transform duration-150 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({
  discordUrl,
  whops,
}: {
  discordUrl: string;
  whops: Record<string, string>;
}) {
  const [planId, setPlanId] = useState<PlanId>("yearly");
  const [tab, setTab] = useState<"usdt" | "whop" | null>(null);
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[2];
  const whopUrl = whops[plan.id] || WHOP_URLS[plan.id];

  useEffect(() => {
    function applyHash() {
      const raw = window.location.hash.replace(/^#/, "");
      const id = raw.startsWith("pay-") ? raw.slice(4) : "";
      if (isPlanId(id)) {
        setPlanId(id);
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  async function copyText(value: string, ok: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(ok);
    } catch {
      toast.error("复制失败，请手动复制");
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-xl rounded-2xl bg-surface p-8 shadow-border md:p-12">
        <p className="text-center text-xs tracking-[0.28em] text-champagne-soft uppercase">
          付款
        </p>
        <h2 className="mt-3 text-center font-display text-title text-fg">
          选套餐，再选怎么付。
        </h2>
        <p className="mt-4 text-center text-muted">
          有 Visa / Mastercard / PayPal：走 Whop，付完可直接进 Discord。
          只有银联、人民币、微信支付、支付宝：先换成 USDT，再联系我们。
        </p>

        <div className="mt-8 grid grid-cols-2 gap-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPlanId(p.id);
                setTab(null);
              }}
              className={
                "rounded-lg px-3 py-3 text-left text-sm shadow-border " +
                (planId === p.id ? "bg-surface-2" : "bg-bg-elevated")
              }
            >
              <span className="block font-display text-base text-fg">
                {p.name} · {p.lucky}
              </span>
              <span className="font-display text-lg tabular-nums text-champagne">
                ${p.price}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            size="lg"
            variant={tab === "usdt" ? "default" : "outline"}
            onClick={() => setTab("usdt")}
          >
            USDT
          </Button>
          {whopUrl ? (
            <Button asChild size="lg">
              <a href={whopUrl} target="_blank" rel="noreferrer">
                去 Whop 付款
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              variant={tab === "whop" ? "default" : "outline"}
              onClick={() => setTab("whop")}
            >
              Whop
            </Button>
          )}
        </div>

        {tab === "usdt" ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-relaxed text-muted">
              只有银联、微信、支付宝？先换成 USDT，再联系我们付 {plan.name}{" "}
              <span className="font-medium text-fg tabular-nums">${plan.price}</span>
              。不要自己转。我们会告诉你怎么付。
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => void copyText(BIANFU_ID, "蝙蝠 ID 已复制")}
                className="flex w-full items-center justify-between rounded-lg bg-bg-elevated px-4 py-3 text-left shadow-border"
              >
                <span>
                  <span className="block text-xs text-subtle">蝙蝠 ID</span>
                  <span className="font-mono text-fg">{BIANFU_ID}</span>
                </span>
                <Copy className="size-4 text-champagne" />
              </button>
              <button
                type="button"
                onClick={() => void copyText(DISCORD_HANDLE, "Discord 已复制")}
                className="flex w-full items-center justify-between rounded-lg bg-bg-elevated px-4 py-3 text-left shadow-border"
              >
                <span>
                  <span className="block text-xs text-subtle">Discord · Trading糕手</span>
                  <span className="text-fg">@{DISCORD_HANDLE}</span>
                </span>
                <Copy className="size-4 text-champagne" />
              </button>
              <button
                type="button"
                onClick={() => void copyText(SUPPORT_HANDLE, "客服已复制")}
                className="flex w-full items-center justify-between rounded-lg bg-bg-elevated px-4 py-3 text-left shadow-border"
              >
                <span>
                  <span className="block text-xs text-subtle">Discord 客服</span>
                  <span className="text-fg">@{SUPPORT_HANDLE}</span>
                </span>
                <Copy className="size-4 text-champagne" />
              </button>
            </div>
          </div>
        ) : null}

        {tab === "whop" && !whopUrl ? (
          <p className="mt-6 text-sm text-subtle">
            Whop 链接稍后显示。
          </p>
        ) : null}

        <Button asChild variant="outline" className="mt-6 w-full">
          <a href={discordUrl} target="_blank" rel="noreferrer">
            加入 Discord 主社群
          </a>
        </Button>
        <p className="mt-3 text-center text-xs text-subtle">
          没付钱也可以先进 Discord。付款后概不退款。
        </p>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="/images/desk.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-bg/80" />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:px-8 md:py-32">
        <h2 className="font-display text-title text-fg">先管风险，再谈盈利。</h2>
        <p className="mt-4 text-muted">
          自己做的单，发给我，我帮你拆。不看一把赚多少，看 RR，看你有没有活下来。
        </p>
        <div className="mt-8 flex justify-center">
          <JoinLink>去付款</JoinLink>
        </div>
      </div>
    </section>
  );
}
