import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-kubernetes-descheduler-1",
  label:
    "Diagram. Three nodes requested at 70%, 45% and 10% of CPU, twice. LowNodeUtilization moves one pod from node-a to node-c, so node-c fills up and stays. HighNodeUtilization with MostAllocated moves node-c's pods to node-a and node-b, so node-c is empty and your autoscaler can remove it. By default, both read pod requests, not live usage.",
  style: `.fg-kubernetes-descheduler-1 .x-row{display:grid;grid-template-columns:minmax(0,184px) minmax(0,1fr);align-items:center;gap:10px 24px}
.ln-d.fg-kubernetes-descheduler-1 .x-row + .x-row{margin-top:12px}
.ln-d.fg-kubernetes-descheduler-1 p.x-h{font-weight:600;color:var(--text);overflow-wrap:anywhere}
.ln-d.fg-kubernetes-descheduler-1 p.x-c{margin-top:2px !important;font-weight:500;color:var(--muted);text-wrap:balance}
.fg-kubernetes-descheduler-1 .x-pic{width:100%;max-width:330px;margin:0 auto}
.fg-kubernetes-descheduler-1 .x-nl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:6px;text-align:center;font-weight:500;color:var(--muted)}
.fg-kubernetes-descheduler-1 .x-nl .lk-mono{margin-right:.3em}
.ln-d.fg-kubernetes-descheduler-1 p.x-foot{margin-top:12px !important}
@container (max-width:479.98px){
  .fg-kubernetes-descheduler-1 .x-row{grid-template-columns:minmax(0,1fr);gap:12px}
}`,
  html: `<div class="lk-art x-row"><div><p class="x-h">LowNodeUtilization</p><p class="x-c">node-c fills up and stays</p></div><div class="x-pic"><svg class="lk-svg" viewBox="0 0 300 106" style="aspect-ratio:300/106" aria-hidden="true" focusable="false"><rect class="n" x="20" y="34" width="60" height="68" rx="3"/><rect class="u" x="23" y="55.6" width="54" height="43.4" rx="1.5"/><rect class="n" x="120" y="34" width="60" height="68" rx="3"/><rect class="u" x="123" y="71.1" width="54" height="27.9" rx="1.5"/><rect class="n" x="220" y="34" width="60" height="68" rx="3"/><rect class="u" x="223" y="92.8" width="54" height="6.2" rx="1.5"/><path class="m" d="M50 31C50 9 250 9 250 31M245.5 26.5l4.5 4.5 4.5-4.5"/><rect class="u" x="143" y="9.5" width="14" height="10" rx="1.5"/></svg><p class="x-nl"><span><span class="lk-mono">node-a</span>70%</span><span><span class="lk-mono">node-b</span>45%</span><span><span class="lk-mono">node-c</span>10%</span></p></div></div><div class="lk-art x-row"><div><p class="x-h">HighNodeUtilization + MostAllocated</p><p class="x-c">node-c is empty, so your autoscaler can remove it</p></div><div class="x-pic"><svg class="lk-svg" viewBox="0 0 300 106" style="aspect-ratio:300/106" aria-hidden="true" focusable="false"><rect class="n" x="20" y="34" width="60" height="68" rx="3"/><rect class="u" x="23" y="55.6" width="54" height="43.4" rx="1.5"/><rect class="n" x="120" y="34" width="60" height="68" rx="3"/><rect class="u" x="123" y="71.1" width="54" height="27.9" rx="1.5"/><rect class="g" x="220" y="34" width="60" height="68" rx="3"/><path class="m" d="M256 31C256 0 50 0 50 31M45.5 26.5l4.5 4.5 4.5-4.5M244 31C244 17 150 17 150 31M145.5 26.5l4.5 4.5 4.5-4.5"/><rect class="u" x="146" y="2.75" width="14" height="10" rx="1.5"/><rect class="u" x="190" y="15.5" width="14" height="10" rx="1.5"/></svg><p class="x-nl"><span><span class="lk-mono">node-a</span>70%</span><span><span class="lk-mono">node-b</span>45%</span><span><span class="lk-mono">node-c</span>10%</span></p></div></div><p class="lk-s x-foot">By default, both read pod requests, not live usage.</p>`,
};
