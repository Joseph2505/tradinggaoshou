const WHOP = {
  monthly: "https://whop.com/tradinggaoshou/products/65dfbc5e-de1c-4b89-a972-79c52bf991d0/",
  halfyear: "https://whop.com/tradinggaoshou/products/6f919675-3a63-4c2d-890f-599c453e014a/",
  yearly: "https://whop.com/tradinggaoshou/products/4ecf2972-a499-4829-a18e-1562ae94fed6/",
  lifetime: "https://whop.com/tradinggaoshou/products/c5a96db9-8a18-47a7-9271-62eba5b8d0b7/",
};

const MEMBER = [
  "只做黄金",
  "有机会才给 1–3 个信号，没有就不硬给",
  "每日黄金分析：从哪做、为什么",
  "VIP 有效期内，每笔交易都可复盘",
  "你自己做的单，发给我，我帮你拆",
  "主社群 Discord；没有 VPN 可用蝙蝠",
];

const LIFE = [
  ...MEMBER,
  "专属风险管理与手数计划：每笔下多少 lot，写清楚",
  "不是课程，是一对一陪伴与加深",
  "已有基础想加深，或有经验但还不稳，或新手陪着学",
  "15 小时一对一：八周，每周两次",
];

const PLANS = [
  { id: "monthly", name: "月卡", lucky: "一路发", headline: "按月做黄金", price: 168, period: "每月", months: 1 },
  { id: "halfyear", name: "半年卡", lucky: "顺又发", headline: "把纪律养成习惯", price: 688, period: "六个月", months: 6 },
  { id: "yearly", name: "年卡", lucky: "发发发", headline: "完整走过一轮金市", price: 888, period: "一年", months: 12 },
  { id: "lifetime", name: "终身席位", lucky: "长长久久", headline: "专属计划 + 陪伴", price: 999, period: "一次", months: null },
];

const FAQS = [
  ["如何加入？", "两种付法。有 Visa / Mastercard / PayPal：走 Whop，直接跳转到该套餐产品页，付完可在 Whop 进 Discord，不必再联系我们。只有银联、人民币、微信支付或支付宝：先换成 USDT，再联系我们转账——蝙蝠 ID 154375295，Discord Trading糕手 @tradinggaoshou，或 Discord 客服 @keer0501。付款后概不退款。"],
  ["我只有银联 / 微信 / 支付宝，怎么办？", "先在交易所或钱包把人民币换成 USDT，然后联系导师或客服，按套餐金额转过来。不要自己随便转。网站不显示钱包地址。"],
  ["社群在哪？", "没有微信群。主社群是 Discord。打不开 Discord、没有 VPN 的，用蝙蝠。VIP 有效期内，每笔交易都可以复盘。"],
  ["有录播课吗？", "没有。这不是网课。订阅是跟盘、分析、帮你看你的单。终身席位是专属计划与一对一陪伴。"],
  ["每天都有信号吗？", "不保证。有机会才给 1–3 个黄金信号。没有机会，仍有每日分析：结构、关键位、从哪考虑进场。宁缺毋滥。"],
  ["我自己做的单，你帮看吗？", "帮。只要还是 VIP，你自己做的黄金单随时发给我，我帮你拆。不看你这一单赚了多少，看 RR、看你有没有把本金保住。"],
  ["做哪些品种？", "黄金。信号、分析、复盘都围绕黄金。"],
  ["终身席位适合谁？", "三种人：已有基础想加深；做了一段时间但还不稳、还不盈利；新手——没有课程，但可以陪着你学。多出来的是一份清晰的风险管理与手数计划。"],
  ["保证盈利吗？", "不保证。交易不是全垒打。我们不关心一笔赚了多少，关心你做了多少 RR、有没有爆仓。先活下来，再谈赚钱。不构成投资建议。"],
  ["用什么语言？", "全程中文。社群、分析、私教都是普通话。"],
  ["Whop 是什么？", "有 Visa、Mastercard 或 PayPal 的人用。信用卡和 PayPal 在他们的页面完成，本教室不经手卡号。付完可在 Whop 直接进 Discord。只有银联、微信、支付宝的，请走 USDT。"],
  ["付款后可以退款吗？", "不可以。数字产品一经开通，概不退款。请在付款前确认套餐。"],
];

