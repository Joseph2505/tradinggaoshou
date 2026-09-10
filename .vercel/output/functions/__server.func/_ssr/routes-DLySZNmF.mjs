import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SUBSCRIPTION_PERKS, c as monthlyEquivalent, n as LIFETIME_PERKS, r as PLANS, t as FAQS, u as savingsVsMonthly } from "./plans-ByifEzY-.mjs";
import { t as Button } from "./button-V1tQlGD6.mjs";
import { a as Signal, c as MapPin, d as Check, f as ChartLine, l as Landmark, n as Video, o as MessageSquare, p as ArrowRight, r as Users, u as GraduationCap } from "../_libs/lucide-react.mjs";
import { c as getPublicStats, n as Badge, t as AppShell } from "./badge-BKVwgLmh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DLySZNmF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const [remaining, setRemaining] = (0, import_react.useState)(20);
	(0, import_react.useEffect)(() => {
		getPublicStats().then((s) => setRemaining(s.lifetimeRemaining)).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { remaining }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plans, { remaining }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Included, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mentor, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lifetime, { remaining }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Process, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Faq, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Closing, { remaining })
	] });
}
function Hero({ remaining }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate min-h-[100svh] overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/hero.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "reveal text-xs tracking-[0.28em] text-champagne-soft uppercase",
						children: "黄金实盘 · XAUUSD · 中文"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "reveal mt-5 font-display text-display text-fg",
						children: "Trading糕手"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "reveal mt-5 max-w-xl text-lead text-fg/90",
						children: [
							"三年专职，两年半稳定盈利。",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
							"现在，我每年只带二十个人。"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/apply",
								children: ["申请入会", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#mentor",
								children: "认识导师"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 text-sm text-muted",
						children: [
							"终身席位本年剩余 ",
							remaining,
							" / 20"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-4",
						children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#plans",
							className: "bg-bg/80 px-4 py-4 backdrop-blur-sm transition-colors duration-150 hover:bg-surface",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-2xl text-champagne-soft tabular-nums",
								children: ["$", p.price]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									p.name,
									" · ",
									p.lucky
								]
							})]
						}, p.id))
					})
				]
			})
		]
	});
}
function Stats() {
	const items = [
		{
			k: "3 年",
			v: "专职交易"
		},
		{
			k: "2.5 年",
			v: "持续稳定盈利"
		},
		{
			k: "EFREI",
			v: "数据工程 · 金融 AI 硕士"
		},
		{
			k: "20 席",
			v: "每年终身名额"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-bg-elevated",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4",
			children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-8 md:px-8 " + (i < items.length - 1 ? "md:border-r md:border-border" : ""),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl text-fg md:text-3xl",
					children: it.k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: it.v
				})]
			}, it.v))
		})
	});
}
function PlanCard({ plan, remaining }) {
	const monthly = monthlyEquivalent(plan);
	const saved = savingsVsMonthly(plan);
	const soldOut = plan.id === "lifetime" && remaining <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col rounded-xl bg-surface p-5 shadow-border md:p-6 " + (plan.featured ? "md:col-span-1 ring-1 ring-champagne/40" : ""),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: plan.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: plan.featured ? "default" : "outline",
					children: plan.lucky
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 font-display text-5xl leading-none text-fg tabular-nums",
				children: ["$", plan.price]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-subtle",
				children: plan.period
			}),
			monthly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-champagne-soft",
				children: [
					"相当于每月 $",
					monthly,
					saved && saved > 0 ? ` · 省 $${saved}` : ""
				]
			}) : plan.id === "lifetime" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-champagne-soft",
				children: soldOut ? "本年已满席" : `剩余 ${remaining} 席`
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 flex-1 text-sm leading-relaxed text-muted",
				children: plan.blurb
			}),
			soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				variant: "outline",
				disabled: true,
				children: "已满席"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6 w-full",
				variant: plan.featured ? "default" : "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/apply",
					search: { plan: plan.id },
					children: ["选择", plan.name]
				})
			})
		]
	});
}
function Plans({ remaining }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "plans",
		className: "scroll-mt-20 px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
					children: "Membership"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-title text-fg",
					children: "四档数字，都是口彩。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-muted",
					children: "168 一路发，688 顺又发，888 发发发，999 长长久久。价格清楚，权限清楚，席位也清楚。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
					children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, {
						plan: p,
						remaining
					}, p.id))
				})
			]
		})
	});
}
function Included() {
	const icons = [
		Video,
		Users,
		MessageSquare,
		Signal
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-bg-elevated px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
					children: "月卡 / 半年 / 年卡"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-title text-fg",
					children: "订阅会员，你能直接用上的东西。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-4 md:grid-cols-2",
					children: SUBSCRIPTION_PERKS.map((perk, i) => {
						const Icon = icons[i] ?? Check;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-surface p-6 shadow-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-champagne" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-display text-xl text-fg",
									children: perk.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: perk.body
								})
							]
						}, perk.title);
					})
				})
			]
		})
	});
}
function Mentor() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "mentor",
		className: "scroll-mt-20 px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/city.jpg",
				alt: "现居中国的窗景",
				className: "frame aspect-video w-full rounded-xl object-cover"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
					children: "导师"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-title text-fg",
					children: "法国出身，把交易做成手艺。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-4 text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "我在法国出生、求学、工作，毕业于巴黎 EFREI 工程学院，获数据工程与金融人工智能硕士。之后进入瑞士银行业，再于威立雅担任人工智能工程师。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "数据与模型教我如何处理不确定性；交易要求把不确定性变成纪律。三年前我离开机构，专职做黄金。过去两年半，持续稳定盈利，并把生活节奏交还给自己：一年一国。目前，我选择定居中国。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Trading糕手不是喊单群。它是一个每年只收二十人的实盘教室——你能看见我为什么进场，也能在每个交易时段找到一群认真的人。" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 grid gap-3 text-sm text-fg sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-champagne" }), "巴黎 EFREI 硕士"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-4 text-champagne" }), "瑞士银行经历"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "size-4 text-champagne" }), "威立雅 AI 工程师"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-champagne" }), "现居中国"]
						})
					]
				})
			] })]
		})
	});
}
function Lifetime({ remaining }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "lifetime",
		className: "scroll-mt-20 border-y border-border bg-bg-elevated px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
					children: "$999 · 长长久久"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-title text-fg",
					children: "终身席位，不是更贵的年卡。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted",
					children: "十五小时一对一。八周，每周两次。按你的资金、周期与风险偏好，写一份只属于你的行动计划。再把我的交易每周拆给你看。超过二十人，我无法认真跟住每一个人——所以每年只开二十席。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-4 sm:grid-cols-2",
					children: LIFETIME_PERKS.map((perk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-surface p-5 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg text-fg",
							children: perk.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: perk.body
						})]
					}, perk.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/apply",
							search: { plan: "lifetime" },
							children: [
								"申请终身席位 · 剩 ",
								remaining,
								" 席"
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: "含全部订阅权益，一次付清。"
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/mentor.jpg",
				alt: "一对一复盘",
				className: "frame aspect-video w-full rounded-xl object-cover"
			})]
		})
	});
}
function Process() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
					children: "流程"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-title text-fg",
					children: "四步，没有中间商。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						{
							n: "01",
							t: "选套餐",
							d: "月卡、半年、年卡或终身席位。数字即口彩。"
						},
						{
							n: "02",
							t: "填写资料",
							d: "姓名、微信、中国手机号、邮箱。导师用它们联系你。"
						},
						{
							n: "03",
							t: "扫码付款",
							d: "页面展示最新收款码。码会更换，以申请时看到的为准。"
						},
						{
							n: "04",
							t: "确认开通",
							d: "到账后导师手动开通。保留支付截图即可。"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl text-champagne/70",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-xl text-fg",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: s.d
						})
					] }, s.n))
				})
			]
		})
	});
}
function Faq() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "faq",
		className: "scroll-mt-20 border-t border-border px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
				children: "FAQ"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-title text-fg",
				children: "先把话说清楚。"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: FAQS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "group py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-fg",
						children: [item.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle transition-transform duration-150 group-open:rotate-45",
							children: "+"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: item.a
					})]
				}, item.q))
			})]
		})
	});
}
function Closing({ remaining }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/desk.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-3xl px-5 py-24 text-center md:px-8 md:py-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-title text-fg",
						children: "席位有限，是为了跟得住。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted",
						children: "超过二十人，复盘会变稀、回复会变慢。所以我把数字写死。想进来，就现在申请。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/apply",
								children: [
									"申请入会 · 终身剩余 ",
									remaining,
									" 席",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
								]
							})
						})
					})
				]
			})
		]
	});
}
//#endregion
export { Home as component };
