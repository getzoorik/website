import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-kubernetes-allocatable-vs-capacity-2",
  label:
    "Diagram. On one 16 GB AKS node, raising max pods from 30 to 110 to 250 raises kube-reserved from 0.65 GB to 2.25 GB to 4 GB, the 25% cap, so allocatable falls from 15.25 GB to 13.65 GB to 11.9 GB; eviction takes 0.1 GB each time.",
  style: `.fg-kubernetes-allocatable-vs-capacity-2 .fk-r + .fk-r{margin-top:16px}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-l{margin:0 0 8px;font-weight:600;color:var(--text)}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-l > span + span{font-weight:500;color:var(--muted)}
.fg-kubernetes-allocatable-vs-capacity-2 .lk-svg .mu{fill:var(--muted);stroke:none}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-v{display:flex;justify-content:space-between;gap:16px;margin-top:8px}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-i{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-a .lk-mono{color:var(--accent)}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-cap{margin-left:2px;padding:0 6px;border:1px solid var(--line);border-radius:var(--r-ctl);background:#fff;font-weight:500;color:var(--text)}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-k{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:12px;font-weight:500;color:var(--text)}
.fg-kubernetes-allocatable-vs-capacity-2 .fk-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-kubernetes-allocatable-vs-capacity-2 .sw-u{background:var(--accent)}
.fg-kubernetes-allocatable-vs-capacity-2 .sw-uk{background:var(--text)}
.fg-kubernetes-allocatable-vs-capacity-2 .sw-mu{background:var(--muted)}
.fg-kubernetes-allocatable-vs-capacity-2 p.lk-t{margin-top:12px !important}`,
  html: `
<div class="lk-art" style="--cap:100%">
<div class="fk-r"><p class="fk-l"><span>Max pods <span class="lk-mono">30</span></span></p><svg class="lk-svg" viewBox="0 0 400 16" style="aspect-ratio:400/16" aria-hidden="true" focusable="false"><rect class="u" x="0" y="0" width="380.45" height="16" rx="3"/><rect class="uk" x="382.05" y="0" width="14.65" height="16" rx="3"/><rect class="mu" x="398.3" y="0" width="1.7" height="16" rx="0.85"/></svg><div class="fk-v"><span class="fk-i fk-a"><i class="fk-sw sw-u"></i><span class="lk-mono">15.25 GB</span></span><span class="fk-i"><i class="fk-sw sw-uk"></i><span class="lk-mono">0.65 GB</span></span></div></div>
<div class="fk-r"><p class="fk-l"><span>Max pods <span class="lk-mono">110</span></span></p><svg class="lk-svg" viewBox="0 0 400 16" style="aspect-ratio:400/16" aria-hidden="true" focusable="false"><rect class="u" x="0" y="0" width="340.45" height="16" rx="3"/><rect class="uk" x="342.05" y="0" width="54.65" height="16" rx="3"/><rect class="mu" x="398.3" y="0" width="1.7" height="16" rx="0.85"/></svg><div class="fk-v"><span class="fk-i fk-a"><i class="fk-sw sw-u"></i><span class="lk-mono">13.65 GB</span></span><span class="fk-i"><i class="fk-sw sw-uk"></i><span class="lk-mono">2.25 GB</span></span></div></div>
<div class="fk-r"><p class="fk-l"><span>Max pods <span class="lk-mono">250</span></span> <span>(Azure CNI Overlay default)</span></p><svg class="lk-svg" viewBox="0 0 400 16" style="aspect-ratio:400/16" aria-hidden="true" focusable="false"><rect class="u" x="0" y="0" width="296.7" height="16" rx="3"/><rect class="uk" x="298.3" y="0" width="98.4" height="16" rx="3"/><rect class="mu" x="398.3" y="0" width="1.7" height="16" rx="0.85"/></svg><div class="fk-v"><span class="fk-i fk-a"><i class="fk-sw sw-u"></i><span class="lk-mono">11.9 GB</span></span><span class="fk-i"><i class="fk-sw sw-uk"></i><span class="lk-mono">4 GB</span><span class="fk-cap">25% cap</span></span></div></div>
</div>
<div class="fk-k"><span class="fk-i"><i class="fk-sw sw-u"></i>Allocatable</span><span class="fk-i"><i class="fk-sw sw-uk"></i>kube-reserved</span><span class="fk-i"><i class="fk-sw sw-mu"></i><span>Eviction: <span class="lk-mono">0.1 GB</span></span></span></div>
<p class="lk-t">One 16 GB AKS node by Microsoft's 1.29+ formula</p><p class="lk-s">Worked from the formula. Read your own node's figures with kubectl.</p>
`,
};
