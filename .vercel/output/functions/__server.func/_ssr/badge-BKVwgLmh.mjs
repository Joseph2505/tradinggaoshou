import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { o as authMiddleware, s as isPlanId } from "./plans-ByifEzY-.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as useCurrentUserState, n as GoldMark, r as cn } from "./button-V1tQlGD6.mjs";
import { s as Menu, t as X } from "../_libs/lucide-react.mjs";
import { i as createSsrRpc } from "./router-Cf55EAsp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-BKVwgLmh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function normalizePhone(raw) {
	return raw.replace(/[\s-]/g, "").replace(/^\+?86/, "");
}
function validateApplicationInput(input) {
	const fullName = input.fullName.trim();
	const wechatId = input.wechatId.trim();
	const phone = normalizePhone(input.phone);
	const email = input.email.trim().toLowerCase();
	const note = (input.note ?? "").trim();
	if (!isPlanId(input.planId)) throw new Error("请选择有效套餐");
	if (fullName.length < 2 || fullName.length > 40) throw new Error("请填写真实姓名");
	if (wechatId.length < 2 || wechatId.length > 32) throw new Error("请填写微信号");
	if (!/^1[3-9]\d{9}$/.test(phone)) throw new Error("请填写有效的中国手机号");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("请填写有效邮箱");
	if (note.length > 500) throw new Error("备注过长");
	return {
		planId: input.planId,
		fullName,
		wechatId,
		phone,
		email,
		note
	};
}
var getPublicStats = createServerFn({ method: "GET" }).handler(createSsrRpc("74f6d3961934e041a8cb7607344b754b8cca2541ee3ffadff290a54615e6af1e"));
var getAdminStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("82b04b6252a0810f31c8e2f8ca2fcea6a8a09a1c51853ea8d4fdfede1db300e0"));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("42292d99efd8653f6f499f0dae917e4d21ca9f9da0ab46e76227dabddc161470"));
var getMyApplication = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3be4ed831ad73d5ca9a05a5d5ed0113ebac75932c6ddbb1f0245eeb94c3bf24c"));
var submitApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => validateApplicationInput(raw)).handler(createSsrRpc("fed94e219af53e74ce2def89998730eb6849bb922aa6071de10507cbac509fac"));
var getMyPaymentQr = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9cd1a5a25d12b4a7cb7fb12c5f719818b4acd3ec724d623c5ed6f5bca70784be"));
var listApplications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("af3318f35c0ab1b54b570fe9081a85029a1aeb9f143e2547f9c899e536140b82"));
var updateApplicationStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => {
	const data = raw;
	if (!Number.isFinite(data.id)) throw new Error("申请无效");
	if (![
		"pending",
		"paid",
		"rejected"
	].includes(data.status)) throw new Error("状态无效");
	return {
		id: data.id,
		status: data.status,
		adminNote: (data.adminNote ?? "").trim().slice(0, 400)
	};
}).handler(createSsrRpc("7e3cbc1597d20309b7d20ec688bed453280097bf2da02eccc30217d5d9c13448"));
var listPaymentQrs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7d4613b484e41e0f9f7453f7469369b64d56413cf485399a736e85c99145fb8d"));
var uploadPaymentQr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => {
	const data = raw;
	if (!isPlanId(data.planId)) throw new Error("套餐无效");
	if (!data.imageData.startsWith("data:image/")) throw new Error("请上传图片文件");
	if (data.imageData.length > 9e5) throw new Error("图片过大，请压缩后再传");
	return {
		planId: data.planId,
		imageData: data.imageData
	};
}).handler(createSsrRpc("2de89e1220b8041d6c110571d9ad50e3bc64695344547186d9b553fbefdbd37e"));
var getMentorWechat = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0f0ff0c4779db0934185385a36e8ec89996942733393d25a1ecec52f0a4a1abd"));
var updateMentorWechat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => {
	const wechatId = String(raw.wechatId ?? "").trim();
	if (wechatId.length > 32) throw new Error("微信号过长");
	return { wechatId };
}).handler(createSsrRpc("32190cbcc3922857f90dbc139e0869b5c8942a80dbf0cc32e846418a3e6a40c9"));
function AuthSlot({ compact = false }) {
	const { user, isPending } = useCurrentUserState();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setIsAdmin(false);
			return;
		}
		let cancelled = false;
		getAdminStatus().then((s) => {
			if (!cancelled) setIsAdmin(s.isAdmin);
		}).catch(() => {
			if (!cancelled) setIsAdmin(false);
		});
		return () => {
			cancelled = true;
		};
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-11 w-24 animate-pulse rounded-md bg-surface",
		"aria-hidden": true
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: cn("inline-flex h-11 items-center px-3 text-sm text-muted transition-colors duration-150 hover:text-fg", compact && "hidden sm:inline-flex"),
			children: "登录"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/apply",
			className: "inline-flex h-11 items-center rounded-md bg-champagne px-4 text-sm font-medium text-champagne-fg transition-colors duration-150 hover:bg-champagne-soft",
			children: "申请入会"
		})]
	});
	const label = user.displayName ?? user.primaryEmail ?? "会员";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 sm:gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/account",
				className: "hidden max-w-32 truncate text-sm text-muted transition-colors duration-150 hover:text-fg sm:inline",
				children: label
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				className: "hidden text-sm text-champagne/80 transition-colors duration-150 hover:text-champagne sm:inline",
				children: "后台"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/account",
				className: "inline-flex h-11 items-center rounded-md bg-champagne px-4 text-sm font-medium text-champagne-fg transition-colors duration-150 hover:bg-champagne-soft",
				children: "我的申请"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "hidden h-11 items-center px-2 text-sm text-subtle transition-colors duration-150 hover:text-fg disabled:cursor-wait sm:inline-flex",
				children: signingOut ? "退出中" : "退出"
			})
		]
	});
}
var LINKS = [
	{
		href: "/#plans",
		label: "会员"
	},
	{
		href: "/#mentor",
		label: "导师"
	},
	{
		href: "/#lifetime",
		label: "终身席位"
	},
	{
		href: "/#faq",
		label: "常见问题"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border/80 bg-bg/80 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[4.25rem] md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg tracking-tight",
						children: "Trading糕手"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-7 md:flex",
					children: LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						className: "text-sm text-muted transition-colors duration-150 hover:text-fg",
						children: l.label
					}, l.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex size-11 items-center justify-center text-fg md:hidden",
						"aria-label": open ? "关闭菜单" : "打开菜单",
						onClick: () => setOpen((v) => !v),
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-bg px-5 py-4 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col gap-1",
				children: LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: l.href,
					onClick: () => setOpen(false),
					className: "flex h-11 items-center text-base text-fg",
					children: l.label
				}, l.href))
			})
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr] md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldMark, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg",
					children: "Trading糕手"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md text-sm leading-relaxed text-muted",
				children: "黄金实盘教室。法国出身，巴黎 EFREI 硕士，现居中国。订阅会员看实盘、进社群、每日信号；终身席位另含一对一私教。全年仅二十席。"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-8 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs tracking-widest text-subtle uppercase",
							children: "导航"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#plans",
							className: "text-muted hover:text-fg",
							children: "会员套餐"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#mentor",
							className: "text-muted hover:text-fg",
							children: "关于导师"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/apply",
							className: "text-muted hover:text-fg",
							children: "申请入会"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							className: "text-muted hover:text-fg",
							children: "我的申请"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs tracking-widest text-subtle uppercase",
							children: "账户"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-muted hover:text-fg",
							children: "登录 / 注册"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "text-muted hover:text-fg",
							children: "管理后台"
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl px-5 py-6 text-xs leading-relaxed text-subtle md:px-8",
				children: "风险提示：黄金及杠杆产品交易存在本金亏损可能。过往表现不代表未来收益。本站内容为教育与社群服务，不构成任何投资建议。入会即表示你理解并自行承担交易风险。"
			})
		})]
	});
}
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-svh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-champagne/15 text-champagne-soft",
		outline: "shadow-border text-muted",
		success: "bg-success/15 text-success",
		danger: "bg-danger/15 text-danger",
		muted: "bg-surface-2 text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { getMentorWechat as a, getPublicStats as c, submitApplication as d, updateApplicationStatus as f, getAdminStatus as i, listApplications as l, uploadPaymentQr as m, Badge as n, getMyApplication as o, updateMentorWechat as p, claimAdmin as r, getMyPaymentQr as s, AppShell as t, listPaymentQrs as u };
