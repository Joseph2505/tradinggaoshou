import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as STATUS_LABEL, l as planById, r as PLANS } from "./plans-ByifEzY-.mjs";
import { i as useCurrentUserState, t as Button } from "./button-V1tQlGD6.mjs";
import { n as Badge, o as getMyApplication, s as getMyPaymentQr, t as AppShell } from "./badge-BKVwgLmh.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-DUm5oWUl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	const [app, setApp] = (0, import_react.useState)(void 0);
	const [qr, setQr] = (0, import_react.useState)(null);
	const [wechat, setWechat] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let cancelled = false;
		Promise.all([getMyApplication(), getMyPaymentQr()]).then(([a, pay]) => {
			if (cancelled) return;
			setApp(a);
			setQr(pay.qr);
			setWechat(pay.wechat ?? "");
		}).catch(() => {
			if (!cancelled) setApp(null);
		});
		return () => {
			cancelled = true;
		};
	}, [user, isPending]);
	if (isPending || app === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-5 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-xl bg-surface" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!app) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-5 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-title text-fg",
				children: "还没有申请。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "选择一套餐，留下微信与手机，导师会联系你。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8",
				size: "lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/apply",
					children: "去申请"
				})
			})
		]
	}) });
	const plan = planById(app.plan_id);
	const statusLabel = STATUS_LABEL[app.status] ?? app.status;
	const statusVariant = app.status === "paid" ? "success" : app.status === "rejected" ? "danger" : "default";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-2 md:px-8 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-surface p-6 shadow-border md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
					children: "我的申请"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl text-fg",
						children: plan?.name ?? app.plan_id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant,
						children: statusLabel
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-display text-4xl text-champagne-soft tabular-nums",
					children: ["$", plan?.price ?? ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "姓名",
							v: app.full_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "微信",
							v: app.wechat_id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "手机",
							v: app.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "邮箱",
							v: app.email
						}),
						app.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "备注",
							v: app.note
						}) : null
					]
				}),
				app.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/apply",
						search: { plan: app.plan_id },
						children: "修改资料"
					})
				}),
				app.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-success",
					children: "已开通。请留意微信，导师会拉你进社群。"
				}),
				app.status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-danger",
					children: "本次申请未通过。如有疑问，请通过微信联系导师。"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-surface p-6 shadow-border md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-fg",
					children: "付款"
				}),
				app.status === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "无需再次付款。"
				}) : app.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "当前申请未通过，暂不收款。"
				}) : qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qr.image_data,
						alt: `${plan?.name ?? ""}收款二维码`,
						className: "frame mx-auto w-full max-w-xs rounded-lg bg-fg p-3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-center text-sm text-muted",
						children: "请使用微信或支付宝扫码。付款后保留截图，导师确认到账即开通。"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted",
					children: "收款码将由导师上传。若本页暂无二维码，请先添加导师微信，导师会单独发给你。"
				}),
				wechat && app.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 rounded-lg bg-bg-elevated px-4 py-3 text-sm text-fg",
					children: ["导师微信：", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: wechat
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-xs text-subtle",
					children: [
						"二维码会不定期更换。请只扫描本页展示的最新一版。套餐：",
						PLANS.map((p) => p.name).join(" / "),
						"。"
					]
				})
			]
		})]
	}) });
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4 border-b border-border py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right text-fg",
			children: v
		})]
	});
}
//#endregion
export { AccountPage as component };
