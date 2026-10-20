import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-cluster-autoscaler-not-scaling-down-1",
  label:
    "Diagram. A node with 4 CPU allocatable whose pods request 2.2 CPU (55%) and use 0.3 CPU: the requests pass the 0.5 scale-down threshold, so the Cluster Autoscaler keeps the node.",
  style: `.fg-cluster-autoscaler-not-scaling-down-1 .x-h{margin:0 0 6px;font-weight:600;color:var(--text)}
.fg-cluster-autoscaler-not-scaling-down-1 .x-th{margin:0 0 4px;text-align:center;font-weight:500;color:var(--text)}
.fg-cluster-autoscaler-not-scaling-down-1 .x-nar{display:none !important}
.fg-cluster-autoscaler-not-scaling-down-1 .x-key{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:16px;font-weight:500;color:var(--text)}
.fg-cluster-autoscaler-not-scaling-down-1 .x-key > span{display:inline-flex;align-items:center;gap:8px}
.fg-cluster-autoscaler-not-scaling-down-1 .x-sw{flex:none;box-sizing:border-box;width:12px;height:12px;border-radius:3px}
.fg-cluster-autoscaler-not-scaling-down-1 .x-sw.a{border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.fg-cluster-autoscaler-not-scaling-down-1 .x-sw.u{background:var(--accent)}
@container (max-width:419.98px){
  .fg-cluster-autoscaler-not-scaling-down-1 .x-wide{display:none !important}
  .fg-cluster-autoscaler-not-scaling-down-1 .x-nar{display:block !important}
  .fg-cluster-autoscaler-not-scaling-down-1 .x-key{flex-direction:column}
}`,
  html: `<div class="lk-art" style="--cap:100%"><p class="x-h">Allocatable: <span class="lk-mono">4 CPU</span></p><p class="x-th">Scale-down threshold <span class="lk-mono">0.5</span></p><svg class="lk-svg x-wide" viewBox="0 0 480 42" style="aspect-ratio:480/42" aria-hidden="true" focusable="false"><rect class="n" x="0" y="6" width="480" height="30" rx="3"/><rect class="a" x="0" y="6" width="264" height="30" rx="3"/><rect class="u" x="3" y="10" width="33" height="22" rx="1.5"/><path class="g" d="M240 0v39"/></svg><svg class="lk-svg x-nar" viewBox="0 0 480 62" style="aspect-ratio:480/62" aria-hidden="true" focusable="false"><rect class="n" x="0" y="8" width="480" height="46" rx="5"/><rect class="a" x="0" y="8" width="264" height="46" rx="5"/><rect class="u" x="5" y="14" width="31" height="34" rx="2.5"/><path class="g" d="M240 0v58"/></svg><p class="x-key"><span><span class="x-sw a"></span><span>Requests: <span class="lk-mono">2.2 CPU</span> (55%)</span></span><span><span class="x-sw u"></span><span>Real use: <span class="lk-mono">0.3 CPU</span></span></span></p></div><p class="lk-t">The Cluster Autoscaler reads requests, so this node stays.</p>`,
};
