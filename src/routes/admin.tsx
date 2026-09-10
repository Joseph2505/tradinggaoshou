import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PAY_METHOD_LABEL, PLANS, STATUS_LABEL, displayStatus, planById } from "@/lib/plans";
import { USDT_NETWORKS, type UsdtNetwork } from "@/lib/usdt";
import {
  claimAdmin,
  getAdminStatus,
  getMentorWechat,
  listApplications,
  listPaymentQrs,
  listPlanCheckouts,
  updateApplicationStatus,
  updateMentorDiscord,
  updateMentorUsdt,
  updateMentorWechat,
  updatePlanWhop,
  uploadPaymentQr,
  type ApplicationRow,
  type PaymentQrRow,
} from "@/lib/vip-server";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [tab, setTab] = useState<"apps" | "qr">("apps");
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [qrs, setQrs] = useState<PaymentQrRow[]>([]);
  const [wechat, setWechat] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [usdtNetwork, setUsdtNetwork] = useState<UsdtNetwork>("TRC20");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [whops, setWhops] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("all");
  const [claiming, setClaiming] = useState(false);

  const refresh = useCallback(async () => {
    const [list, codes, settings, checkouts] = await Promise.all([
      listApplications(),
      listPaymentQrs(),
      getMentorWechat(),
      listPlanCheckouts(),
    ]);
    setApps(list);
    setQrs(codes);
    setWechat(settings.wechatId);
    setDiscordUrl(settings.discordUrl ?? "");
    setUsdtNetwork(
      settings.usdtNetwork === "ERC20" || settings.usdtNetwork === "BEP20"
        ? settings.usdtNetwork
        : "TRC20",
    );
    setUsdtAddress(settings.usdtAddress ?? "");
    const map: Record<string, string> = {};
    for (const row of checkouts) map[row.plan_id] = row.whop_url;
    setWhops(map);
    setUsdtAddress(settings.usdtAddress ?? "");
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setReady(true);
      return;
    }
    getAdminStatus()
      .then(async (s) => {
        setIsAdmin(s.isAdmin);
        setCanClaim(s.canClaim);
        if (s.isAdmin) await refresh();
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [user, isPending, refresh]);

  if (isPending || !ready) {
    return (
      <AppShell>
        <div className="mx-auto max-w-5xl px-5 py-24">
          <div className="h-48 animate-pulse rounded-xl bg-surface" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ next: "/admin" }} />;
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <main className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="font-display text-title text-fg">管理后台</h1>
          {canClaim ? (
            <>
              <p className="mt-4 text-sm text-muted">
                尚无管理员。请导师本人认领。认领后可查看所有学员名单、手机与微信、上传收款码、标记到账，也可导出 Excel / WPS。
              </p>
              <Button
                className="mt-8"
                disabled={claiming}
                onClick={async () => {
                  setClaiming(true);
                  try {
                    await claimAdmin();
                    setIsAdmin(true);
                    setCanClaim(false);
                    await refresh();
                    toast.success("已开通管理后台");
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "无法认领");
                  } finally {
                    setClaiming(false);
                  }
                }}
              >
                {claiming ? "处理中…" : "认领管理后台"}
              </Button>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">你没有管理权限。</p>
          )}
        </main>
      </AppShell>
    );
  }

  const awaitingCount = apps.filter(
    (a) => a.status === "pending" && a.pay_claimed_at,
  ).length;
  const pendingCount = apps.filter(
    (a) => a.status === "pending" && !a.pay_claimed_at,
  ).length;
  const paidCount = apps.filter((a) => a.status === "paid").length;
  const visible = apps.filter((a) => {
    if (filter === "all") return true;
    if (filter === "awaiting") return a.status === "pending" && Boolean(a.pay_claimed_at);
    if (filter === "pending") return a.status === "pending" && !a.pay_claimed_at;
    return a.status === filter;
  });

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-champagne uppercase">
              导师后台
            </p>
            <h1 className="mt-2 font-display text-title text-fg">学员名单</h1>
            <p className="mt-2 text-sm text-muted">
              所有申请都存在这里。不需要 Excel 也能看；需要的话可以导出给 WPS。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={tab === "apps" ? "default" : "outline"}
              onClick={() => setTab("apps")}
            >
              申请 {apps.length}
            </Button>
            <Button
              variant={tab === "qr" ? "default" : "outline"}
              onClick={() => setTab("qr")}
            >
              收款码
            </Button>
            <Button
              variant="outline"
              onClick={() => exportApplicationsCsv(apps)}
              disabled={apps.length === 0}
            >
              导出 Excel
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat k={String(apps.length)} v="全部申请" />
          <Stat k={String(pendingCount)} v="待付款" />
          <Stat k={String(awaitingCount)} v="待确认" />
          <Stat k={String(paidCount)} v="已开通" />
        </div>

        {tab === "apps" ? (
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                ["all", "全部"],
                ["pending", "待付款"],
                ["awaiting", "待确认"],
                ["paid", "已开通"],
                ["rejected", "未通过"],
              ].map(([id, label]) => (
                <Button
                  key={id}
                  size="sm"
                  variant={filter === id ? "default" : "outline"}
                  onClick={() => setFilter(id)}
                >
                  {label}
                </Button>
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="rounded-xl bg-surface px-5 py-12 text-center text-sm text-muted shadow-border">
                还没有人申请。把网站发给学员，他们用手机号注册后会出现在这里。
              </p>
            ) : (
              <ul className="space-y-3">
                {visible.map((a) => (
                  <ApplicationCard
                    key={a.id}
                    app={a}
                    onChange={async (status) => {
                      try {
                        const updated = await updateApplicationStatus({
                          data: { id: a.id, status, adminNote: a.admin_note },
                        });
                        setApps((list) =>
                          list.map((x) => (x.id === updated.id ? updated : x)),
                        );
                        toast.success("已更新");
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "更新失败");
                      }
                    }}
                  />
                ))}
              </ul>
            )}
          </section>
        ) : (
          <QrPanel
            qrs={qrs}
            wechat={wechat}
            discordUrl={discordUrl}
            usdtNetwork={usdtNetwork}
            usdtAddress={usdtAddress}
            onWechat={setWechat}
            onDiscord={setDiscordUrl}
            onUsdtNetwork={setUsdtNetwork}
            onUsdtAddress={setUsdtAddress}
            whops={whops}
            onWhop={(planId, url) =>
              setWhops((m) => ({ ...m, [planId]: url }))
            }
            onUploaded={(row) => {
              setQrs((list) => {
                const rest = list.filter((x) => x.plan_id !== row.plan_id);
                return [...rest, row];
              });
            }}
          />
        )}
      </main>
    </AppShell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-5 shadow-border">
      <p className="font-display text-3xl text-fg tabular-nums">{k}</p>
      <p className="mt-1 text-sm text-muted">{v}</p>
    </div>
  );
}

