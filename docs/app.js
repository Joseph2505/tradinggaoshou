const WHOP = {
  monthly: "https://whop.com/checkout/plan_8laMn28w56i7l",
  halfyear: "https://whop.com/checkout/plan_QlI5DLx0Tz4Xl",
  yearly: "https://whop.com/checkout/plan_31RlCjckYwIUH",
  lifetime: "https://whop.com/checkout/plan_UmclxxkidBWQd",
};

const COPY = {
  zh: {
    member: [
      "只做黄金",
      "有机会才给 1–3 个信号，没有就不硬给",
      "每日黄金分析：从哪做、为什么",
      "VIP 有效期内，每笔交易都可复盘",
      "你自己做的单，发给我，我帮你拆",
      "主社群 Discord；没有 VPN 可用蝙蝠",
    ],
    lifeExtra: [
      "专属风险管理与手数计划：每笔下多少 lot，写清楚",
      "不是课程，是一对一陪伴与加深",
      "已有基础想加深，或有经验但还不稳，或新手陪着学",
      "15 小时一对一：八周，每周两次",
    ],
    plans: [
      { id: "monthly", name: "月卡", lucky: "一路发", headline: "按月做黄金", period: "每月", price: 118, months: 1 },
      { id: "halfyear", name: "半年卡", lucky: "顺又发", headline: "把纪律养成习惯", period: "六个月", price: 588, months: 6 },
      { id: "yearly", name: "年卡", lucky: "发发发", headline: "完整走过一轮金市", period: "一年", price: 888, months: 12 },
      { id: "lifetime", name: "终身席位", lucky: "长长久久", headline: "专属计划 + 陪伴", period: "一次", price: 999, months: null },
    ],
    badge: "最受欢迎",
    pay: "去 Whop 付款 →",
    usdt: "用 USDT？银联 / 微信 / 支付宝先换成 USDT，再联系我们",
    lifeNote: "一次付清 · 专属计划与陪伴",
    note: (monthly, saved) => `随时开始，不限名额${monthly ? ` · 相当于每月 $${monthly}${saved > 0 ? ` · 省 $${saved}` : ""}` : ""}`,
    hint: (name, price) => `只有银联、微信、支付宝？先换成 USDT，再联系我们付 ${name} $${price}。不要自己转。我们会告诉你怎么付。`,
    copy: "复制",
    copied: "已复制",
  },
  en: {
    member: [
      "Gold only",
      "1–3 signals only when there is a setup. None if there isn’t",
      "A daily gold read: where, and why",
      "While VIP is active, every trade can be reviewed",
      "Send me the trades you take. I break them down",
      "Discord is the main room. Without a VPN, use Bat",
    ],
    lifeExtra: [
      "A personal risk and lot plan: how many lots, written down",
      "Not a course. One-to-one company, and more depth",
      "A base you want to deepen, experience that is not yet stable, or a beginner",
      "15 hours one-to-one: eight weeks, twice a week",
    ],
    plans: [
      { id: "monthly", name: "Monthly", lucky: "一路发", headline: "Trade gold month by month", period: "per month", price: 118, months: 1 },
      { id: "halfyear", name: "6 months", lucky: "顺又发", headline: "Make the discipline a habit", period: "six months", price: 588, months: 6 },
      { id: "yearly", name: "Year", lucky: "发发发", headline: "A full year of gold", period: "one year", price: 888, months: 12 },
      { id: "lifetime", name: "Lifetime", lucky: "长长久久", headline: "A personal plan, and company", period: "once", price: 999, months: null },
    ],
    badge: "Most chosen",
    pay: "Pay on Whop →",
    usdt: "UnionPay, WeChat or Alipay? Convert to USDT, then contact us",
    lifeNote: "Paid once · a plan and one-to-one",
    note: (monthly, saved) => `Start any time, no cap${monthly ? ` · about $${monthly}/month${saved > 0 ? ` · save $${saved}` : ""}` : ""}`,
    hint: (name, price) => `Only UnionPay, WeChat or Alipay? Convert to USDT, then contact us for ${name} $${price}. Do not send it on your own.`,
    copy: "Copy",
    copied: "Copied",
  },
};

