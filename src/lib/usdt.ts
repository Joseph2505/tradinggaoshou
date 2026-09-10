export const USDT_NETWORKS = ["TRC20", "ERC20", "BEP20"] as const;
export type UsdtNetwork = (typeof USDT_NETWORKS)[number];

export function isUsdtNetwork(v: string): v is UsdtNetwork {
  return (USDT_NETWORKS as readonly string[]).includes(v);
}

export function parseUsdtSettings(raw: {
  network?: string;
  address?: string;
}) {
  const network = String(raw.network ?? "TRC20").trim().toUpperCase();
  const address = String(raw.address ?? "").replace(/\s/g, "");
  if (!isUsdtNetwork(network)) throw new Error("请选择 TRC20 / ERC20 / BEP20");
  if (address.length > 128) throw new Error("钱包地址过长");
  if (address) {
    if (network === "TRC20" && (!address.startsWith("T") || address.length < 30)) {
      throw new Error("TRC20 地址以 T 开头，请从钱包复制完整地址");
    }
    if (
      (network === "ERC20" || network === "BEP20") &&
      !/^0x[a-fA-F0-9]{40}$/.test(address)
    ) {
      throw new Error("该网络地址应为 0x 开头的 42 位，请从钱包复制");
    }
  }
  return { network, address };
}
