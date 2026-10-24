import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-kubernetes-drain-node-without-downtime-1",
  label:
    "Diagram. Two timelines for one app leaving a drained node: in a plain drain with 1 replica, the old pod leaves the endpoints before the new pod is Ready on node-2, so for a while no Ready copy serves; when the new pod starts first, both copies serve until the old pod is evicted.",
  style: `.fg-kubernetes-drain-node-without-downtime-1 .dr-r + .dr-r{margin-top:16px !important;padding-top:16px !important;border-top:1px solid var(--line)}
.fg-kubernetes-drain-node-without-downtime-1 .dr-h{margin:0 0 10px !important;font-weight:600;color:var(--text);text-wrap:balance}
.fg-kubernetes-drain-node-without-downtime-1 .dr-g{display:grid;grid-template-columns:minmax(0,30fr) minmax(0,34fr) minmax(0,36fr);row-gap:6px;font-weight:500;color:var(--muted)}
.fg-kubernetes-drain-node-without-downtime-1 .dr-g > span{min-width:0;padding-right:12px;text-wrap:balance}
.fg-kubernetes-drain-node-without-downtime-1 .dr-g > .ac{font-weight:600;color:var(--accent)}
.fg-kubernetes-drain-node-without-downtime-1 .dr-g > svg{grid-column:1 / -1;grid-row:2}
.fg-kubernetes-drain-node-without-downtime-1 .r1c1{grid-row:1;grid-column:1}
.fg-kubernetes-drain-node-without-downtime-1 .r1c2{grid-row:1;grid-column:2}
.fg-kubernetes-drain-node-without-downtime-1 .r1c3{grid-row:1;grid-column:3}
.fg-kubernetes-drain-node-without-downtime-1 .r3c2{grid-row:3;grid-column:2 / -1}
.fg-kubernetes-drain-node-without-downtime-1 .r3c3{grid-row:3;grid-column:3}
.fg-kubernetes-drain-node-without-downtime-1 .dr-g > .dr-p{display:none}
.fg-kubernetes-drain-node-without-downtime-1 > .lk-t{margin-top:12px !important}
@container (max-width:419.98px){
  .fg-kubernetes-drain-node-without-downtime-1 .dr-g{grid-template-columns:56px minmax(0,1fr);grid-template-rows:minmax(0,30fr) minmax(0,34fr) minmax(0,36fr);height:180px;column-gap:14px;row-gap:0}
  .fg-kubernetes-drain-node-without-downtime-1 .dr-g > .dr-d{display:none}
  .fg-kubernetes-drain-node-without-downtime-1 .dr-g > .dr-p{display:block;grid-column:1;grid-row:1 / -1;width:56px}
  .fg-kubernetes-drain-node-without-downtime-1 .dr-g > span{grid-column:2;align-self:start;padding:0}
  .fg-kubernetes-drain-node-without-downtime-1 .p1{grid-row:1}
  .fg-kubernetes-drain-node-without-downtime-1 .p2{grid-row:2}
  .fg-kubernetes-drain-node-without-downtime-1 .p3{grid-row:3}
  .fg-kubernetes-drain-node-without-downtime-1 .dr-g > .pm{align-self:center}
  .fg-kubernetes-drain-node-without-downtime-1 .dr-g > .pe{align-self:end}
}`,
  html: `<div class="lk-art"><div class="dr-r"><p class="dr-h">Plain drain, 1 replica</p><div class="dr-g"><svg class="lk-svg dr-d" viewBox="0 0 480 36" style="aspect-ratio:480/36" aria-hidden="true" focusable="false"><rect class="a" x="144" y="0.75" width="163.2" height="34.5" rx="3"/><rect class="g" x="0.75" y="4.75" width="139.5" height="9.5" rx="2.5"/><rect class="uk" x="310.2" y="21" width="169.8" height="11" rx="3"/></svg><svg class="lk-svg dr-p" viewBox="0 0 56 180" style="aspect-ratio:56/180" aria-hidden="true" focusable="false"><rect class="a" x="0.75" y="54" width="54.5" height="61.2" rx="3"/><rect class="g" x="7.75" y="0.75" width="14.5" height="50.25" rx="2.5"/><rect class="uk" x="33" y="118.2" width="16" height="61.8" rx="3"/></svg><span class="r1c1 p1">old pod: Terminating, out of endpoints</span><span class="ac r1c2 p2 pm">no Ready copy: downtime</span><span class="r3c3 p3">new pod: Ready on node-2</span></div></div><div class="dr-r"><p class="dr-h">New pod first (rolling restart or warm handover)</p><div class="dr-g"><svg class="lk-svg dr-d" viewBox="0 0 480 36" style="aspect-ratio:480/36" aria-hidden="true" focusable="false"><rect class="uk" x="0" y="4" width="307.2" height="11" rx="3"/><rect class="uk" x="144" y="21" width="336" height="11" rx="3"/><rect class="ad" x="140" y="0.75" width="171.2" height="34.5" rx="3"/></svg><svg class="lk-svg dr-p" viewBox="0 0 56 180" style="aspect-ratio:56/180" aria-hidden="true" focusable="false"><rect class="uk" x="7" y="0" width="16" height="115.2" rx="3"/><rect class="uk" x="33" y="54" width="16" height="126" rx="3"/><rect class="ad" x="0.75" y="50" width="54.5" height="69.2" rx="3"/></svg><span class="r1c1 p1">old pod: still serving</span><span class="ac r1c2 p2 pm">two copies serving</span><span class="r1c3 p3">old pod evicted</span><span class="r3c2 p2">new pod: Ready on node-2</span></div></div></div><p class="lk-t">Downtime is the gap between the old copy leaving and the new copy being Ready.</p>`,
};
