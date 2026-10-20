import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-change-eks-node-group-instance-type-1",
  label:
    "Diagram. Three stages: create ng-new on m7i.large beside ng-old on m5.xlarge, all nodes Ready; cordon and drain the old nodes, now SchedulingDisabled, moving their pods into ng-new one node at a time within each PDB; then delete ng-old once it is empty, with every pod on ng-new.",
  style: `.fg-change-eks-node-group-instance-type-1 .x-st{display:grid;gap:26px}
.fg-change-eks-node-group-instance-type-1 .x-st > li{position:relative;min-width:0}
.fg-change-eks-node-group-instance-type-1 .x-p{display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"t" "s" "b";align-content:start;row-gap:10px;padding:12px 12px 14px;text-align:center}
.fg-change-eks-node-group-instance-type-1 .x-p .lk-svg{grid-area:s;max-width:180px}
.fg-change-eks-node-group-instance-type-1 .x-t{grid-area:t}
.fg-change-eks-node-group-instance-type-1 .x-b{grid-area:b}
.fg-change-eks-node-group-instance-type-1 .x-gn,.fg-change-eks-node-group-instance-type-1 .x-gs{display:block;line-height:1.45;white-space:nowrap}
.fg-change-eks-node-group-instance-type-1 .x-gn{font-family:var(--code);font-size:.95em;font-weight:500;color:var(--text)}
.fg-change-eks-node-group-instance-type-1 .x-gs{font-weight:500;color:var(--muted)}
.fg-change-eks-node-group-instance-type-1 .x-gs.x-c{font-family:var(--code);font-size:.95em}
.fg-change-eks-node-group-instance-type-1 .x-off .x-gn{color:var(--muted)}
.fg-change-eks-node-group-instance-type-1 .x-fade{opacity:.4}
.fg-change-eks-node-group-instance-type-1 .lk-num{margin-right:.3em}
.fg-change-eks-node-group-instance-type-1 .x-n{margin-top:2px !important}
.fg-change-eks-node-group-instance-type-1 .x-st > li:not(:last-child)::after{content:"";position:absolute;left:74px;bottom:-17px;width:6px;height:6px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
@container (max-width:547.98px){
  .fg-change-eks-node-group-instance-type-1 .x-p{grid-template-columns:130px minmax(0,1fr);grid-template-areas:"s t" "s b";column-gap:16px;row-gap:6px;text-align:left}
  .fg-change-eks-node-group-instance-type-1 .x-p .lk-svg{align-self:center}
  .fg-change-eks-node-group-instance-type-1 .x-t{align-self:start}
  .fg-change-eks-node-group-instance-type-1 .x-b{align-self:end}
}
@container (min-width:548px){
  .fg-change-eks-node-group-instance-type-1 .x-st{grid-template-columns:repeat(3,minmax(0,1fr));column-gap:28px}
  .fg-change-eks-node-group-instance-type-1 .x-b{min-height:2.9em}
  .fg-change-eks-node-group-instance-type-1 .x-st > li:not(:last-child)::after{display:none}
  .fg-change-eks-node-group-instance-type-1 .x-st > li:not(:last-child) .x-p::after{content:"";position:absolute;right:-17px;top:50%;width:6px;height:6px;margin-top:-3px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(-45deg)}
}`,
  html: `<ol class="lk-ol x-st" role="list"><li><div class="lk-art x-p"><p class="x-t"><span class="x-gn">ng-old: m5.xlarge</span><span class="x-gs x-c">Ready</span></p><svg class="lk-svg" viewBox="0 0 180 92" style="aspect-ratio:180/92" aria-hidden="true" focusable="false"><rect class="k" x="14" y="4" width="70" height="30" rx="3"/><rect class="u" x="22" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="42" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="62" y="12" width="14" height="14" rx="1.5"/><rect class="k" x="96" y="4" width="70" height="30" rx="3"/><rect class="u" x="104" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="124" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="144" y="12" width="14" height="14" rx="1.5"/><rect class="k" x="14" y="58" width="70" height="30" rx="3"/><rect class="k" x="96" y="58" width="70" height="30" rx="3"/></svg><p class="x-b"><span class="x-gn">ng-new: m7i.large</span><span class="x-gs x-c">Ready</span></p></div><p class="lk-t"><span class="lk-num">1</span>Create</p></li><li><div class="lk-art x-p"><p class="x-t"><span class="x-gn">ng-old</span><span class="x-gs x-c">SchedulingDisabled</span></p><svg class="lk-svg" viewBox="0 0 180 92" style="aspect-ratio:180/92" aria-hidden="true" focusable="false"><rect class="g" x="14" y="4" width="70" height="30" rx="3"/><rect class="g" x="96" y="4" width="70" height="30" rx="3"/><rect class="u" x="104" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="124" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="144" y="12" width="14" height="14" rx="1.5"/><path class="m" d="M29 38v15M25.5 49.5 29 53l3.5-3.5M49 38v15M45.5 49.5 49 53l3.5-3.5M69 38v15M65.5 49.5 69 53l3.5-3.5"/><rect class="k" x="14" y="58" width="70" height="30" rx="3"/><rect class="u" x="22" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="42" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="62" y="66" width="14" height="14" rx="1.5"/><rect class="k" x="96" y="58" width="70" height="30" rx="3"/></svg><p class="x-b"><span class="x-gn">ng-new</span></p></div><p class="lk-t"><span class="lk-num">2</span>Cordon and drain</p><p class="lk-s x-n">One node at a time, within each PDB</p></li><li><div class="lk-art x-p"><p class="x-t x-off"><span class="x-gn">ng-old</span><span class="x-gs">Deleted once empty</span></p><svg class="lk-svg" viewBox="0 0 180 92" style="aspect-ratio:180/92" aria-hidden="true" focusable="false"><g class="x-fade"><rect class="g" x="14" y="4" width="70" height="30" rx="3"/><rect class="g" x="96" y="4" width="70" height="30" rx="3"/></g><rect class="k" x="14" y="58" width="70" height="30" rx="3"/><rect class="u" x="22" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="42" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="62" y="66" width="14" height="14" rx="1.5"/><rect class="k" x="96" y="58" width="70" height="30" rx="3"/><rect class="u" x="104" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="124" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="144" y="66" width="14" height="14" rx="1.5"/></svg><p class="x-b"><span class="x-gn">ng-new</span></p></div><p class="lk-t"><span class="lk-num">3</span>Delete</p><p class="lk-s x-n"><span class="lk-mono">ng-new</span> carries every pod</p></li></ol>`,
};
