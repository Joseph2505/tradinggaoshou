# Trading糕手 · 静态站

纯 HTML / CSS / JS，可放在 **GitHub Pages** 或任何主机上。没有 grok.me。

在线地址（开启 Pages 后）：

https://joseph2505.github.io/tradinggaoshou/

## 换成自己的域名（没有 grok）

1. 买一个域名，例如 `tradinggaoshou.com`
2. 在域名商把 DNS 指到 GitHub Pages：
   - `A` 记录：`185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153`
   - 或 `CNAME` 记录：`joseph2505.github.io`
3. 在本仓库根目录加一个文件 `docs/CNAME`，内容只有一行：

```
tradinggaoshou.com
```

4. GitHub → Settings → Pages → Custom domain 填同一个名字

访客看到的就是你的域名，不再经过 grok。

Whop 和 Discord 链接已经写死在页面里。
