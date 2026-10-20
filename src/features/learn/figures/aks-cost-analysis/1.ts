import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-aks-cost-analysis-1",
  label:
    "Diagram. One 4-CPU AKS node as the scheduler counts it: a part reserved by AKS for system processes, team-a's 2 CPU request of which it uses 0.5 CPU, team-b's 1 CPU request used in full, and capacity requested by no pod; team-a's unused 1.5 CPU still counts against the node's capacity.",
  style: `.fg-aks-cost-analysis-1 .x-h{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 20px;margin:0 0 14px !important}
.fg-aks-cost-analysis-1 .x-hl{font-weight:600;color:var(--text)}
.fg-aks-cost-analysis-1 .x-fk{display:flex;flex-wrap:wrap;gap:4px 16px;font-weight:500;color:var(--muted)}
.fg-aks-cost-analysis-1 .x-fk > span{display:inline-flex;align-items:center;gap:7px}
.fg-aks-cost-analysis-1 .x-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-aks-cost-analysis-1 .sw-u{background:var(--accent)}
.fg-aks-cost-analysis-1 .sw-a{border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.fg-aks-cost-analysis-1 .x-br{margin:0 0 5px 19.53% !important;font-weight:600;color:var(--text);text-wrap:balance}
.fg-aks-cost-analysis-1 .x-n{position:relative;height:18px;margin-top:6px}
.fg-aks-cost-analysis-1 .x-n .lk-num{position:absolute;top:0;min-width:0;transform:translateX(-50%)}
.fg-aks-cost-analysis-1 ol.x-k{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 20px;margin-top:12px !important}
.fg-aks-cost-analysis-1 ol.x-k > li{display:grid;grid-template-columns:1.1em minmax(0,1fr);column-gap:8px;font-weight:500;color:var(--text)}
@container (max-width:419.98px){.fg-aks-cost-analysis-1 ol.x-k{grid-template-columns:minmax(0,1fr)}}`,
  html: `<div class="lk-art" style="--cap:100%"><div class="x-h"><p class="x-hl">One 4-CPU AKS node, as the scheduler counts it</p><p class="x-fk"><span><i class="x-sw sw-a"></i>Requested</span><span><i class="x-sw sw-u"></i>Used</span></p></div><p class="x-br">Unused, but counted against the node's capacity</p><svg class="lk-svg" viewBox="0 0 480 36" style="aspect-ratio:480/36" aria-hidden="true" focusable="false"><path class="m" d="M93.75 8V1.5H268.5V8"/><rect class="uk" x="0" y="12" width="28.5" height="24" rx="3"/><rect class="a" x="31.5" y="12" width="237" height="24" rx="3"/><rect class="u" x="34.5" y="15" width="57.75" height="18" rx="1.5"/><rect class="a" x="271.5" y="12" width="117" height="24" rx="3"/><rect class="u" x="274.5" y="15" width="111" height="18" rx="1.5"/><rect class="g" x="392.25" y="12.75" width="87" height="22.5" rx="2.5"/></svg><div class="x-n" aria-hidden="true"><span class="lk-num" style="left:2.97%">1</span><span class="lk-num" style="left:31.25%">2</span><span class="lk-num" style="left:68.75%">3</span><span class="lk-num" style="left:90.78%">4</span></div></div><ol class="x-k" role="list"><li><span class="lk-num">1</span><span>Reserved by AKS for system processes (System charges)</span></li><li><span class="lk-num">2</span><span>team-a: 2 CPU requested, 0.5 CPU used</span></li><li><span class="lk-num">3</span><span>team-b: 1 CPU requested, 1 CPU used</span></li><li><span class="lk-num">4</span><span>Requested by no pod</span></li></ol>`,
};
