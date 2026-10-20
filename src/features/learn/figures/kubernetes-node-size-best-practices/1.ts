import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-kubernetes-node-size-best-practices-1",
  label:
    "Diagram. Two bars of 16 CPU cores each: four 4-core AKS nodes reserve 140m of CPU each, 560m in total, while one 16-core AKS node reserves 260m.",
  style: `.fg-kubernetes-node-size-best-practices-1 .ns-b + .ns-b{margin-top:18px !important}
.fg-kubernetes-node-size-best-practices-1 .ns-h{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 16px;margin:0 0 8px !important;font-weight:600;color:var(--text)}
.fg-kubernetes-node-size-best-practices-1 .ns-h > span + span{color:var(--accent)}
.fg-kubernetes-node-size-best-practices-1 .ns-h .lk-mono{font-weight:600;color:inherit}
.fg-kubernetes-node-size-best-practices-1 .lk-svg .ol{fill:none;stroke:var(--text)}
.fg-kubernetes-node-size-best-practices-1 .ns-l{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:6px !important;font-weight:500;color:var(--muted);text-align:right}
.fg-kubernetes-node-size-best-practices-1 .ns-l .lk-mono{color:inherit}
.fg-kubernetes-node-size-best-practices-1 .ns-p{display:none}
.fg-kubernetes-node-size-best-practices-1 > .lk-s{margin-top:12px !important}
@container (max-width:419.98px){
  .fg-kubernetes-node-size-best-practices-1 .ns-d{display:none}
  .fg-kubernetes-node-size-best-practices-1 .ns-p{display:block}
  .fg-kubernetes-node-size-best-practices-1 .ns-l > span > span{display:block}
}`,
  html: `<div class="lk-art" style="--cap:100%"><div class="ns-b"><p class="ns-h"><span>Four 4-core AKS nodes</span><span><span class="lk-mono">560m</span> reserved</span></p><svg class="lk-svg ns-d" viewBox="0 0 480 20" style="aspect-ratio:480/20" aria-hidden="true" focusable="false"><rect class="k" x="0" y="1" width="480" height="18" rx="3"/><rect class="ol" x="0" y="1" width="480" height="18" rx="3"/><path class="ol" d="M120 1v18M240 1v18M360 1v18"/><rect class="u" x="115.8" y="1" width="4.2" height="18"/><rect class="u" x="235.8" y="1" width="4.2" height="18"/><rect class="u" x="355.8" y="1" width="4.2" height="18"/><path class="u" d="M475.8 1H477a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-1.2z"/></svg><svg class="lk-svg ns-p" viewBox="0 0 280 20" style="aspect-ratio:280/20" aria-hidden="true" focusable="false"><rect class="k" x="0" y="1" width="280" height="18" rx="3"/><rect class="ol" x="0" y="1" width="280" height="18" rx="3"/><path class="ol" d="M70 1v18M140 1v18M210 1v18"/><rect class="u" x="67.55" y="1" width="2.45" height="18"/><rect class="u" x="137.55" y="1" width="2.45" height="18"/><rect class="u" x="207.55" y="1" width="2.45" height="18"/><path class="u" d="M277.55 1.05A3 3 0 0 1 280 4v12a3 3 0 0 1-2.45 2.95z"/></svg><p class="ns-l"><span><span class="lk-mono">140m</span> <span>reserved</span></span><span><span class="lk-mono">140m</span> <span>reserved</span></span><span><span class="lk-mono">140m</span> <span>reserved</span></span><span><span class="lk-mono">140m</span> <span>reserved</span></span></p></div><div class="ns-b"><p class="ns-h"><span>One 16-core AKS node</span><span><span class="lk-mono">260m</span> reserved</span></p><svg class="lk-svg ns-d" viewBox="0 0 480 20" style="aspect-ratio:480/20" aria-hidden="true" focusable="false"><rect class="k" x="0" y="1" width="480" height="18" rx="3"/><rect class="ol" x="0" y="1" width="480" height="18" rx="3"/><path class="u" d="M472.2 1H477a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-4.8z"/></svg><svg class="lk-svg ns-p" viewBox="0 0 280 20" style="aspect-ratio:280/20" aria-hidden="true" focusable="false"><rect class="k" x="0" y="1" width="280" height="18" rx="3"/><rect class="ol" x="0" y="1" width="280" height="18" rx="3"/><path class="u" d="M275.45 1H277a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-1.55z"/></svg></div></div><p class="lk-s">CPU reserves from Microsoft's AKS table. Each DaemonSet also runs four copies on the top bar and one on the bottom.</p>`,
};
