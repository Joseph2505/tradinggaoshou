import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as monthlyEquivalent, r as PLANS, s as isPlanId } from "./plans-ByifEzY-.mjs";
import { i as useCurrentUserState, r as cn, t as Button } from "./button-V1tQlGD6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$2 } from "./router-Cf55EAsp.mjs";
import { c as getPublicStats, d as submitApplication, n as Badge, o as getMyApplication, t as AppShell } from "./badge-BKVwgLmh.mjs";
import { t as Input } from "./input-D-Fru3zc.mjs";
import { t as Label } from "./label-9DFH1KZl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apply-DOD25bq9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-lg bg-surface px-3.5 py-3 text-base text-fg shadow-border outline-none transition-[box-shadow] duration-150 placeholder:text-subtle hover:shadow-border-hover focus-visible:shadow-border-hover disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
function ApplyPage() {
	const { plan: planParam } = Route$2.useSearch();
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const initialPlan = isPlanId(planParam ?? "") ? planParam : "monthly";
	const [planId, setPlanId] = (0, import_react.useState)(initialPlan);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [wechatId, setWechatId] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [remaining, setRemaining] = (0, import_react.useState)(20);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (isPlanId(planParam ?? "")) setPlanId(planParam);
	}, [planParam]);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user) {
			setLoading(false);
			return;
		}
		setEmail((prev) => prev || user.primaryEmail || "");
		setFullName((prev) => prev || user.displayName || "");
		let cancelled = false;
		Promise.all([getMyApplication(), getPublicStats()]).then(([app, stats]) => {
			if (cancelled) return;
			setRemaining(stats.lifetimeRemaining);
			if (app) {
				if (app.status === "paid") {
					navigate({ to: "/account" });
					return;
				}
				setPlanId(isPlanId(app.plan_id) ? app.plan_id : initialPlan);
				setFullName(app.full_name);
				setWechatId(app.wechat_id);
				setPhone(app.phone);
				setEmail(app.email);
				setNote(app.note);
			}
		}).catch(() => {}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		user,
		isPending,
		navigate,
		initialPlan
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-5 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { next: `/apply?plan=${planId}` }
	});
	const selected = PLANS.find((p) => p.id === planId) ?? PLANS[0];
	const soldOut = planId === "lifetime" && remaining <= 0;
	const monthly = monthlyEquivalent(selected);
	async function onSubmit(e) {
		e.preventDefault();
		if (soldOut) return;
		setError("");
		setBusy(true);
		try {
			await submitApplication({ data: {
				planId,
				fullName,
				wechatId,
				phone,
				email,
				note
			} });
			toast.success("申请已提交，请完成付款");
			await navigate({ to: "/account" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
				children: "申请入会"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-title text-fg",
				children: "留下联系方式。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "提交后即可看到最新收款二维码。导师确认到账后开通。二维码会更换，请以本页为准。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-2",
				children: PLANS.map((p) => {
					const active = p.id === planId;
					const full = p.id === "lifetime" && remaining <= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: full,
						onClick: () => setPlanId(p.id),
						className: "flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left shadow-border transition-[box-shadow,background-color] duration-150 " + (active ? "bg-surface-2 shadow-border-hover" : "bg-surface hover:shadow-border-hover") + (full ? " opacity-40" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-fg",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-subtle",
							children: [p.lucky, p.id === "lifetime" ? ` · 剩 ${remaining} 席` : ""]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-xl text-champagne-soft tabular-nums",
							children: ["$", p.price]
						})]
					}, p.id);
				})
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "rounded-xl bg-surface p-6 shadow-border md:p-8",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 animate-pulse rounded-lg bg-surface-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-fg",
							children: selected.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: selected.lucky })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"$",
							selected.price,
							" / ",
							selected.period,
							monthly ? ` · 约 $${monthly}/月` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "fullName",
									children: "姓名"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fullName",
									required: true,
									value: fullName,
									onChange: (e) => setFullName(e.target.value),
									placeholder: "真实姓名",
									autoComplete: "name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "wechat",
									children: "微信号"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "wechat",
									required: true,
									value: wechatId,
									onChange: (e) => setWechatId(e.target.value),
									placeholder: "用于拉群与联系"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "phone",
									children: "中国手机号"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									required: true,
									inputMode: "numeric",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "11 位手机号",
									autoComplete: "tel"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "邮箱"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									autoComplete: "email"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "note",
							children: "备注（选填）"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "交易经验、本金区间、希望解决的问题…",
							maxLength: 500
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: busy || soldOut,
						children: soldOut ? "终身席位已满" : busy ? "提交中…" : "提交并查看收款码"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-subtle",
						children: "提交即表示你已阅读并理解风险提示。交易有亏损可能。"
					})
				]
			})
		})]
	}) });
}
//#endregion
export { ApplyPage as component };
