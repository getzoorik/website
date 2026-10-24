import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-karpenter-cost-optimization-1",
  label:
    "Diagram. What Karpenter has to buy room for, for the same 30 replicas: with requests as set, 30 CPU requested with 7.5 CPU used at peak inside it; with requests near use, 9 CPU requested with the same 7.5 CPU used at peak inside it. An illustration, not a measurement.",
  style: `.fg-karpenter-cost-optimization-1 .x-hl{margin:0 0 12px !important;font-weight:500;color:var(--muted)}
.fg-karpenter-cost-optimization-1 .x-r + .x-r{margin-top:16px}
.fg-karpenter-cost-optimization-1 .x-rh{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 16px;margin:0 0 7px !important}
.fg-karpenter-cost-optimization-1 .x-n{font-weight:600;color:var(--text)}
.fg-karpenter-cost-optimization-1 .x-v{display:flex;flex-wrap:wrap;gap:2px 16px;font-weight:500;color:var(--muted)}
.fg-karpenter-cost-optimization-1 .x-v > span{display:inline-flex;align-items:center;gap:7px}
.fg-karpenter-cost-optimization-1 .x-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-karpenter-cost-optimization-1 .sw-a{border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.fg-karpenter-cost-optimization-1 .sw-u{background:var(--accent)}
.fg-karpenter-cost-optimization-1 .x-nr{display:none !important}
@container (max-width:419.98px){
  .fg-karpenter-cost-optimization-1 .x-rh{flex-direction:column;align-items:flex-start;gap:2px}
  .fg-karpenter-cost-optimization-1 .x-v{flex-direction:column}
  .fg-karpenter-cost-optimization-1 .x-wd{display:none !important}
  .fg-karpenter-cost-optimization-1 .x-nr{display:block !important}
}`,
  html: `<div class="lk-art" style="--cap:100%"><p class="x-hl">The same 30 replicas</p><div class="x-r"><p class="x-rh"><span class="x-n">Requests as set</span><span class="x-v"><span><i class="x-sw sw-a"></i><span><span class="lk-mono">30 CPU</span> requested</span></span><span><i class="x-sw sw-u"></i><span><span class="lk-mono">7.5 CPU</span> used at peak</span></span></span></p><svg class="lk-svg x-wd" viewBox="0 0 480 20" style="aspect-ratio:480/20" aria-hidden="true" focusable="false"><rect class="a" x="0" y="0" width="480" height="20" rx="3"/><rect class="u" x="3" y="3" width="117" height="14" rx="1.5"/></svg><svg class="lk-svg x-nr" viewBox="0 0 480 30" style="aspect-ratio:480/30" aria-hidden="true" focusable="false"><rect class="a" x="0" y="0" width="480" height="30" rx="5"/><rect class="u" x="5" y="5" width="115" height="20" rx="2.5"/></svg></div><div class="x-r"><p class="x-rh"><span class="x-n">Requests near use</span><span class="x-v"><span><i class="x-sw sw-a"></i><span><span class="lk-mono">9 CPU</span> requested</span></span><span><i class="x-sw sw-u"></i><span><span class="lk-mono">7.5 CPU</span> used at peak</span></span></span></p><svg class="lk-svg x-wd" viewBox="0 0 480 20" style="aspect-ratio:480/20" aria-hidden="true" focusable="false"><rect class="a" x="0" y="0" width="144" height="20" rx="3"/><rect class="u" x="3" y="3" width="117" height="14" rx="1.5"/></svg><svg class="lk-svg x-nr" viewBox="0 0 480 30" style="aspect-ratio:480/30" aria-hidden="true" focusable="false"><rect class="a" x="0" y="0" width="144" height="30" rx="5"/><rect class="u" x="5" y="5" width="115" height="20" rx="2.5"/></svg></div></div><p class="lk-t">What Karpenter has to buy room for</p><p class="lk-s">Illustration, not a measurement.</p>`,
};
