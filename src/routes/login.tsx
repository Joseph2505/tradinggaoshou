import { useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { GoldMark } from "@/components/gold-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseLoginId } from "@/lib/phone";

type LoginSearch = { next?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    next:
      typeof search.next === "string" && search.next.startsWith("/")
        ? search.next
        : undefined,
  }),
  component: Login,
});

function safeNext(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/account";
  return next;
}

function authErrorMessage(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("already") || m.includes("exist")) {
    return "这个手机号或邮箱已经注册，请直接登录";
  }
  if (m.includes("invalid") || m.includes("password") || m.includes("credential")) {
    return "手机号 / 邮箱或密码不对";
  }
  return msg || "请稍后重试";
}

function Login() {
  const { next } = Route.useSearch();
  const dest = safeNext(next);
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const mentorLogin = dest.startsWith("/admin");

  if (!isPending && user) {
    const [pathname, query] = dest.split("?");
    const search = Object.fromEntries(new URLSearchParams(query ?? ""));
    return <Navigate to={pathname} search={search} />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = parseLoginId(identifier);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    if (mode === "up" && password !== confirm) {
      setError("两次密码不一致");
      return;
    }
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email: parsed.email,
          password,
          name: name.trim() || parsed.phone || parsed.email.split("@")[0] || "会员",
        });
        if (res.error) throw new Error(authErrorMessage(res.error.message || ""));
      } else {
        const res = await authClient.signIn.email({
          email: parsed.email,
          password,
        });
        if (res.error) throw new Error(authErrorMessage(res.error.message || ""));
      }
      window.location.assign(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "请稍后重试");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-svh bg-bg text-fg lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="/images/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-fg/25" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="font-display text-4xl text-fg">Trading糕手</p>
          <p className="mt-3 max-w-sm text-muted">
            用手机号或 QQ 邮箱注册。提交申请后即可看到收款码。
          </p>
        </div>
      </div>

      <div className="flex flex-col px-5 py-8 md:px-12">
        <Link to="/" className="flex items-center gap-2 self-start text-fg">
          <GoldMark className="size-7" />
          <span className="font-display text-lg">Trading糕手</span>
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl text-fg">
            {mentorLogin ? "导师后台" : mode === "in" ? "登录" : "注册"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mentorLogin
              ? "学员无法进入此后台。使用导师账号登录。"
              : mode === "in"
                ? "手机号或邮箱 + 密码。QQ、163 邮箱都可以。"
                : "推荐用中国手机号。也可以用 QQ / 163 邮箱。"}
          </p>

          {authEnabled ? (
            <>
              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                {mode === "up" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      placeholder="怎么称呼你"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="identifier">手机号或邮箱</Label>
                  <Input
                    id="identifier"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    inputMode="email"
                    placeholder="13800138000 或 name@qq.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={
                      mode === "up" ? "new-password" : "current-password"
                    }
                    placeholder="至少 8 位"
                  />
                </div>
                {mode === "up" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm">确认密码</Label>
                    <Input
                      id="confirm"
                      type="password"
                      required
                      minLength={8}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      placeholder="再输入一次"
                    />
                  </div>
                )}
                {error && <p className="text-sm text-danger">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy
                    ? "请稍候…"
                    : mentorLogin
                      ? "进入后台"
                      : mode === "in"
                        ? "登录"
                        : "创建账户"}
                </Button>
              </form>

              {!mentorLogin && (
              <p className="mt-4 text-center text-sm text-muted">
                {mode === "in" ? "还没有账户？" : "已有账户？"}{" "}
                <button
                  type="button"
                  className="text-champagne hover:text-champagne-soft"
                  onClick={() => {
                    setMode(mode === "in" ? "up" : "in");
                    setError("");
                  }}
                >
                  {mode === "in" ? "注册" : "登录"}
                </button>
              </p>
              )}
            </>
          ) : (
            <p className="mt-8 text-sm text-muted">登录暂未开放。</p>
          )}
        </div>
      </div>
    </main>
  );
}
