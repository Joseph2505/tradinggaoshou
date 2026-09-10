import { GoldMark } from "@/components/gold-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <GoldMark className="size-6" />
            <span className="font-display text-lg">Trading糕手</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            黄金实盘教室。法国出生，中文授课。巴黎 EFREI
            硕士，现居中国。目标：让你成为能管住风险的盈利交易者。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs tracking-widest text-subtle uppercase">
              导航
            </span>
            <a href="/#plans" className="text-muted hover:text-fg">
              会员套餐
            </a>
            <a href="/#mentor" className="text-muted hover:text-fg">
              关于导师
            </a>
            <a href="/#lifetime" className="text-muted hover:text-fg">
              终身席位
            </a>
            <a href="/#contact" className="text-muted hover:text-fg">
              付款加入
            </a>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-xs tracking-widest text-subtle uppercase">
              付款
            </span>
            <span className="text-muted">银联 / 微信 / 支付宝 → 换成 USDT</span>
            <span className="text-muted">Visa / Mastercard / PayPal → Whop</span>
            <span className="text-muted">付款后概不退款</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-6 text-xs leading-relaxed text-subtle md:px-8">
          风险提示：黄金及杠杆产品交易存在本金亏损可能。过往表现不代表未来收益。本站内容为教育与社群服务，不构成任何投资建议。付款后概不退款。
        </div>
      </div>
    </footer>
  );
}
