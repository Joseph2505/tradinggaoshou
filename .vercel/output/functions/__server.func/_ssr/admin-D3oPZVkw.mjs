import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as STATUS_LABEL, l as planById, r as PLANS } from "./plans-ByifEzY-.mjs";
import { i as useCurrentUserState, t as Button } from "./button-V1tQlGD6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as getMentorWechat, f as updateApplicationStatus, i as getAdminStatus, l as listApplications, m as uploadPaymentQr, n as Badge, p as updateMentorWechat, r as claimAdmin, t as AppShell, u as listPaymentQrs } from "./badge-BKVwgLmh.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { t as Input } from "./input-D-Fru3zc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D3oPZVkw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [canClaim, setCanClaim] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("apps");
	const [apps, setApps] = (0, import_react.useState)([]);
	const [qrs, setQrs] = (0, import_react.useState)([]);
	const [wechat, setWechat] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [claiming, setClaiming] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		const [list, codes, settings] = await Promise.all([
			listApplications(),
			listPaymentQrs(),
			getMentorWechat()
		]);
		setApps(list);
		setQrs(codes);
		setWechat(settings.wechatId);
	}, []);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		getAdminStatus().then(async (s) => {
			setIsAdmin(s.isAdmin);
			setCanClaim(s.canClaim);
			if (s.isAdmin) await refresh();
		}).catch(() => {}).finally(() => setReady(true));
	}, [
		user,
		isPending,
		refresh
	]);
	if (isPending || !ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl px-5 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-surface" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-5 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-title text-fg",
			children: "管理后台"
		}), canClaim ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "尚无管理员。认领后可查看申请、上传收款码、标记到账。请只由导师本人操作。"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-8",
			disabled: claiming,
			onClick: async () => {
				setClaiming(true);
				try {
					await claimAdmin();
					setIsAdmin(true);
					setCanClaim(false);
					await refresh();
					toast.success("已开通管理后台");
				} catch (err) {
					toast.error(err instanceof Error ? err.message : "无法认领");
				} finally {
					setClaiming(false);
				}
			},
			children: claiming ? "处理中…" : "认领管理后台"
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "你没有管理权限。"
		})]
	}) });
	const visible = apps.filter((a) => filter === "all" || a.status === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.28em] text-champagne-soft uppercase",
				children: "Studio"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-title text-fg",
				children: "管理后台"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: tab === "apps" ? "default" : "outline",
					onClick: () => setTab("apps"),
					children: ["申请 ", apps.length]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: tab === "qr" ? "default" : "outline",
					onClick: () => setTab("qr"),
					children: "收款码"
				})]
			})]
		}), tab === "apps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-2",
				children: [
					["all", "全部"],
					["pending", "待付款"],
					["paid", "已开通"],
					["rejected", "未通过"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === id ? "default" : "outline",
					onClick: () => setFilter(id),
					children: label
				}, id))
			}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-surface px-5 py-12 text-center text-sm text-muted shadow-border",
				children: "暂无申请。"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: visible.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationCard, {
					app: a,
					onChange: async (status) => {
						try {
							const updated = await updateApplicationStatus({ data: {
								id: a.id,
								status,
								adminNote: a.admin_note
							} });
							setApps((list) => list.map((x) => x.id === updated.id ? updated : x));
							toast.success("已更新");
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "更新失败");
						}
					}
				}, a.id))
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPanel, {
			qrs,
			wechat,
			onWechat: setWechat,
			onUploaded: (row) => {
				setQrs((list) => {
					return [...list.filter((x) => x.plan_id !== row.plan_id), row];
				});
			}
		})]
	}) });
}
function ApplicationCard({ app, onChange }) {
	const plan = planById(app.plan_id);
	const variant = app.status === "paid" ? "success" : app.status === "rejected" ? "danger" : "default";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "rounded-xl bg-surface p-5 shadow-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl text-fg",
								children: app.full_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant,
								children: STATUS_LABEL[app.status]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: [
									plan?.name ?? app.plan_id,
									" $",
									plan?.price ?? ""
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid gap-1 text-sm text-muted sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["微信 ", app.wechat_id] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["手机 ", app.phone] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: ["邮箱 ", app.email]
							}),
							app.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: ["备注 ", app.note]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-subtle",
						children: new Date(app.created_at).toLocaleString("zh-CN")
					})
				] }),
				app.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => onChange("paid"),
						children: "标记已付款"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => onChange("rejected"),
						children: "拒绝"
					})]
				}),
				app.status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => onChange("pending"),
					children: "改回待付款"
				})
			]
		})
	});
}
function QrPanel({ qrs, wechat, onWechat, onUploaded }) {
	const [saving, setSaving] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10 space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-surface p-6 shadow-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-fg",
					children: "导师微信"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "展示在学员的付款页，方便加你。可随时改。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-3 sm:flex-row",
					onSubmit: async (e) => {
						e.preventDefault();
						setSaving(true);
						try {
							onWechat((await updateMentorWechat({ data: { wechatId: wechat } })).wechatId);
							toast.success("已保存微信号");
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "保存失败");
						} finally {
							setSaving(false);
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: wechat,
						onChange: (e) => onWechat(e.target.value),
						placeholder: "你的微信号",
						className: "sm:max-w-xs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving,
						children: saving ? "保存中…" : "保存"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "各套餐收款码"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "码会过期就在这里换。学员提交申请后，看到的永远是你刚上传的这一张。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCard, {
					planId: p.id,
					name: p.name,
					price: p.price,
					current: qrs.find((q) => q.plan_id === p.id),
					onUploaded
				}, p.id))
			})
		] })]
	});
}
function QrCard({ planId, name, price, current, onUploaded }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onFile(file) {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("请选择图片");
			return;
		}
		if (file.size > 6e5) {
			toast.error("请上传小于 600KB 的图片");
			return;
		}
		setBusy(true);
		try {
			const imageData = await readAsDataUrl(file);
			onUploaded(await uploadPaymentQr({ data: {
				planId,
				imageData
			} }));
			toast.success(`${name} 收款码已更新`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "上传失败");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-surface p-5 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg text-fg",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-display text-champagne-soft tabular-nums",
					children: ["$", price]
				})]
			}),
			current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: current.image_data,
				alt: `${name}收款码`,
				className: "frame mt-4 aspect-square w-full max-w-[220px] rounded-md bg-fg object-contain p-2"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid h-40 place-items-center rounded-md bg-bg-elevated text-sm text-subtle",
				children: "尚未上传"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-bg-elevated text-sm text-fg shadow-border transition-[box-shadow] duration-150 hover:shadow-border-hover",
				children: [busy ? "上传中…" : current ? "更换二维码" : "上传二维码", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*",
					disabled: busy,
					className: "sr-only",
					onChange: (e) => {
						const file = e.target.files?.[0];
						e.target.value = "";
						onFile(file);
					}
				})]
			})
		]
	});
}
function readAsDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("读取失败"));
		reader.readAsDataURL(file);
	});
}
//#endregion
export { AdminPage as component };
