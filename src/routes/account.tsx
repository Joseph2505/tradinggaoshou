import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PLANS, PAY_METHOD_LABEL, STATUS_LABEL, displayStatus, planById } from "@/lib/plans";
import {
  claimPayment,
  getMyApplication,
  getMyPaymentQr,
  type ApplicationRow,
} from "@/lib/vip-server";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [app, setApp] = useState<ApplicationRow | null | undefined>(undefined);
  const [wechat, setWechat] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [usdtNetwork, setUsdtNetwork] = useState("TRC20");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [whopUrl, setWhopUrl] = useState("");
  const [payTab, setPayTab] = useState<"usdt" | "whop">("whop");

  useEffect(() => {
    if (isPending || !user) return;
    let cancelled = false;
    Promise.all([getMyApplication(), getMyPaymentQr()])
      .then(([a, pay]) => {
        if (cancelled) return;
        setApp(a);
        setWechat(pay.wechat ?? "");
        setDiscordUrl(pay.discordUrl ?? "");
        setUsdtNetwork(pay.usdtNetwork || "TRC20");
        setUsdtAddress(pay.usdtAddress ?? "");
        setWhopUrl(pay.whopUrl ?? "");
        if (pay.usdtAddress && !pay.whopUrl) setPayTab("usdt");
      })
      .catch(() => {
        if (!cancelled) setApp(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending]);

  if (isPending || app === undefined) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-5 py-24">
          <div className="h-64 animate-pulse rounded-xl bg-surface" />
        </div>
      </AppShell>
    );
  }

  if (!user) return <RedirectToSignIn />;

  if (!app) {
    return (
      <AppShell>
        <main className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="font-display text-title text-fg">还没有申请。</h1>
          <p className="mt-3 text-muted">选择一套餐，留下微信与手机，导师会联系你。</p>
          <Button asChild className="mt-8" size="lg">
            <Link to="/apply">去申请</Link>
          </Button>
        </main>
      </AppShell>
    );
  }

  const plan = planById(app.plan_id);
  const shown = displayStatus(app);
  const statusLabel = STATUS_LABEL[shown] ?? app.status;
  const statusVariant =
    shown === "paid" ? "success" : shown === "rejected" ? "danger" : "default";

  return (
    <AppShell>
      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-2 md:px-8 md:py-16">
        <section className="rounded-xl bg-surface p-6 shadow-border md:p-8">
          <p className="text-xs tracking-[0.28em] text-champagne-soft uppercase">
            我的申请
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <h1 className="font-display text-3xl text-fg">{plan?.name ?? app.plan_id}</h1>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
          <p className="mt-2 font-display text-4xl text-champagne-soft tabular-nums">
            ${plan?.price ?? ""}
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            <Row k="姓名" v={app.full_name} />
            <Row k="微信" v={app.wechat_id} />
            <Row k="手机" v={app.phone} />
            <Row k="邮箱" v={app.email} />
            {app.note ? <Row k="备注" v={app.note} /> : null}
          </dl>
          {app.status === "pending" && !app.pay_claimed_at && (
            <Button asChild variant="outline" className="mt-8">
              <Link to="/apply" search={{ plan: app.plan_id }}>
                修改资料
              </Link>
            </Button>
          )}
          {app.status === "paid" && (
            <p className="mt-8 text-sm text-success">
              已开通。右侧进入 Discord，或用微信联系导师。
            </p>
          )}
          {app.status === "rejected" && (
            <p className="mt-8 text-sm text-danger">
              本次申请未通过。如有疑问，请通过微信联系导师。
            </p>
          )}
        </section>

        <section className="rounded-xl bg-surface p-6 shadow-border md:p-8">
          <h2 className="font-display text-2xl text-fg">
            {app.status === "paid" ? "社群入口" : "付款"}
          </h2>
          {app.status === "paid" ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted">会员已开通。下面是社群入口。</p>
              {discordUrl ? (
                <Button asChild size="lg" className="w-full">
                  <a href={discordUrl} target="_blank" rel="noreferrer">
                    进入 Discord 社群
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted">
                  Discord 链接将由导师放入后台。请先加微信。
                </p>
              )}
              {wechat ? (
                <p className="rounded-lg bg-bg-elevated px-4 py-3 text-sm text-fg">
                  导师微信：<span className="font-medium">{wechat}</span>
                </p>
              ) : null}
            </div>
          ) : app.status === "rejected" ? (
            <p className="mt-3 text-sm text-muted">当前申请未通过，暂不收款。</p>
          ) : (
            <PendingPay
              planName={plan?.name ?? ""}
              price={plan?.price ?? 0}
              wechat={wechat}
              usdtNetwork={usdtNetwork}
              usdtAddress={usdtAddress}
              whopUrl={whopUrl}
              payTab={payTab}
              onTab={setPayTab}
              claimed={Boolean(app.pay_claimed_at)}
              payMethod={app.pay_method}
              onClaimed={(next) => setApp(next)}
            />
          )}
          <p className="mt-6 text-xs text-subtle">
            只使用本页展示的最新收款信息。套餐：
            {PLANS.map((p) => p.name).join(" / ")}。付款后概不退款。
          </p>
        </section>
      </main>
    </AppShell>
  );
}

