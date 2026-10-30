import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-pod-affinity-vs-node-affinity-1",
  label:
    "Diagram. Three nodes, node-1, node-2 and node-3, each hold one web pod and one cache pod; node-3's web pod can't move to node-1 because required anti-affinity finds a web pod already there, so 3 replicas with required hostname anti-affinity keep the cluster at 3 nodes.",
  style: `.fg-pod-affinity-vs-node-affinity-1 .lk-svg .ac{fill:none;stroke:var(--accent)}
.fg-pod-affinity-vs-node-affinity-1 .af-c{margin:0 0 8px !important;font-weight:600;color:var(--accent);text-wrap:balance}
.fg-pod-affinity-vs-node-affinity-1 .af-n{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:8px !important;text-align:center}
.fg-pod-affinity-vs-node-affinity-1 .af-n .lk-mono{color:var(--text)}
.fg-pod-affinity-vs-node-affinity-1 .af-k{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:12px !important;font-weight:500;color:var(--text)}
.fg-pod-affinity-vs-node-affinity-1 .af-k > span{display:inline-flex;align-items:center;gap:8px}
.fg-pod-affinity-vs-node-affinity-1 .af-sw{flex:none;width:10px;height:10px;border-radius:2px}
.fg-pod-affinity-vs-node-affinity-1 .sw-u{background:var(--accent)}
.fg-pod-affinity-vs-node-affinity-1 .sw-uk{background:var(--text)}
.fg-pod-affinity-vs-node-affinity-1 .af-p{display:none}
@container (max-width:419.98px){.fg-pod-affinity-vs-node-affinity-1 .af-d{display:none}.fg-pod-affinity-vs-node-affinity-1 .af-p{display:block}}`,
  html: `<div class="lk-art" style="--cap:100%"><p class="af-c">required anti-affinity: a web pod is already here</p><svg class="lk-svg af-d" viewBox="0 0 480 118" style="aspect-ratio:480/118" aria-hidden="true" focusable="false"><rect class="k" x="20" y="48" width="120" height="62" rx="3"/><rect class="u" x="36" y="62" width="40" height="34" rx="2"/><rect class="uk" x="84" y="62" width="40" height="34" rx="2"/><rect class="k" x="180" y="48" width="120" height="62" rx="3"/><rect class="u" x="196" y="62" width="40" height="34" rx="2"/><rect class="uk" x="244" y="62" width="40" height="34" rx="2"/><rect class="k" x="340" y="48" width="120" height="62" rx="3"/><rect class="u" x="356" y="62" width="40" height="34" rx="2"/><rect class="uk" x="404" y="62" width="40" height="34" rx="2"/><path class="mt" d="M376 59V20q0-10-10-10H66q-10 0-10 10v38"/><path class="ac" d="M50.5 52.5l5.5 5.5 5.5-5.5M49 24l14 14M63 24 49 38"/></svg><svg class="lk-svg af-p" viewBox="0 0 300 106" style="aspect-ratio:300/106" aria-hidden="true" focusable="false"><rect class="k" x="6" y="44" width="88" height="54" rx="3"/><rect class="u" x="16" y="57" width="30" height="28" rx="2"/><rect class="uk" x="54" y="57" width="30" height="28" rx="2"/><rect class="k" x="106" y="44" width="88" height="54" rx="3"/><rect class="u" x="116" y="57" width="30" height="28" rx="2"/><rect class="uk" x="154" y="57" width="30" height="28" rx="2"/><rect class="k" x="206" y="44" width="88" height="54" rx="3"/><rect class="u" x="216" y="57" width="30" height="28" rx="2"/><rect class="uk" x="254" y="57" width="30" height="28" rx="2"/><path class="mt" d="M231 56V16q0-8-8-8H39q-8 0-8 8v37"/><path class="ac" d="M26.5 48.5l4.5 4.5 4.5-4.5M25 22l12 12M37 22 25 34"/></svg><p class="af-n"><span class="lk-mono">node-1</span><span class="lk-mono">node-2</span><span class="lk-mono">node-3</span></p></div><p class="af-k"><span><i class="af-sw sw-u"></i>web pod</span><span><i class="af-sw sw-uk"></i>cache pod</span></p><p class="lk-t">3 replicas with required hostname anti-affinity: the cluster can&#39;t go below 3 nodes.</p>`,
};
