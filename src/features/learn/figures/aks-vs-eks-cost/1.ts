import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-aks-vs-eks-cost-1",
  label:
    "Diagram. Monthly cost of one cluster with ten 4 vCPU, 16 GiB nodes at $0.192 an hour over 730 hours: the nodes come to $1,401.60 in every case, and the control plane adds $0 on AKS Free, $73 on AKS Standard or EKS standard support, and $438 on AKS Premium or EKS extended support.",
  style: `.fg-aks-vs-eks-cost-1 .x-h{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 20px;margin:0 0 16px !important}
.fg-aks-vs-eks-cost-1 .x-hl{font-weight:600;color:var(--text)}
.fg-aks-vs-eks-cost-1 .x-fk{display:flex;flex-wrap:wrap;gap:4px 16px;font-weight:500;color:var(--muted)}
.fg-aks-vs-eks-cost-1 .x-fk > span,.fg-aks-vs-eks-cost-1 .x-v > span{display:inline-flex;align-items:center;gap:7px}
.fg-aks-vs-eks-cost-1 .x-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-aks-vs-eks-cost-1 .sw-uk{background:var(--text)}
.fg-aks-vs-eks-cost-1 .sw-u{background:var(--accent)}
.fg-aks-vs-eks-cost-1 .x-r + .x-r{margin-top:16px}
.fg-aks-vs-eks-cost-1 .x-rh{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 16px;margin:0 0 7px !important}
.fg-aks-vs-eks-cost-1 .x-n{font-weight:600;color:var(--text)}
.fg-aks-vs-eks-cost-1 .x-v{display:flex;gap:16px}
.fg-aks-vs-eks-cost-1 p.lk-s{margin-top:12px !important}
.fg-aks-vs-eks-cost-1 .x-v > span:last-child{min-width:50px}
@container (max-width:419.98px){.fg-aks-vs-eks-cost-1 .x-rh{flex-direction:column;align-items:flex-start}}`,
  html: `<div class="lk-art" style="--cap:100%"><div class="x-h"><p class="x-hl">Monthly cost of one cluster</p><p class="x-fk"><span><i class="x-sw sw-uk"></i>Nodes</span><span><i class="x-sw sw-u"></i>Control plane</span></p></div><div class="x-r"><p class="x-rh"><span class="x-n">AKS Free</span><span class="x-v"><span><i class="x-sw sw-uk"></i><span class="lk-mono">$1,401.60</span></span><span><i class="x-sw sw-u"></i><span class="lk-mono">$0</span></span></span></p><svg class="lk-svg" viewBox="0 0 480 18" style="aspect-ratio:480/18" aria-hidden="true" focusable="false"><rect class="uk" x="0" y="0" width="364.21" height="18" rx="3"/></svg></div><div class="x-r"><p class="x-rh"><span class="x-n">AKS Standard or EKS standard support</span><span class="x-v"><span><i class="x-sw sw-uk"></i><span class="lk-mono">$1,401.60</span></span><span><i class="x-sw sw-u"></i><span class="lk-mono">$73</span></span></span></p><svg class="lk-svg" viewBox="0 0 480 18" style="aspect-ratio:480/18" aria-hidden="true" focusable="false"><rect class="uk" x="0" y="0" width="364.21" height="18" rx="3"/><rect class="u" x="367.21" y="0" width="17.55" height="18" rx="3"/></svg></div><div class="x-r"><p class="x-rh"><span class="x-n">AKS Premium or EKS extended support</span><span class="x-v"><span><i class="x-sw sw-uk"></i><span class="lk-mono">$1,401.60</span></span><span><i class="x-sw sw-u"></i><span class="lk-mono">$438</span></span></span></p><svg class="lk-svg" viewBox="0 0 480 18" style="aspect-ratio:480/18" aria-hidden="true" focusable="false"><rect class="uk" x="0" y="0" width="364.21" height="18" rx="3"/><rect class="u" x="367.21" y="0" width="112.79" height="18" rx="3"/></svg></div></div><p class="lk-s">Ten 4&nbsp;vCPU, 16&nbsp;GiB nodes at $0.192 an hour over 730 hours.</p>`,
};
