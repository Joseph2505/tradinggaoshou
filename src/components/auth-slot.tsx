import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAdminStatus } from "@/lib/vip-server";
import { cn } from "@/lib/utils";

export function AuthSlot({ compact = false }: { compact?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    getAdminStatus()
      .then((s) => {
        if (!cancelled) setIsAdmin(s.isAdmin);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending) {
    return (
      <div
        className="h-11 w-24 animate-pulse rounded-md bg-surface"
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className={cn(
            "inline-flex h-11 items-center px-3 text-sm text-muted transition-colors duration-150 hover:text-fg",
            compact && "hidden sm:inline-flex",
          )}
        >
          登录
        </Link>
        <Link
          to="/apply"
          className="inline-flex h-11 items-center rounded-md bg-champagne px-4 text-sm font-medium text-champagne-fg transition-colors duration-150 hover:bg-champagne-soft"
        >
          申请入会
        </Link>
      </div>
    );
  }

  const label = user.displayName ?? user.primaryEmail ?? "会员";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        to="/account"
        className="hidden max-w-32 truncate text-sm text-muted transition-colors duration-150 hover:text-fg sm:inline"
      >
        {label}
      </Link>
      {isAdmin && (
        <Link
          to="/admin"
          className="hidden text-sm text-champagne/80 transition-colors duration-150 hover:text-champagne sm:inline"
        >
          后台
        </Link>
      )}
      <Link
        to="/account"
        className="inline-flex h-11 items-center rounded-md bg-champagne px-4 text-sm font-medium text-champagne-fg transition-colors duration-150 hover:bg-champagne-soft"
      >
        我的申请
      </Link>
      <button
        type="button"
        disabled={signingOut}
        onClick={() => {
          setSigningOut(true);
          void signOut().catch(() => setSigningOut(false));
        }}
        className="hidden h-11 items-center px-2 text-sm text-subtle transition-colors duration-150 hover:text-fg disabled:cursor-wait sm:inline-flex"
      >
        {signingOut ? "退出中" : "退出"}
      </button>
    </div>
  );
}
