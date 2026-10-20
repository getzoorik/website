import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-io2-vs-gp3-1",
  label:
    "Diagram. Monthly list price of one 1,000 GiB volume in US East (N. Virginia), October 2026: at 3,000 IOPS gp3 costs $80 and io2 $320; at 16,000 IOPS gp3 $160 with 500 MiB/s and io2 $1,165; at 80,000 IOPS gp3 $540 with 2,000 MiB/s and io2 about $4,189; at 256,000 IOPS gp3 is not available and io2 costs about $9,821.",
  style: `.fg-io2-vs-gp3-1 .x-h{margin:0 0 14px !important;font-weight:600;color:var(--text)}
.fg-io2-vs-gp3-1 .x-g{display:grid;grid-template-columns:104px 30px minmax(0,1fr);align-items:center;column-gap:12px;row-gap:5px}
.fg-io2-vs-gp3-1 .x-g + .x-g{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
.fg-io2-vs-gp3-1 .x-k{grid-row:span 2;font-weight:600;color:var(--text)}
.fg-io2-vs-gp3-1 .x-k .lk-mono{font-weight:600}
.fg-io2-vs-gp3-1 .x-n{font-family:var(--code);font-weight:500;color:var(--text)}
.fg-io2-vs-gp3-1 .x-b{display:flex;align-items:center;gap:8px;min-width:0;min-height:20px}
.fg-io2-vs-gp3-1 .x-b > svg.lk-svg{flex:none;width:max(2px,calc((100% - 96px) * var(--p)));height:16px;margin:0}
.fg-io2-vs-gp3-1 .x-v{font-weight:500;color:var(--text);white-space:nowrap}
.fg-io2-vs-gp3-1 .x-v .x-m,.fg-io2-vs-gp3-1 .x-v .x-m .lk-mono,.fg-io2-vs-gp3-1 .x-na{color:var(--muted)}
.fg-io2-vs-gp3-1 .x-na{font-weight:500}
.fg-io2-vs-gp3-1 p.lk-s{margin-top:10px !important}
@container (max-width:419.98px){
  .fg-io2-vs-gp3-1 .x-g{grid-template-columns:30px minmax(0,1fr);row-gap:4px}
  .fg-io2-vs-gp3-1 .x-k{grid-row:auto;grid-column:1 / -1;margin-bottom:2px}
  .fg-io2-vs-gp3-1 .x-b > svg.lk-svg{height:14px}
}`,
  html: `<div class="lk-art" style="--cap:100%"><p class="x-h">Monthly list price, one 1,000&nbsp;GiB volume</p><div class="x-g"><p class="x-k"><span class="lk-mono">3,000</span> IOPS</p><p class="x-n">gp3</p><p class="x-b" style="--p:0.00815"><svg class="lk-svg" aria-hidden="true" focusable="false"><rect class="uk" width="100%" height="100%" rx="3"/></svg><span class="x-v"><span class="lk-mono">$80</span></span></p><p class="x-n">io2</p><p class="x-b" style="--p:0.03258"><svg class="lk-svg" aria-hidden="true" focusable="false"><rect class="u" width="100%" height="100%" rx="3"/></svg><span class="x-v"><span class="lk-mono">$320</span></span></p></div><div class="x-g"><p class="x-k"><span class="lk-mono">16,000</span> IOPS</p><p class="x-n">gp3</p><p class="x-b" style="--p:0.01629"><svg class="lk-svg" aria-hidden="true" focusable="false"><rect class="uk" width="100%" height="100%" rx="3"/></svg><span class="x-v"><span class="lk-mono">$160</span> <span class="x-m">(<span class="lk-mono">500</span> MiB/s)</span></span></p><p class="x-n">io2</p><p class="x-b" style="--p:0.11862"><svg class="lk-svg" aria-hidden="true" focusable="false"><rect class="u" width="100%" height="100%" rx="3"/></svg><span class="x-v"><span class="lk-mono">$1,165</span></span></p></div><div class="x-g"><p class="x-k"><span class="lk-mono">80,000</span> IOPS</p><p class="x-n">gp3</p><p class="x-b" style="--p:0.05498"><svg class="lk-svg" aria-hidden="true" focusable="false"><rect class="uk" width="100%" height="100%" rx="3"/></svg><span class="x-v"><span class="lk-mono">$540</span> <span class="x-m">(<span class="lk-mono">2,000</span> MiB/s)</span></span></p><p class="x-n">io2</p><p class="x-b" style="--p:0.42653"><svg class="lk-svg" aria-hidden="true" focusable="false"><rect class="u" width="100%" height="100%" rx="3"/></svg><span class="x-v">about <span class="lk-mono">$4,189</span></span></p></div><div class="x-g"><p class="x-k"><span class="lk-mono">256,000</span> IOPS</p><p class="x-n">gp3</p><p class="x-b"><span class="x-na">Not available</span></p><p class="x-n">io2</p><p class="x-b" style="--p:1"><svg class="lk-svg" aria-hidden="true" focusable="false"><rect class="u" width="100%" height="100%" rx="3"/></svg><span class="x-v">about <span class="lk-mono">$9,821</span></span></p></div></div><p class="lk-s">US East (N. Virginia), October 2026.</p>`,
};
