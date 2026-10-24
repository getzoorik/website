import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-change-aks-node-pool-vm-size-1",
  label:
    "Diagram. Three stages: add mynodepool on Standard_DS3_v2 × 3 beside nodepool1 on Standard_DS2_v2 × 3, all six nodes Ready; cordon and drain the three old nodes, now SchedulingDisabled, moving their pods into mynodepool one node at a time within each PDB; then delete nodepool1 once it is empty, with mynodepool carrying every pod.",
  style: `.fg-change-aks-node-pool-vm-size-1 .x-st{display:grid;gap:26px}
.fg-change-aks-node-pool-vm-size-1 .x-st > li{position:relative;min-width:0}
.fg-change-aks-node-pool-vm-size-1 .x-p{display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"t" "s" "b";align-content:start;row-gap:10px;padding:12px 12px 14px;text-align:center}
.fg-change-aks-node-pool-vm-size-1 .x-p .lk-svg{grid-area:s;max-width:180px}
.fg-change-aks-node-pool-vm-size-1 .x-t{grid-area:t;align-self:end}
.fg-change-aks-node-pool-vm-size-1 .x-b{grid-area:b;align-self:start}
.fg-change-aks-node-pool-vm-size-1 .x-n,.fg-change-aks-node-pool-vm-size-1 .x-v{display:block;font-family:var(--code);font-size:.95em;font-weight:500;line-height:1.45}
.fg-change-aks-node-pool-vm-size-1 .x-n{color:var(--text)}
.fg-change-aks-node-pool-vm-size-1 .x-v{color:var(--muted)}
.fg-change-aks-node-pool-vm-size-1 .x-v.x-pl{font-family:inherit;font-size:inherit}
.fg-change-aks-node-pool-vm-size-1 .x-off .x-n{color:var(--muted)}
.fg-change-aks-node-pool-vm-size-1 .x-fade{opacity:.4}
.fg-change-aks-node-pool-vm-size-1 .lk-num{margin-right:.35em}
.fg-change-aks-node-pool-vm-size-1 .x-s{margin-top:2px !important}
.fg-change-aks-node-pool-vm-size-1 .x-s .lk-mono{color:var(--muted)}
.fg-change-aks-node-pool-vm-size-1 .x-st > li:not(:last-child)::after{content:"";position:absolute;left:68.5px;bottom:-17px;width:6px;height:6px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
@container (max-width:547.98px){
  .fg-change-aks-node-pool-vm-size-1 .x-p{grid-template-columns:120px minmax(0,1fr);grid-template-areas:"s t" "s b";column-gap:16px;row-gap:6px;text-align:left}
  .fg-change-aks-node-pool-vm-size-1 .x-p .lk-svg{align-self:center}
}
@container (min-width:548px){
  .fg-change-aks-node-pool-vm-size-1 .x-st{grid-template-columns:repeat(3,minmax(0,1fr));column-gap:28px}
  .fg-change-aks-node-pool-vm-size-1 .x-t,.fg-change-aks-node-pool-vm-size-1 .x-b{min-height:2.9em}
  .fg-change-aks-node-pool-vm-size-1 .x-st > li:not(:last-child)::after{display:none}
  .fg-change-aks-node-pool-vm-size-1 .x-st > li:not(:last-child) .x-p::after{content:"";position:absolute;right:-17px;top:50%;width:6px;height:6px;margin-top:-3px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(-45deg)}
}`,
  html: `<ol class="lk-ol x-st" role="list"><li><div class="lk-art x-p"><p class="x-t"><span class="x-n">nodepool1:</span><span class="x-v">Standard_DS2_v2 ×&nbsp;3</span></p><svg class="lk-svg" viewBox="0 0 180 92" style="aspect-ratio:180/92" aria-hidden="true" focusable="false"><rect class="k" x="10" y="4" width="48" height="30" rx="3"/><rect class="u" x="18" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="36" y="12" width="14" height="14" rx="1.5"/><rect class="k" x="66" y="4" width="48" height="30" rx="3"/><rect class="u" x="74" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="92" y="12" width="14" height="14" rx="1.5"/><rect class="k" x="122" y="4" width="48" height="30" rx="3"/><rect class="u" x="130" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="148" y="12" width="14" height="14" rx="1.5"/><rect class="k" x="10" y="58" width="48" height="30" rx="3"/><rect class="k" x="66" y="58" width="48" height="30" rx="3"/><rect class="k" x="122" y="58" width="48" height="30" rx="3"/></svg><p class="x-b"><span class="x-n">mynodepool:</span><span class="x-v">Standard_DS3_v2 ×&nbsp;3</span></p></div><p class="lk-t"><span class="lk-num">1</span>Add</p><p class="lk-s x-s">All six nodes <span class="lk-mono">Ready</span></p></li><li><div class="lk-art x-p"><p class="x-t"><span class="x-n">nodepool1</span><span class="x-v">SchedulingDisabled</span></p><svg class="lk-svg" viewBox="0 0 180 92" style="aspect-ratio:180/92" aria-hidden="true" focusable="false"><rect class="g" x="10" y="4" width="48" height="30" rx="3"/><rect class="g" x="66" y="4" width="48" height="30" rx="3"/><rect class="u" x="74" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="92" y="12" width="14" height="14" rx="1.5"/><rect class="g" x="122" y="4" width="48" height="30" rx="3"/><rect class="u" x="130" y="12" width="14" height="14" rx="1.5"/><rect class="u" x="148" y="12" width="14" height="14" rx="1.5"/><path class="m" d="M25 38v15M21.5 49.5 25 53l3.5-3.5M43 38v15M39.5 49.5 43 53l3.5-3.5"/><rect class="k" x="10" y="58" width="48" height="30" rx="3"/><rect class="u" x="18" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="36" y="66" width="14" height="14" rx="1.5"/><rect class="k" x="66" y="58" width="48" height="30" rx="3"/><rect class="k" x="122" y="58" width="48" height="30" rx="3"/></svg><p class="x-b"><span class="x-n">mynodepool</span></p></div><p class="lk-t"><span class="lk-num">2</span>Cordon and drain</p><p class="lk-s x-s">One node at a time, within each PDB</p></li><li><div class="lk-art x-p"><p class="x-t x-off"><span class="x-n">nodepool1</span><span class="x-v x-pl">Deleted once empty</span></p><svg class="lk-svg" viewBox="0 0 180 92" style="aspect-ratio:180/92" aria-hidden="true" focusable="false"><g class="x-fade"><rect class="g" x="10" y="4" width="48" height="30" rx="3"/><rect class="g" x="66" y="4" width="48" height="30" rx="3"/><rect class="g" x="122" y="4" width="48" height="30" rx="3"/></g><rect class="k" x="10" y="58" width="48" height="30" rx="3"/><rect class="u" x="18" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="36" y="66" width="14" height="14" rx="1.5"/><rect class="k" x="66" y="58" width="48" height="30" rx="3"/><rect class="u" x="74" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="92" y="66" width="14" height="14" rx="1.5"/><rect class="k" x="122" y="58" width="48" height="30" rx="3"/><rect class="u" x="130" y="66" width="14" height="14" rx="1.5"/><rect class="u" x="148" y="66" width="14" height="14" rx="1.5"/></svg><p class="x-b"><span class="x-n">mynodepool</span></p></div><p class="lk-t"><span class="lk-num">3</span>Delete</p><p class="lk-s x-s"><span class="lk-mono">mynodepool</span> carries every pod</p></li></ol>`,
};