const FAQS = {
  zh: [
    ["每周 1 手怎么算？", "一个自然周合计 1 标准手。10 笔 0.1 手，或 20 笔 0.05 手，一周很快到。不是每天必须做 1 手。"],
    ["开了户就免费吗？", "用专属链接开实盘并入金，然后联系我们。联系上，当月月卡权益直接开。不用核对报表。"],
    ["和付费月卡有什么差别？", "服务相同。差别是资格：付费月卡付款即开；合伙席位要持续自己交易，每周合计 1 标准手。"],
    ["终身席位能用这个免掉吗？", "不能。终身席位是另一套：风险管理、手数计划和 15 小时一对一。这档只覆盖月卡服务。"],
    ["如何加入？", "两种付法。有 Visa / Mastercard / PayPal：走 Whop，直接进入付款页，付完可在 Whop 进 Discord，不必再联系我们。只有银联、人民币、微信支付或支付宝：先换成 USDT，再联系我们转账——蝙蝠 ID 154375295，Discord Trading糕手 @tradinggaoshou，或 Discord 客服 @keer0501。付款后概不退款。"],
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
  ],
  en: [
    ["How is 1 lot a week counted?", "One calendar week, one standard lot in total. Ten 0.1 trades, or twenty 0.05 trades. Not one lot every single day."],
    ["Is it free as soon as I open the account?", "Open a live account through the partner link, deposit, then contact us. That month starts. We do not ask for a statement."],
    ["How is it different from the paid month?", "The service is the same. The paid month starts when you pay. The partner seat needs you to keep trading, one standard lot a week."],
    ["Can this make lifetime free?", "No. Lifetime is a different offer: a risk plan, a lot plan, and 15 hours one-to-one. This only covers the monthly service."],
    ["How do I join?", "Two ways. Visa, Mastercard or PayPal: Whop checkout, then Discord from Whop. UnionPay, WeChat or Alipay: convert to USDT, then contact us — Bat ID 154375295, Discord @tradinggaoshou, or support @keer0501. No refunds."],
    ["I only have UnionPay, WeChat or Alipay.", "Convert renminbi to USDT first, then contact us for the amount of the plan. Do not send it on your own. The site does not show a wallet address."],
    ["Where is the community?", "No WeChat group. Discord is the main room. If you cannot open Discord, use Bat. While VIP is active, every trade can be reviewed."],
    ["Are there recorded lessons?", "No. This is not a course. A subscription is the desk, the daily read, and a review of your trades. Lifetime adds a personal plan and one-to-one time."],
    ["Is there a signal every day?", "No promise. One to three gold signals only when there is a setup. If there isn’t, there is still a daily read. Better nothing than a forced trade."],
    ["Will you look at my own trades?", "Yes, while you are VIP. Send the gold trades you take. Not how much one trade made. The R multiple, and whether the capital survived."],
    ["Which markets?", "Gold. Signals, the daily read, and reviews are about gold."],
    ["Who is lifetime for?", "Three people: a base you want to deepen; experience that is still not stable or profitable; a beginner. There is no course, but someone stays with you. Extra: a clear risk and lot plan."],
    ["Do you guarantee profit?", "No. Trading is not a home run. What matters is the R multiple and whether the account survives. This is not investment advice."],
    ["Which language?", "Chinese throughout. The room, the reads, and the one-to-one are in Mandarin."],
    ["What is Whop?", "For people with Visa, Mastercard or PayPal. The card is entered on their page. After payment you can enter Discord from Whop. UnionPay, WeChat and Alipay use USDT."],
    ["Can I get a refund?", "No. Once access starts, the sale is final. Check the plan before you pay."],
  ],
};

let lang = "zh";
try { lang = localStorage.getItem("lang") === "en" ? "en" : "zh"; } catch (e) {}

function pack() { return COPY[lang]; }
function plans() { return pack().plans; }

