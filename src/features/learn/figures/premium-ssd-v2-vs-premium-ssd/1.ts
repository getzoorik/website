import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-premium-ssd-v2-vs-premium-ssd-1",
  label:
    "Diagram. A disk that needs 600 GiB, at East US list prices in October 2026. On Premium SSD it is billed as a 1,024 GiB P30 at $135.17 a month, 600 GiB of data and 424 GiB billed but unused. On Premium SSD v2 it is billed per GiB for 600 GiB at $48.18 a month, with 3,000 IOPS and 125 MB/s included.",
  style: `.fg-premium-ssd-v2-vs-premium-ssd-1 .lk-art{padding:16px 18px 18px}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-r + .x-r{margin-top:24px}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-h{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 16px;margin:0 0 8px !important}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-n{font-weight:600;color:var(--text)}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-n .lk-mono{margin-left:8px;color:var(--muted)}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-p{font-weight:500;color:var(--muted)}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-p .lk-mono{font-weight:600;color:var(--text)}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-bar{box-sizing:border-box;height:34px;padding:3px;border:1.5px solid var(--text);border-radius:3px;background:#fff}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-bar > i{display:block;width:100%;height:100%;border-radius:1.5px;background:var(--accent)}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-bar > i.x-d{width:58.594%}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp{display:grid;grid-template-columns:58.594% minmax(0,1fr);align-items:start}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp.x-v2{align-items:center}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp > p{position:relative;margin-top:6px !important;padding-top:12px !important;font-weight:500;color:var(--text);text-align:center;text-wrap:balance}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp > p::before{content:"";position:absolute;left:0;right:3px;top:0;height:6px;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 3px 3px}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp > p + p::before{left:3px;right:0}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp > p.x-tag{justify-self:start;margin:0 0 0 14px !important;padding:3px 8px !important;border:1.5px solid var(--ln-a45);border-radius:3px;background:var(--ln-a14);text-align:left}
.fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp > p.x-tag::before{display:none}
.fg-premium-ssd-v2-vs-premium-ssd-1 p.lk-s{margin-top:12px !important}
@container (max-width:547.98px){
  .fg-premium-ssd-v2-vs-premium-ssd-1 .lk-art{padding:14px 12px 16px}
  .fg-premium-ssd-v2-vs-premium-ssd-1 .x-h{flex-direction:column;align-items:flex-start}
  .fg-premium-ssd-v2-vs-premium-ssd-1 .x-sp > p.x-tag{grid-column:1 / -1;margin:10px 0 0 !important}
}`,
  html: `<div class="lk-art"><div class="x-r"><div class="x-h"><p class="x-n">Premium SSD<span class="lk-mono">1,024 GiB</span></p><p class="x-p">Billed as P30: <span class="lk-mono">$135.17</span> a month</p></div><div class="x-bar"><i class="x-d"></i></div><div class="x-sp"><p><span class="lk-mono">600 GiB</span> data</p><p><span class="lk-mono">424 GiB</span> billed, unused</p></div></div><div class="x-r"><div class="x-h"><p class="x-n">Premium SSD v2<span class="lk-mono">600 GiB</span></p><p class="x-p">Billed per GiB: <span class="lk-mono">$48.18</span> a month</p></div><div class="x-sp x-v2"><div class="x-bar"><i></i></div><p class="x-tag"><span class="lk-mono">3,000 IOPS</span> and <span class="lk-mono">125 MB/s</span> included</p></div></div></div><p class="lk-s">A disk that needs 600 GiB, at East US list prices, October 2026.</p>`,
};
