import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-hpa-vs-vpa-vs-cluster-autoscaler-1",
  label:
    "Diagram. Three layers, pod count set by the HPA, pod size set by the VPA and node count set by the Cluster Autoscaler, Karpenter or NAP, all read requests: the HPA works out utilization as usage divided by request, and node autoscalers count nodes by requests, not use.",
  style: `.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1{display:grid;grid-template-columns:minmax(0,1fr) 212px 88px;row-gap:10px}
.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-l{position:relative;grid-column:1;display:grid;grid-template-columns:104px minmax(0,1fr);align-items:center;gap:16px;padding:12px 16px 12px 14px;border-radius:var(--r-card);background:var(--surface-2)}
.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-l .lk-svg{width:104px}
.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1 .lk-t{margin:0 !important}
.ln-d.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 p.f1-n{position:absolute;left:100%;bottom:calc(50% + 7px);width:212px;padding:0 14px 0 18px;text-align:center;text-wrap:balance}
.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-k{white-space:nowrap}
.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-ar{position:relative;grid-column:2;align-self:center;height:0;margin:0 6px;border-top:1.5px solid var(--muted)}
.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-ar::before{content:"";position:absolute;left:1px;top:-5px;width:7px;height:7px;border-left:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-rq{grid-column:3;grid-row:1/4;display:grid;place-items:center;border:1.5px solid var(--ln-a45);border-radius:3px;background:var(--ln-a14);font-weight:600;color:var(--text)}
@container (max-width:419.98px){
  .fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1{grid-template-columns:minmax(0,1fr) 22px 34px}
  .fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-l{grid-template-columns:64px minmax(0,1fr);gap:12px;padding:12px}
  .fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-l .lk-svg{width:64px}
  .ln-d.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 p.f1-n{position:static;width:auto;margin-top:4px !important;padding:0;text-align:left}
  .fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-ar{margin:0 3px}
  .fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-rq span{writing-mode:vertical-rl;transform:rotate(180deg)}
}
@media (forced-colors:active){.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-l,.fg-hpa-vs-vpa-vs-cluster-autoscaler-1 .f1-rq{border:1px solid CanvasText}}`,
  html: `<div class="f1"><div class="f1-l" style="grid-row:1"><svg class="lk-svg" viewBox="0 0 120 64" style="aspect-ratio:120/64" aria-hidden="true" focusable="false"><rect class="k" x="8" y="6" width="20" height="36" rx="3"/><rect class="uk" x="11" y="23" width="14" height="16" rx="1.5"/><rect class="k" x="36" y="6" width="20" height="36" rx="3"/><rect class="uk" x="39" y="23" width="14" height="16" rx="1.5"/><rect class="k" x="64" y="6" width="20" height="36" rx="3"/><rect class="uk" x="67" y="23" width="14" height="16" rx="1.5"/><rect class="k" x="92" y="6" width="20" height="36" rx="3"/><rect class="uk" x="95" y="23" width="14" height="16" rx="1.5"/><path class="m" d="M8 54h104M11.5 50.5 8 54l3.5 3.5M108.5 50.5 112 54l-3.5 3.5"/></svg><div><p class="lk-t">Pod count: HPA</p><p class="lk-s f1-n">utilization = <span class="f1-k">usage ÷ request</span></p></div></div><span class="f1-ar" style="grid-row:1" aria-hidden="true"></span><div class="f1-l" style="grid-row:2"><svg class="lk-svg" viewBox="0 0 120 64" style="aspect-ratio:120/64" aria-hidden="true" focusable="false"><rect class="g" x="38" y="4" width="28" height="56" rx="3"/><rect class="a" x="38" y="26" width="28" height="34" rx="3"/><rect class="u" x="41" y="38" width="22" height="19" rx="1.5"/><path class="m" d="M86 6v52M82.5 9.5 86 6l3.5 3.5M82.5 54.5 86 58l3.5-3.5"/></svg><div><p class="lk-t">Pod size: VPA</p></div></div><div class="f1-l" style="grid-row:3"><svg class="lk-svg" viewBox="0 0 120 64" style="aspect-ratio:120/64" aria-hidden="true" focusable="false"><rect class="n" x="8" y="6" width="30" height="36" rx="3"/><rect class="a" x="12" y="14" width="10" height="24" rx="2"/><rect class="a" x="24" y="14" width="10" height="24" rx="2"/><rect class="n" x="45" y="6" width="30" height="36" rx="3"/><rect class="a" x="49" y="14" width="10" height="24" rx="2"/><rect class="a" x="61" y="14" width="10" height="24" rx="2"/><rect class="n" x="82" y="6" width="30" height="36" rx="3"/><rect class="a" x="86" y="14" width="10" height="24" rx="2"/><rect class="a" x="98" y="14" width="10" height="24" rx="2"/><path class="m" d="M8 54h104M11.5 50.5 8 54l3.5 3.5M108.5 50.5 112 54l-3.5 3.5"/></svg><div><p class="lk-t">Node count: Cluster Autoscaler, Karpenter, NAP</p><p class="lk-s f1-n">nodes are counted by requests, not use</p></div></div><span class="f1-ar" style="grid-row:3" aria-hidden="true"></span><div class="f1-rq"><span>Requests</span></div></div>`,
};