function cardHTML(p) {
  const L = pack();
  const member = L.member;
  const checks = p.id === "lifetime" ? member.concat(L.lifeExtra) : member;
  const monthly = p.months && p.months > 1 ? Math.round(p.price / p.months) : null;
  const base = plans().find((x) => x.id === "monthly").price;
  const saved = p.months && p.months > 1 ? base * p.months - p.price : null;
  const compare = p.months && p.months > 1 ? base * p.months : null;
  const note = p.id === "lifetime" ? L.lifeNote : L.note(monthly, saved);
  return `<article class="card${p.id === "lifetime" ? " life" : ""}" id="card-${p.id}">
    ${p.id === "lifetime" ? `<p class="badge">${L.badge}</p>` : ""}
    <h3>${p.name} · ${p.lucky}</h3>
    <p class="muted mt">${p.headline}</p>
    <div class="mt">
      ${compare ? `<p class="strike">$${compare}</p>` : ""}
      <p class="price${p.id === "lifetime" ? " big" : ""}">$${p.price}</p>
      <p class="subtle mt">${p.period}</p>
      <p class="gold" style="font-size:0.875rem;margin-top:0.25rem">${note}</p>
    </div>
    <ul class="checks">${checks.map((c) => `<li>${c}</li>`).join("")}</ul>
    <div class="mt actions" style="display:grid;gap:0.75rem">
      <a class="btn btn-lg ${p.id === "lifetime" ? "btn-gold" : "btn-soft"} btn-full" href="${WHOP[p.id]}" target="_blank" rel="noreferrer">${L.pay}</a>
      <a class="btn-ghost" href="#pay-${p.id}" style="text-align:center">${L.usdt}</a>
    </div>
  </article>`;
}

function renderDynamic() {
  const L = pack();
  document.getElementById("plansGrid").innerHTML = plans().map(cardHTML).join("");
  const partnerChecks = document.getElementById("partnerChecks");
  if (partnerChecks) partnerChecks.innerHTML = L.member.map((c) => `<li>${c}</li>`).join("");
  document.getElementById("faqList").innerHTML = FAQS[lang]
    .map(([q, a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`)
    .join("");
}

function applyStaticLang() {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!el.dataset.zh) el.dataset.zh = el.textContent.trim();
    el.textContent = lang === "en" ? el.dataset.en : el.dataset.zh;
  });
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = lang === "en" ? "中文" : "EN";
}

let planId = "yearly";
const pick = document.getElementById("planPick");
const usdtBox = document.getElementById("usdtBox");
const usdtHint = document.getElementById("usdtHint");
const btnWhop = document.getElementById("btnWhop");
const btnUsdt = document.getElementById("btnUsdt");

function renderPick() {
  const L = pack();
  pick.innerHTML = plans().map(
    (p) => `<button type="button" data-id="${p.id}" class="${p.id === planId ? "on" : ""}">
      <span class="nm">${p.name} · ${p.lucky}</span>
      <span class="pr">$${p.price}</span>
    </button>`
  ).join("");
  const p = plans().find((x) => x.id === planId);
  btnWhop.href = WHOP[planId];
  usdtHint.textContent = L.hint(p.name, p.price);
}

function renderAll() {
  renderDynamic();
  applyStaticLang();
  renderPick();
}
renderAll();
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
  if (plans().some((p) => p.id === id)) {
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
      el.querySelector("span:last-child").textContent = pack().copied;
      setTimeout(() => {
        el.querySelector("span:last-child").textContent = pack().copy;
      }, 1500);
    } catch {
      alert(el.dataset.copy);
    }
  });
});

document.querySelectorAll(".tip").forEach((tip) => {
  const btn = tip.querySelector(".tip-btn");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = tip.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
});
document.addEventListener("click", () => {
  document.querySelectorAll(".tip.open").forEach((tip) => {
    tip.classList.remove("open");
    tip.querySelector(".tip-btn")?.setAttribute("aria-expanded", "false");
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

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
  if (theme !== "dark") document.documentElement.removeAttribute("data-theme");
  try { localStorage.setItem("theme", theme === "dark" ? "dark" : "light"); } catch (e) {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#12100e" : "#f6f1e8";
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.textContent = theme === "dark" ? "☀" : "☾";
    themeBtn.setAttribute("aria-label", theme === "dark" ? "Light mode" : "Dark mode");
  }
}

let theme = "light";
try { theme = localStorage.getItem("theme") === "dark" ? "dark" : "light"; } catch (e) {}
applyTheme(theme);

document.getElementById("langBtn").addEventListener("click", () => {
  lang = lang === "en" ? "zh" : "en";
  try { localStorage.setItem("lang", lang); } catch (e) {}
  renderAll();
});
document.getElementById("themeBtn").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});
