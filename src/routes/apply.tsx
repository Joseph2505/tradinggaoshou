import { useEffect, useState } from "react";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  PLANS,
  isPlanId,
  monthlyEquivalent,
  type PlanId,
} from "@/lib/plans";
import { isSyntheticAuthEmail, phoneFromAuthEmail } from "@/lib/phone";
import {
  getMyApplication,
  submitApplication,
} from "@/lib/vip-server";
import { toast } from "sonner";

type ApplySearch = { plan?: string };

export const Route = createFileRoute("/apply")({
  validateSearch: (search: Record<string, unknown>): ApplySearch => ({
    plan: typeof search.plan === "string" ? search.plan : undefined,
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { plan: planParam } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const initialPlan: PlanId = isPlanId(planParam ?? "")
    ? (planParam as PlanId)
    : "monthly";

  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [fullName, setFullName] = useState("");
  const [wechatId, setWechatId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [refundOk, setRefundOk] = useState(false);

  useEffect(() => {
    if (isPlanId(planParam ?? "")) setPlanId(planParam as PlanId);
  }, [planParam]);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setLoading(false);
      return;
    }
    setFullName((prev) => prev || user.displayName || "");
    const authPhone = phoneFromAuthEmail(user.primaryEmail);
    setPhone((prev) => prev || authPhone);
    const contactEmail = isSyntheticAuthEmail(user.primaryEmail)
      ? ""
      : user.primaryEmail || "";
    setEmail((prev) => prev || contactEmail);
    let cancelled = false;
    Promise.all([getMyApplication()])
      .then(([app]) => {
        if (cancelled) return;
        if (app) {
          if (app.status === "paid") {
            void navigate({ to: "/account" });
            return;
          }
          setPlanId(isPlanId(app.plan_id) ? app.plan_id : initialPlan);
          setFullName(app.full_name);
          setWechatId(app.wechat_id);
          setPhone(app.phone);
          setEmail(app.email);
          setNote(app.note);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending, navigate, initialPlan]);

  if (isPending) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-5 py-24">
          <div className="h-40 animate-pulse rounded-xl bg-surface" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        search={{ next: `/apply?plan=${planId}` }}
      />
    );
  }

  const selected = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const monthly = monthlyEquivalent(selected);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!refundOk) {
      setError("请先确认付款后概不退款");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await submitApplication({
        data: { planId, fullName, wechatId, phone, email, note },
      });
      toast.success("申请已提交，请完成付款");
      await navigate({ to: "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-16">
        <aside>
          <p className="text-xs tracking-[0.28em] text-champagne-soft uppercase">
            申请入会
          </p>
          <h1 className="mt-3 font-display text-title text-fg">留下联系方式。</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            提交后选择 USDT 或 Whop（Visa / Mastercard / PayPal）。导师确认到账后开通。
          </p>

          <div className="mt-8 space-y-2">
            {PLANS.map((p) => {
              const active = p.id === planId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanId(p.id)}
                  className={
                    "flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left shadow-border transition-[box-shadow,background-color] duration-150 " +
                    (active
                      ? "bg-surface-2 shadow-border-hover"
                      : "bg-surface hover:shadow-border-hover")
                  }
                >
                  <span>
                    <span className="block text-sm text-fg">{p.name}</span>
                    <span className="text-xs text-subtle">{p.lucky}</span>
                  </span>
                  <span className="font-display text-xl text-champagne-soft tabular-nums">
                    ${p.price}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-xl bg-surface p-6 shadow-border md:p-8">
          {loading ? (
            <div className="h-80 animate-pulse rounded-lg bg-surface-2" />
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-fg">{selected.name}</h2>
                <Badge>{selected.lucky}</Badge>
              </div>
              <p className="text-sm text-muted">
                ${selected.price} / {selected.period}
                {monthly ? ` · 约 $${monthly}/月` : ""}
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">姓名</Label>
                  <Input
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="真实姓名"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wechat">微信号</Label>
                  <Input
                    id="wechat"
                    required
                    value={wechatId}
                    onChange={(e) => setWechatId(e.target.value)}
                    placeholder="用于拉群与联系"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">中国手机号</Label>
                  <Input
                    id="phone"
                    required
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="11 位手机号"
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱（选填，QQ 亦可）</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="name@qq.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">备注（选填）</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="交易经验、本金区间、希望解决的问题…"
                  maxLength={500}
                />
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <label className="flex items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={refundOk}
                  onChange={(e) => setRefundOk(e.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-champagne"
                />
                <span>
                  我已知悉：付款后概不退款；内容为教育与社群服务，不构成投资建议；黄金、外汇与加密交易可能亏损本金。
                </span>
              </label>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={busy}
              >
                {busy ? "提交中…" : "提交并去付款"}
              </Button>
              <p className="text-center text-xs text-subtle">
                提交后选 USDT 或 Whop。数字产品一经开通，概不退款。
              </p>
            </form>
          )}
        </section>
      </main>
    </AppShell>
  );
}
