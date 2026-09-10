import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { GoldMark } from "@/components/gold-mark";

const LINKS = [
  { href: "/#plans", label: "会员" },
  { href: "/#mentor", label: "导师" },
  { href: "/#lifetime", label: "终身席位" },
  { href: "/#faq", label: "常见问题" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[4.25rem] md:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-fg">
          <GoldMark className="size-7" />
          <span className="font-display text-lg tracking-tight">
            Trading糕手
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors duration-150 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="inline-flex h-10 items-center rounded-md bg-champagne px-4 text-sm font-medium text-champagne-fg"
          >
            付款加入
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center text-fg md:hidden"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-bg px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center text-base text-fg"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center text-base text-fg"
            >
              付款加入
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