function cardHTML(p) {
  const monthly = p.months && p.months > 1 ? Math.round(p.price / p.months) : null;
  const saved = p.months && p.months > 1 ? 168 * p.months - p.price : null;
  const compare = p.months && p.months > 1 ? 168 * p.months : null;
  const checks = p.id === "lifetime" ? LIFE : MEMBER;
  const note =
    p.id === "lifetime"
      ? "一次付清 · 专属计划与陪伴"
      : `随时开始，不限名额${monthly ? ` · 相当于每月 $${monthly}${saved > 0 ? ` · 省 $${saved}` : ""}` : ""}`;
  return `<article class="card${p.id === "lifetime" ? " life" : ""}" id="card-${p.id}">
    ${p.id === "lifetime" ? `<p class="badge">最受欢迎</p>` : ""}
    <h3>${p.name} · ${p.lucky}</h3>
    <p class="muted mt">${p.headline}</p>
    <div class="mt">
      ${compare ? `<p class="strike">$${compare}</p>` : ""}
      <p class="price${p.id === "lifetime" ? " big" : ""}">$${p.price}</p>
      <p class="subtle mt">${p.period}</p>
      <p class="gold" style="font-size:0.875rem;margin-top:0.25rem">${note}</p>
    </div>
    <ul class="checks">${checks.map((c) => `<li>${c}</li>`).join("")}</ul>
    <div class="mt" style="display:grid;gap:0.75rem">
      <a class="btn btn-lg ${p.id === "lifetime" ? "btn-gold" : "btn-soft"} btn-full" href="${WHOP[p.id]}" target="_blank" rel="noreferrer">去 Whop 付款 →</a>
      <a class="btn-ghost" href="#pay-${p.id}" style="text-align:center">用 USDT？银联 / 微信 / 支付宝先换成 USDT，再联系我们</a>
    </div>
  </article>`;
}

document.getElementById("plansCompact").innerHTML = PLANS.filter((p) => p.months && p.months < 12)
  .map(cardHTML)
  .join("");
document.getElementById("plansHighlight").innerHTML = PLANS.filter((p) => !p.months || p.months >= 12)
  .map(cardHTML)
  .join("");
document.getElementById("faqList").innerHTML = FAQS.map(
  ([q, a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`
).join("");

let planId = "yearly";
const pick = document.getElementById("planPick");
const usdtBox = document.getElementById("usdtBox");
const usdtHint = document.getElementById("usdtHint");
const btnWhop = document.getElementById("btnWhop");
const btnUsdt = document.getElementById("btnUsdt");

function renderPick() {
  pick.innerHTML = PLANS.map(
    (p) => `<button type="button" data-id="${p.id}" class="${p.id === planId ? "on" : ""}">
      <span class="nm">${p.name} · ${p.lucky}</span>
      <span class="pr">$${p.price}</span>
    </button>`
  ).join("");
  const p = PLANS.find((x) => x.id === planId);
  btnWhop.href = WHOP[planId];
  usdtHint.textContent = `只有银联、微信、支付宝？先换成 USDT，再联系我们付 ${p.name} $${p.price}。不要自己转。我们会告诉你怎么付。`;
}
renderPick();
pick.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  planId = b.dataset.id;
  usdtBox.classList.add("hidden");
  renderPick();
});
btnUsdt.addEventListener("click", () => usdtBox.classList.toggle("hidden"));

function applyHash() {
  const raw = location.hash.replace(/^#/, "");
  const id = raw.startsWith("pay-") ? raw.slice(4) : "";
  if (PLANS.some((p) => p.id === id)) {
    planId = id;
    renderPick();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }
}
window.addEventListener("hashchange", applyHash);
applyHash();

document.querySelectorAll("[data-copy]").forEach((el) => {
  el.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(el.dataset.copy);
      el.querySelector("span:last-child").textContent = "已复制";
      setTimeout(() => {
        el.querySelector("span:last-child").textContent = "复制";
      }, 1500);
    } catch {
      alert(el.dataset.copy);
    }
  });
});

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
menuBtn.addEventListener("click", () => {
  const open = mobileNav.style.display === "block";
  mobileNav.style.display = open ? "none" : "block";
  menuBtn.textContent = open ? "☰" : "✕";
});
mobileNav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileNav.style.display = "none";
    menuBtn.textContent = "☰";
  })
);
