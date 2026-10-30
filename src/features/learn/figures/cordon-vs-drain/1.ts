import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-cordon-vs-drain-1",
  label:
    "Diagram. A node’s states: kubectl cordon takes a schedulable node to cordoned, shown as Ready,SchedulingDisabled, where new pods are kept off except DaemonSet pods and running pods keep running; drain then evicts pods within their PDBs, leaving the node cordoned and empty with only DaemonSet and mirror pods; from there kubectl uncordon makes it schedulable again while evicted pods stay where they went, or you power down or delete the VM; kubectl drain does both steps, cordoning first.",
  style: `.fg-cordon-vs-drain-1 .x-sd{display:grid;grid-template-columns:24px minmax(0,1fr) 24px}
.fg-cordon-vs-drain-1 .x-b{grid-column:2;min-width:0;padding:12px 14px 14px;border-radius:var(--r-card);background:var(--surface-2)}
.fg-cordon-vs-drain-1 .x-b .lk-svg{max-width:132px;margin:0 auto 10px}
.fg-cordon-vs-drain-1 .x-b .lk-t{text-wrap:pretty}
.fg-cordon-vs-drain-1 .x-b .lk-t{margin-top:0 !important}
.fg-cordon-vs-drain-1 .x-b .lk-s{margin-top:4px !important;text-wrap:pretty}
.fg-cordon-vs-drain-1 .x-st{font-family:var(--code);font-size:.95em;font-weight:500}
.fg-cordon-vs-drain-1 .x-mono{font-family:var(--code);font-size:.95em;font-weight:500;color:var(--text)}
.fg-cordon-vs-drain-1 .x-b1{grid-row:1}
.fg-cordon-vs-drain-1 .x-t1{grid-row:2}
.fg-cordon-vs-drain-1 .x-b2{grid-row:3}
.fg-cordon-vs-drain-1 .x-t2{grid-row:4}
.fg-cordon-vs-drain-1 .x-b3{grid-row:5}
.fg-cordon-vs-drain-1 .x-pw{grid-row:6}
.fg-cordon-vs-drain-1 .x-tr{position:relative;grid-column:2;padding:12px 0 12px 46px;font-weight:500;line-height:1.4;color:var(--text)}
.fg-cordon-vs-drain-1 .x-tr > i{position:absolute;left:30px;top:3px;bottom:3px;width:1.5px;background:var(--muted)}
.fg-cordon-vs-drain-1 .x-tr > i::after{content:"";position:absolute;left:-3.5px;bottom:1.75px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-cordon-vs-drain-1 .x-db{grid-column:1;grid-row:1 / 6;position:relative;margin:30px 0 30px 6px;border:1.5px dashed var(--muted);border-right:0;border-radius:4px 0 0 4px}
.fg-cordon-vs-drain-1 .x-db::after{content:"";position:absolute;right:1.75px;bottom:-4.75px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-cordon-vs-drain-1 .x-ub{grid-column:3;grid-row:1 / 6;position:relative;margin:30px 6px 30px 0;border:1.5px solid var(--muted);border-left:0;border-radius:0 4px 4px 0}
.fg-cordon-vs-drain-1 .x-ub::before{content:"";position:absolute;left:1.75px;top:-4.75px;width:7px;height:7px;border-left:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-cordon-vs-drain-1 .x-dl,.fg-cordon-vs-drain-1 .x-ul{grid-column:1 / -1;display:flex;align-items:flex-start;gap:10px;font-weight:500;line-height:1.4;color:var(--text)}
.fg-cordon-vs-drain-1 .x-dl{grid-row:7;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}
.fg-cordon-vs-drain-1 .x-ul{grid-row:8;margin-top:8px}
.fg-cordon-vs-drain-1 .x-ul .x-sub{display:block;color:var(--muted)}
.fg-cordon-vs-drain-1 .x-smp{flex:none;box-sizing:border-box;width:10px;height:18px;margin-top:0}
.fg-cordon-vs-drain-1 .x-dl .x-smp{border:1.5px dashed var(--muted);border-right:0;border-radius:3px 0 0 3px}
.fg-cordon-vs-drain-1 .x-ul .x-smp{border:1.5px solid var(--muted);border-left:0;border-radius:0 3px 3px 0}
.fg-cordon-vs-drain-1 .x-key{display:flex;flex-wrap:wrap;align-items:center;gap:6px 20px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line);font-weight:500;color:var(--text)}
.fg-cordon-vs-drain-1 .x-key > span{display:inline-flex;align-items:center;gap:8px}
.fg-cordon-vs-drain-1 .x-sw{flex:none;box-sizing:border-box;width:12px;height:12px;border-radius:3px}
.fg-cordon-vs-drain-1 .x-sw.uk{background:var(--text)}
.fg-cordon-vs-drain-1 .x-sw.u{background:var(--accent)}
.fg-cordon-vs-drain-1 .x-sw.a{border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
@container (min-width:640px){
  .fg-cordon-vs-drain-1 .x-sd{grid-template-columns:minmax(0,1fr) 92px minmax(0,1.3fr) 92px minmax(0,1fr)}
  .fg-cordon-vs-drain-1 .x-b,.fg-cordon-vs-drain-1 .x-tr{grid-row:3}
  .fg-cordon-vs-drain-1 .x-b1{grid-column:1}
  .fg-cordon-vs-drain-1 .x-t1{grid-column:2}
  .fg-cordon-vs-drain-1 .x-b2{grid-column:3}
  .fg-cordon-vs-drain-1 .x-t2{grid-column:4}
  .fg-cordon-vs-drain-1 .x-b3{grid-column:5}
  .fg-cordon-vs-drain-1 .x-b .lk-svg{max-width:120px}
  .fg-cordon-vs-drain-1 .x-tr{align-self:start;display:flex;flex-direction:column;justify-content:flex-end;height:54px;padding:0 6px 10px;text-align:center;text-wrap:balance}
  .fg-cordon-vs-drain-1 .x-tr > i{left:2px;right:2px;top:auto;bottom:0;width:auto;height:1.5px}
  .fg-cordon-vs-drain-1 .x-tr > i::after{left:auto;right:0;bottom:-3.5px;border-bottom:0;border-top:1.5px solid var(--muted)}
  .fg-cordon-vs-drain-1 .x-dl{grid-row:1;justify-content:center;margin:0;padding:0 0 6px;border:0;text-align:center}
  .fg-cordon-vs-drain-1 .x-db{grid-row:2;grid-column:1 / -1;height:16px;margin:0 calc((100% - 184px) / 6.6);border:1.5px dashed var(--muted);border-bottom:0;border-radius:4px 4px 0 0}
  .fg-cordon-vs-drain-1 .x-db::after{right:-4.75px;bottom:1.75px;border-top:0;border-bottom:1.5px solid var(--muted)}
  .fg-cordon-vs-drain-1 .x-ub{grid-row:4;grid-column:1 / -1;height:20px;margin:0 calc((100% - 184px) / 6.6);border:1.5px solid var(--muted);border-top:0;border-radius:0 0 4px 4px}
  .fg-cordon-vs-drain-1 .x-ub::before{left:-4.75px;top:1.75px;border-bottom:0;border-top:1.5px solid var(--muted)}
  .fg-cordon-vs-drain-1 .x-ul{grid-row:5;justify-content:center;margin:0;padding-top:6px;text-align:center}
  .fg-cordon-vs-drain-1 .x-pw{grid-row:1 / 3;grid-column:4 / 6;align-self:stretch;height:auto;padding:0;text-align:right;white-space:nowrap}
  .fg-cordon-vs-drain-1 .x-pw > i{position:relative;flex:1 0 14px;left:auto;right:auto;top:auto;bottom:auto;width:1.5px;height:auto;margin:4px 0 0 calc(85% + 13.8px)}
  .fg-cordon-vs-drain-1 .x-pw > i::after{left:-3.5px;right:auto;top:1.75px;bottom:auto;border:0;border-left:1.5px solid var(--muted);border-top:1.5px solid var(--muted)}
  .fg-cordon-vs-drain-1 .x-smp{display:none}
  .fg-cordon-vs-drain-1 .x-key{margin-top:16px}
}`,
  html: `<div class="x-sd"><div class="x-dl"><span class="x-smp"></span><span><span class="x-mono">kubectl drain</span> (cordons first)</span></div><i class="x-db"></i><div class="x-b x-b1"><svg class="lk-svg" viewBox="0 0 120 60" style="aspect-ratio:120/60" aria-hidden="true" focusable="false"><rect class="u" x="89" y="0" width="14" height="18" rx="2"/><path class="m" d="M96 21v10M92.5 27.5 96 31l3.5-3.5"/><rect class="n" x="11" y="30" width="98" height="28" rx="3"/><rect class="a" x="17" y="35" width="14" height="18" rx="2"/><rect class="a" x="35" y="35" width="14" height="18" rx="2"/><rect class="uk" x="53" y="35" width="14" height="18" rx="2"/><rect class="uk" x="71" y="35" width="14" height="18" rx="2"/></svg><p class="lk-t"><span class="lk-num">1</span> Schedulable</p><p class="lk-s">New pods: yes<br>Running pods: run</p></div><div class="x-tr x-t1"><span><span class="x-mono">kubectl cordon</span></span><i></i></div><div class="x-b x-b2"><svg class="lk-svg" viewBox="0 0 120 60" style="aspect-ratio:120/60" aria-hidden="true" focusable="false"><rect class="u" x="89" y="0" width="14" height="18" rx="2"/><path class="m" d="M96 21v5M90 26h12"/><rect class="n" x="11" y="30" width="98" height="28" rx="3"/><rect class="a" x="17" y="35" width="14" height="18" rx="2"/><rect class="a" x="35" y="35" width="14" height="18" rx="2"/><rect class="uk" x="53" y="35" width="14" height="18" rx="2"/><rect class="uk" x="71" y="35" width="14" height="18" rx="2"/></svg><p class="lk-t"><span class="lk-num">2</span> Cordoned: <span class="x-st">Ready,<wbr>SchedulingDisabled</span></p><p class="lk-s">New pods: none except DaemonSet pods<br>Running pods: keep running</p></div><div class="x-tr x-t2"><span>Drain evicts, within PDBs</span><i></i></div><div class="x-b x-b3"><svg class="lk-svg" viewBox="0 0 120 60" style="aspect-ratio:120/60" aria-hidden="true" focusable="false"><rect class="u" x="89" y="0" width="14" height="18" rx="2"/><path class="m" d="M96 21v5M90 26h12"/><rect class="n" x="11" y="30" width="98" height="28" rx="3"/><rect class="a" x="17" y="35" width="14" height="18" rx="2"/><rect class="a" x="35" y="35" width="14" height="18" rx="2"/></svg><p class="lk-t"><span class="lk-num">3</span> Cordoned and empty</p><p class="lk-s">Only DaemonSet and mirror pods left</p></div><i class="x-ub"></i><div class="x-ul"><span class="x-smp"></span><span><span class="x-mono">kubectl uncordon</span><span class="x-sub">Evicted pods stay where they went</span></span></div><div class="x-tr x-pw"><span>Power down or delete the VM</span><i></i></div></div><div class="x-key"><span><span class="x-sw uk"></span>App pod</span><span><span class="x-sw a"></span>DaemonSet or mirror pod</span><span><span class="x-sw u"></span>New pod</span></div>`,
};
