import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-karpenter-vs-cluster-autoscaler-1",
  label:
    "Diagram. Two nodes, 8 CPU allocatable each, 1.5 CPU requested on each. The Cluster Autoscaler removes node A after 10 minutes unneeded and keeps node B, an 8 CPU machine with 3 CPU requested (37.5%), the same machine size. Karpenter deletes node A and replaces node B with one 4-CPU node with 3 CPU requested, one cheaper node, if the NodePool allows it. An illustration, not a measurement.",
  style: `.ln-d.fg-karpenter-vs-cluster-autoscaler-1 p.x-h{margin-bottom:12px !important;font-weight:600;color:var(--text);text-wrap:balance}
.fg-karpenter-vs-cluster-autoscaler-1 .x-cols{grid-template-columns:repeat(2,minmax(0,1fr))}
.fg-karpenter-vs-cluster-autoscaler-1 .x-cols > div{display:flex;flex-direction:column}
.fg-karpenter-vs-cluster-autoscaler-1 .x-cols .lk-art{flex:1 1 auto}
.ln-d.fg-karpenter-vs-cluster-autoscaler-1 p.x-ct{margin-bottom:10px !important;font-weight:600;color:var(--text)}
.fg-karpenter-vs-cluster-autoscaler-1 .x-ns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.fg-karpenter-vs-cluster-autoscaler-1 .x-n .lk-svg{width:64px;margin:0 auto}
.ln-d.fg-karpenter-vs-cluster-autoscaler-1 p.x-nm{margin-top:8px !important;text-align:center;font-weight:600;color:var(--text)}
.ln-d.fg-karpenter-vs-cluster-autoscaler-1 p.x-l{margin-top:1px !important;text-align:center;font-weight:500;color:var(--muted);text-wrap:balance}
.ln-d.fg-karpenter-vs-cluster-autoscaler-1 p.x-cap{margin-top:14px !important}
@container (max-width:479.98px){
  .fg-karpenter-vs-cluster-autoscaler-1 .x-cols{grid-template-columns:minmax(0,1fr);gap:16px}
}`,
  html: `<p class="x-h">Two nodes, 8&nbsp;CPU allocatable each, 1.5&nbsp;CPU requested on each</p><div class="lk-vh x-cols"><div><div class="lk-art"><p class="x-ct">Cluster Autoscaler</p><div class="x-ns"><div class="x-n"><svg class="lk-svg" viewBox="0 0 64 104" style="aspect-ratio:64/104" aria-hidden="true" focusable="false"><rect class="g" x="10" y="4" width="44" height="96" rx="3"/></svg><p class="x-nm">Node A</p><p class="x-l">Removed after 10&nbsp;minutes unneeded</p></div><div class="x-n"><svg class="lk-svg" viewBox="0 0 64 104" style="aspect-ratio:64/104" aria-hidden="true" focusable="false"><rect class="n" x="10" y="4" width="44" height="96" rx="3"/><path class="n" d="M13 52 h38"/><path class="n" d="M13 40.75 h38"/><path class="n" d="M13 29.5 h38"/><path class="n" d="M13 18.25 h38"/><rect class="u" x="13" y="63.25" width="38" height="33.75" rx="1.5"/></svg><p class="x-nm">Node B</p><p class="x-l">Kept: 8&nbsp;CPU, 3&nbsp;CPU requested (37.5%)</p></div></div></div><p class="lk-t">Same machine size</p></div><div><div class="lk-art"><p class="x-ct">Karpenter</p><div class="x-ns"><div class="x-n"><svg class="lk-svg" viewBox="0 0 64 104" style="aspect-ratio:64/104" aria-hidden="true" focusable="false"><rect class="g" x="10" y="4" width="44" height="96" rx="3"/></svg><p class="x-nm">Node A</p><p class="x-l">Deleted</p></div><div class="x-n"><svg class="lk-svg" viewBox="0 0 64 104" style="aspect-ratio:64/104" aria-hidden="true" focusable="false"><rect class="n" x="10" y="49" width="44" height="51" rx="3"/><rect class="u" x="13" y="63.25" width="38" height="33.75" rx="1.5"/></svg><p class="x-nm">Node B</p><p class="x-l">Replaced by one 4-CPU node, 3&nbsp;CPU requested</p></div></div></div><p class="lk-t">One cheaper node, if the NodePool allows it</p></div></div><p class="lk-s x-cap">Illustration, not a measurement. Memory and DaemonSet requests assumed small.</p>`,
};