function exportApplicationsCsv(apps: ApplicationRow[]) {
  const header = ["姓名", "微信", "手机", "邮箱", "套餐", "状态", "付款方式", "已声明付款", "备注", "提交时间"];
  const lines = [
    header,
    ...apps.map((a) => [
      a.full_name,
      a.wechat_id,
      a.phone,
      a.email,
      planById(a.plan_id)?.name ?? a.plan_id,
      STATUS_LABEL[displayStatus(a)] ?? a.status,
      PAY_METHOD_LABEL[a.pay_method] ?? a.pay_method,
      a.pay_claimed_at ? "是" : "",
      a.note,
      a.created_at,
    ]),
  ];
  const csv = lines
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trading-gaoshou-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function ApplicationCard({
  app,
  onChange,
}: {
  app: ApplicationRow;
  onChange: (status: string) => void;
}) {
  const plan = planById(app.plan_id);
  const shown = displayStatus(app);
  const variant =
    shown === "paid" ? "success" : shown === "rejected" ? "danger" : "default";

  return (
    <li className="rounded-xl bg-surface p-5 shadow-border">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-xl text-fg">{app.full_name}</p>
            <Badge variant={variant}>{STATUS_LABEL[shown] ?? app.status}</Badge>
            <Badge variant="outline">
              {plan?.name ?? app.plan_id} ${plan?.price ?? ""}
            </Badge>
            {app.pay_method ? (
              <Badge variant="outline">
                {PAY_METHOD_LABEL[app.pay_method] ?? app.pay_method}
              </Badge>
            ) : null}
          </div>
          <dl className="mt-3 grid gap-1 text-sm text-muted sm:grid-cols-2">
            <div>微信 {app.wechat_id}</div>
            <div>手机 {app.phone}</div>
            <div className="sm:col-span-2">邮箱 {app.email}</div>
            {app.note ? <div className="sm:col-span-2">备注 {app.note}</div> : null}
            {app.pay_claimed_at ? (
              <div className="sm:col-span-2 text-champagne">
                学员已点「我已付款」· {new Date(app.pay_claimed_at).toLocaleString("zh-CN")}
              </div>
            ) : null}
          </dl>
          <p className="mt-2 text-xs text-subtle">
            {new Date(app.created_at).toLocaleString("zh-CN")}
          </p>
        </div>
        {app.status === "pending" && (
          <div className="flex shrink-0 gap-2">
            <Button size="sm" onClick={() => onChange("paid")}>
              {app.pay_claimed_at ? "确认到账并开通" : "标记已付款"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onChange("rejected")}>
              拒绝
            </Button>
          </div>
        )}
        {app.status !== "pending" && (
          <Button size="sm" variant="ghost" onClick={() => onChange("pending")}>
            改回待付款
          </Button>
        )}
      </div>
    </li>
  );
}

function QrPanel({
  qrs,
  wechat,
  discordUrl,
  usdtNetwork,
  usdtAddress,
  onWechat,
  onDiscord,
  onUsdtNetwork,
  onUsdtAddress,
  whops,
  onWhop,
  onUploaded,
}: {
  qrs: PaymentQrRow[];
  wechat: string;
  discordUrl: string;
  usdtNetwork: UsdtNetwork;
  usdtAddress: string;
  onWechat: (v: string) => void;
  onDiscord: (v: string) => void;
  onUsdtNetwork: (v: UsdtNetwork) => void;
  onUsdtAddress: (v: string) => void;
  whops: Record<string, string>;
  onWhop: (planId: string, url: string) => void;
  onUploaded: (row: PaymentQrRow) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [savingDiscord, setSavingDiscord] = useState(false);
  const [savingUsdt, setSavingUsdt] = useState(false);

  return (
    <section className="mt-10 space-y-8">
      <div className="rounded-xl bg-surface p-6 shadow-border">
        <h2 className="font-display text-xl text-fg">导师微信</h2>
        <p className="mt-1 text-sm text-muted">
          展示在学员的付款页，方便加你。可随时改。
        </p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
              const res = await updateMentorWechat({ data: { wechatId: wechat } });
              onWechat(res.wechatId);
              toast.success("已保存微信号");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "保存失败");
            } finally {
              setSaving(false);
            }
          }}
        >
          <Input
            value={wechat}
            onChange={(e) => onWechat(e.target.value)}
            placeholder="你的微信号"
            className="sm:max-w-xs"
          />
          <Button type="submit" disabled={saving}>
            {saving ? "保存中…" : "保存"}
          </Button>
        </form>
      </div>

      <div className="rounded-xl bg-surface p-6 shadow-border">
        <h2 className="font-display text-xl text-fg">Discord 邀请</h2>
        <p className="mt-1 text-sm text-muted">
          贴一次即可。只有已开通的学员能在「我的申请」里看到按钮，你不用一个个拉人。链接过期了就换这里。
        </p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setSavingDiscord(true);
            try {
              const res = await updateMentorDiscord({
                data: { discordUrl },
              });
              onDiscord(res.discordUrl);
              toast.success("已保存 Discord 链接");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "保存失败");
            } finally {
              setSavingDiscord(false);
            }
          }}
        >
          <Input
            value={discordUrl}
            onChange={(e) => onDiscord(e.target.value)}
            placeholder="https://discord.gg/你的邀请码"
            className="sm:max-w-md"
          />
          <Button type="submit" disabled={savingDiscord}>
            {savingDiscord ? "保存中…" : "保存"}
          </Button>
        </form>
      </div>

      <div className="rounded-xl bg-surface p-6 shadow-border">
        <h2 className="font-display text-xl text-fg">USDT 收款</h2>
        <p className="mt-1 text-sm text-muted">
          中国学员常用 TRC20（手续费低）。地址贴一次，所有套餐共用，金额按美元标价。空着则付款页只显示微信 / 支付宝。
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            const network = String(fd.get("network") || usdtNetwork) as UsdtNetwork;
            const address = String(fd.get("address") || usdtAddress);
            setSavingUsdt(true);
            try {
              const res = await updateMentorUsdt({
                data: { network, address },
              });
              onUsdtNetwork(res.network);
              onUsdtAddress(res.address);
              toast.success(res.address ? "已保存 USDT 地址" : "已清空 USDT");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "保存失败");
            } finally {
              setSavingUsdt(false);
            }
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="space-y-1 sm:w-36">
              <Label htmlFor="usdt-network">网络</Label>
              <select
                id="usdt-network"
                name="network"
                value={usdtNetwork}
                onChange={(e) => onUsdtNetwork(e.target.value as UsdtNetwork)}
                className="flex h-11 w-full rounded-md bg-surface-2 px-3 text-sm text-fg shadow-border outline-none"
              >
                {USDT_NETWORKS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <Label htmlFor="usdt-address">钱包地址</Label>
              <Input
                id="usdt-address"
                name="address"
                value={usdtAddress}
                onChange={(e) => onUsdtAddress(e.target.value)}
                placeholder="T… 或 0x…"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
          <Button type="submit" disabled={savingUsdt}>
            {savingUsdt ? "保存中…" : "保存 USDT"}
          </Button>
        </form>
      </div>

      <div className="rounded-xl bg-surface p-6 shadow-border">
        <h2 className="font-display text-xl text-fg">Whop 结账链接</h2>
        <p className="mt-1 text-sm text-muted">
          每个套餐一个产品链接。学员用 Visa / Mastercard / PayPal 在 Whop 付款，然后点「我已完成付款」，你在名单里确认到账。
        </p>
        <ul className="mt-5 space-y-4">
          {PLANS.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1 space-y-1">
                <Label htmlFor={`whop-${p.id}`}>
                  {p.name} · ${p.price}
                </Label>
                <Input
                  id={`whop-${p.id}`}
                  value={whops[p.id] ?? ""}
                  onChange={(e) => onWhop(p.id, e.target.value)}
                  placeholder="https://whop.com/checkout/…"
                />
              </div>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    const res = await updatePlanWhop({
                      data: { planId: p.id, whopUrl: whops[p.id] ?? "" },
                    });
                    onWhop(p.id, res.whopUrl);
                    toast.success(`${p.name} 链接已保存`);
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "保存失败");
                  }
                }}
              >
                保存
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-xl text-fg">备用收款码（可选）</h2>
        <p className="mt-1 text-sm text-muted">
          码会过期就在这里换。学员提交申请后，看到的永远是你刚上传的这一张。
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PLANS.map((p) => (
            <QrCard
              key={p.id}
              planId={p.id}
              name={p.name}
              price={p.price}
              current={qrs.find((q) => q.plan_id === p.id)}
              onUploaded={onUploaded}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function QrCard({
  planId,
  name,
  price,
  current,
  onUploaded,
}: {
  planId: string;
  name: string;
  price: number;
  current?: PaymentQrRow;
  onUploaded: (row: PaymentQrRow) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片");
      return;
    }
    if (file.size > 600_000) {
      toast.error("请上传小于 600KB 的图片");
      return;
    }
    setBusy(true);
    try {
      const imageData = await readAsDataUrl(file);
      const row = await uploadPaymentQr({ data: { planId, imageData } });
      onUploaded(row);
      toast.success(`${name} 收款码已更新`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-xl bg-surface p-5 shadow-border">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg text-fg">{name}</h3>
        <span className="font-display text-champagne-soft tabular-nums">${price}</span>
      </div>
      {current ? (
        <img
          src={current.image_data}
          alt={`${name}收款码`}
          className="frame mt-4 aspect-square w-full max-w-[220px] rounded-md bg-surface object-contain p-2"
        />
      ) : (
        <div className="mt-4 grid h-40 place-items-center rounded-md bg-bg-elevated text-sm text-subtle">
          尚未上传
        </div>
      )}
      <label className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-bg-elevated text-sm text-fg shadow-border transition-[box-shadow] duration-150 hover:shadow-border-hover">
        {busy ? "上传中…" : current ? "更换二维码" : "上传二维码"}
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            void onFile(file);
          }}
        />
      </label>
    </article>
  );
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("读取失败"));
    reader.readAsDataURL(file);
  });
}