function PendingPay({
  price,
  wechat,
  usdtNetwork,
  usdtAddress,
  whopUrl,
  payTab,
  onTab,
  claimed,
  payMethod,
  onClaimed,
}: {
  planName: string;
  price: number;
  wechat: string;
  usdtNetwork: string;
  usdtAddress: string;
  whopUrl: string;
  payTab: "usdt" | "whop";
  onTab: (t: "usdt" | "whop") => void;
  claimed: boolean;
  payMethod: string;
  onClaimed: (app: ApplicationRow) => void;
}) {
  const [busy, setBusy] = useState(false);
  const hasUsdt = Boolean(usdtAddress);
  const hasWhop = Boolean(whopUrl);
  const tab = payTab === "usdt" && hasUsdt ? "usdt" : hasWhop ? "whop" : hasUsdt ? "usdt" : "whop";

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(usdtAddress);
      toast.success("地址已复制");
    } catch {
      toast.error("复制失败，请长按地址手动复制");
    }
  }

  async function claim(method: "usdt" | "whop") {
    setBusy(true);
    try {
      const next = await claimPayment({ data: { method } });
      onClaimed(next);
      toast.success("已通知导师，请等待确认");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "提交失败");
    } finally {
      setBusy(false);
    }
  }

  if (claimed) {
    return (
      <div className="mt-5 space-y-4">
        <p className="rounded-lg bg-bg-elevated px-4 py-4 text-sm text-fg">
          你已声明付款
          {payMethod ? `（${PAY_METHOD_LABEL[payMethod] ?? payMethod}）` : ""}
          。正在等待导师核对到账，开通后本页会出现 Discord 入口。
        </p>
        {wechat ? (
          <p className="text-sm text-muted">
            导师微信：<span className="font-medium text-fg">{wechat}</span>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-5">
      {(hasUsdt || hasWhop) && (
        <div className="mb-5 flex flex-wrap gap-2">
          {hasWhop ? (
            <Button
              type="button"
              size="sm"
              variant={tab === "whop" ? "default" : "outline"}
              onClick={() => onTab("whop")}
            >
              卡 / PayPal
            </Button>
          ) : null}
          {hasUsdt ? (
            <Button
              type="button"
              size="sm"
              variant={tab === "usdt" ? "default" : "outline"}
              onClick={() => onTab("usdt")}
            >
              USDT
            </Button>
          ) : null}
        </div>
      )}

      {tab === "usdt" && hasUsdt ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            请转入 <span className="font-medium text-fg tabular-nums">${price} USDT</span>
            ，网络必须是 <span className="font-medium text-fg">{usdtNetwork}</span>
            。转错链无法找回。
          </p>
          <div className="rounded-lg bg-bg-elevated px-4 py-3">
            <p className="text-xs text-subtle">{usdtNetwork} 地址</p>
            <p className="mt-1 break-all font-mono text-sm text-fg">{usdtAddress}</p>
          </div>
          <Button type="button" className="w-full" onClick={() => void copyAddress()}>
            <Copy />
            复制地址
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={busy}
            onClick={() => void claim("usdt")}
          >
            {busy ? "提交中…" : "我已完成 USDT 转账"}
          </Button>
        </div>
      ) : hasWhop ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Visa、Mastercard 或 PayPal 在 Whop 安全页面完成。金额 ${price}。付完后回到本页点确认。
          </p>
          <Button asChild size="lg" className="w-full">
            <a href={whopUrl} target="_blank" rel="noreferrer">
              前往 Whop 支付
            </a>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={busy}
            onClick={() => void claim("whop")}
          >
            {busy ? "提交中…" : "我已完成付款"}
          </Button>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted">
          导师正在放入 USDT 地址或 Whop 链接。也可先加微信。
        </p>
      )}

      {wechat ? (
        <p className="mt-6 rounded-lg bg-bg-elevated px-4 py-3 text-sm text-fg">
          导师微信：<span className="font-medium">{wechat}</span>
        </p>
      ) : null}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2">
      <dt className="text-subtle">{k}</dt>
      <dd className="text-right text-fg">{v}</dd>
    </div>
  );
}
