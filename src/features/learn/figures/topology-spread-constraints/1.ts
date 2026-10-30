import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-topology-spread-constraints-1",
  label:
    "Diagram. Zone A has node a1 with 2 web pods, zone B has node b1 with 2 web pods, and zone C has node c1, full, with 1 web pod and node c2, draining, with 1 web pod; moving c2's pod to zone A is blocked because 3 minus 1 = 2, above maxSkew 1, and c1, the only allowed target, has no room, so with 6 replicas, maxSkew 1 and DoNotSchedule on zone, c2 can't be emptied.",
  style: `.fg-topology-spread-constraints-1{--g:6px;--p:6px}
.fg-topology-spread-constraints-1 .tp-w{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:var(--g);line-height:1.4}
.fg-topology-spread-constraints-1 .tp-l1,.fg-topology-spread-constraints-1 .tp-l2{font-weight:500;color:var(--text);text-align:center;text-wrap:balance}
.fg-topology-spread-constraints-1 .tp-l1{grid-row:1;grid-column:1 / -1;padding-bottom:8px}
.fg-topology-spread-constraints-1 .tp-up{position:relative;grid-row:2;grid-column:1 / -1;height:18px;margin:0 calc((100% - 3 * var(--g)) / 8);border:1.5px solid var(--muted);border-bottom:0;border-radius:4px 4px 0 0}
.fg-topology-spread-constraints-1 .tp-up::before{content:"";position:absolute;left:-4.25px;bottom:1.5px;width:7px;height:7px;box-sizing:border-box;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-topology-spread-constraints-1 .tp-x{position:absolute;left:50%;top:-9px;width:16px;height:16px;margin-left:-8px;background:#fff}
.fg-topology-spread-constraints-1 .tp-x::before,.fg-topology-spread-constraints-1 .tp-x::after{content:"";position:absolute;left:1px;right:1px;top:7px;height:2px;border-radius:1px;background:var(--text);transform:rotate(45deg)}
.fg-topology-spread-constraints-1 .tp-x::after{transform:rotate(-45deg)}
.fg-topology-spread-constraints-1 .tp-z{grid-row:3;display:flex;flex-direction:column;min-width:0;padding:var(--p);border-radius:var(--r-card);background:var(--surface-2)}
.fg-topology-spread-constraints-1 .tp-za{grid-column:1}.fg-topology-spread-constraints-1 .tp-zb{grid-column:2}
.fg-topology-spread-constraints-1 .tp-zc{grid-column:3 / 5}
.fg-topology-spread-constraints-1 .tp-zn{margin-bottom:6px;font-weight:600;color:var(--text);white-space:nowrap}
.fg-topology-spread-constraints-1 .tp-ns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:calc(var(--g) + 2 * var(--p))}
.fg-topology-spread-constraints-1 .tp-nd{display:block;padding:5px 6px 6px;border:1.5px solid var(--text);border-radius:3px;background:#fff}
.fg-topology-spread-constraints-1 .tp-nd.is-dr{border:1.5px dashed var(--ln-g)}
.fg-topology-spread-constraints-1 .tp-nn{display:block;font-weight:600;color:var(--text)}
.fg-topology-spread-constraints-1 .tp-ps{display:flex;gap:4px;margin-top:5px}
.fg-topology-spread-constraints-1 .tp-p{flex:none;width:10px;height:18px;border-radius:2px;background:var(--accent)}
.fg-topology-spread-constraints-1 .tp-f{flex:1 1 auto;height:18px;border-radius:2px;background:var(--ln-g)}
.fg-topology-spread-constraints-1 .tp-st{display:block;margin-top:4px;font-weight:500;color:var(--muted)}
.fg-topology-spread-constraints-1 .tp-dn{position:relative;grid-row:4;grid-column:3 / 5;height:16px;margin:0 calc((100% - var(--g)) / 4);border:1.5px solid var(--muted);border-top:0;border-radius:0 0 4px 4px}
.fg-topology-spread-constraints-1 .tp-dn::before{content:"";position:absolute;left:-4.25px;top:1.5px;width:7px;height:7px;box-sizing:border-box;border-left:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-topology-spread-constraints-1 .tp-l2{grid-row:5;grid-column:2 / 5;justify-self:end;max-width:100%;padding-top:6px}
.fg-topology-spread-constraints-1 .tp-ft{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 20px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}
.fg-topology-spread-constraints-1 .tp-ft .lk-t{margin-top:0 !important}
.fg-topology-spread-constraints-1 .tp-k{display:inline-flex;align-items:center;gap:8px;font-weight:500;color:var(--text)}
.fg-topology-spread-constraints-1 .tp-k i{flex:none;width:12px;height:12px;border-radius:3px;background:var(--accent)}
@container (min-width:548px){
  .fg-topology-spread-constraints-1{--g:12px;--p:10px}
  .fg-topology-spread-constraints-1 .tp-nd{padding:7px 10px 8px}
  .fg-topology-spread-constraints-1 .tp-ps{gap:5px;margin-top:6px}
  .fg-topology-spread-constraints-1 .tp-p{width:12px;height:20px}
  .fg-topology-spread-constraints-1 .tp-f{height:20px}
  .fg-topology-spread-constraints-1 .tp-l2{grid-column:3 / 5;justify-self:center;text-align:center}
}`,
  html: `<div class="tp-w"><span class="tp-l1">3 minus 1 = 2, above <span class="lk-mono">maxSkew</span> 1</span><i class="tp-up"><i class="tp-x"></i></i><div class="tp-z tp-za"><span class="tp-zn">Zone A</span><span class="tp-nd"><span class="tp-nn">a1</span><span class="tp-ps"><i class="tp-p"></i><i class="tp-p"></i></span></span></div><div class="tp-z tp-zb"><span class="tp-zn">Zone B</span><span class="tp-nd"><span class="tp-nn">b1</span><span class="tp-ps"><i class="tp-p"></i><i class="tp-p"></i></span></span></div><div class="tp-z tp-zc"><span class="tp-zn">Zone C</span><div class="tp-ns"><div><span class="tp-nd"><span class="tp-nn">c1</span><span class="tp-ps"><i class="tp-p"></i><i class="tp-f"></i></span></span><span class="tp-st">Full</span></div><div><span class="tp-nd is-dr"><span class="tp-nn">c2</span><span class="tp-ps"><i class="tp-p"></i></span></span><span class="tp-st">Draining</span></div></div></div><i class="tp-dn"></i><span class="tp-l2">Only allowed target, no room</span></div><div class="tp-ft"><p class="lk-t">6 replicas, <span class="lk-mono">maxSkew</span> 1, <span class="lk-mono">DoNotSchedule</span> on zone: c2 can't be emptied.</p><span class="tp-k"><i></i>Web pod</span></div>`,
};
