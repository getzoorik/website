import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-reduce-kubernetes-cost-1",
  label:
    "Diagram. Three nodes with 4 CPU allocatable each, in three stages. Before, each node's pods request 3 CPU (75%) and use 1 CPU, so no node is under 50% of requests and none is removed. After step 1, requests are rebalanced to 1.5 CPU (37.5%) per node while use stays at 1 CPU, so every node is under 50% and one can go. After step 2, node 3's pods have moved, nodes 1 and 2 each carry 2.25 CPU of requests (56%), and node 3 is removed. An illustration, not a measurement: 3 nodes become 2.",
  style: `.fg-reduce-kubernetes-cost-1 .x-r{display:grid;grid-template-columns:236px minmax(0,1fr);align-items:start;gap:0 20px}
.fg-reduce-kubernetes-cost-1 .lk-art.x-r{padding:12px 14px}
.fg-reduce-kubernetes-cost-1 .lk-art + .lk-art{margin-top:10px}
.fg-reduce-kubernetes-cost-1 .x-hd{padding:0 14px 6px}
.fg-reduce-kubernetes-cost-1 .x-ns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 14px}
.fg-reduce-kubernetes-cost-1 .x-nl{font-weight:500;color:var(--muted)}
.fg-reduce-kubernetes-cost-1 .x-t{font-weight:600;color:var(--text);text-wrap:balance}
.fg-reduce-kubernetes-cost-1 .x-d{margin-top:2px !important;font-weight:500;color:var(--muted);text-wrap:pretty}
.fg-reduce-kubernetes-cost-1 .x-d .lk-mono{color:var(--text)}
.fg-reduce-kubernetes-cost-1 .x-bar{position:relative;box-sizing:border-box;height:32px;border:1.5px solid var(--text);border-radius:3px;background:#fff}
.fg-reduce-kubernetes-cost-1 .x-bar > i{position:absolute;display:block;box-sizing:border-box}
.fg-reduce-kubernetes-cost-1 .x-rq{left:3px;top:3px;bottom:3px;width:calc((100% - 6px) * var(--r));border:1.5px solid var(--ln-a45);border-radius:1.5px;background:var(--ln-a14)}
.fg-reduce-kubernetes-cost-1 .x-us{left:6px;top:6px;bottom:6px;width:calc((100% - 6px) * var(--u) - 3px);border-radius:1px;background:var(--accent)}
.fg-reduce-kubernetes-cost-1 .x-th{left:calc(3px + (100% - 6px) * .5 - .75px);top:-6px;bottom:-6px;border-left:1.5px dashed var(--ln-g)}
.fg-reduce-kubernetes-cost-1 .x-bar.is-off{border:1.5px dashed var(--ln-g);background:none}
.fg-reduce-kubernetes-cost-1 .x-o{position:relative;grid-column:1 / -1;margin-top:8px !important;padding-top:11px !important;text-align:center;font-weight:600;color:var(--text);text-wrap:balance}
.fg-reduce-kubernetes-cost-1 .x-o::before{content:"";position:absolute;left:0;right:0;top:0;height:6px;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 3px 3px}
.fg-reduce-kubernetes-cost-1 .x-o.is-3{grid-column:3}
.fg-reduce-kubernetes-cost-1 .x-key{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:14px !important;font-weight:500;color:var(--muted)}
.fg-reduce-kubernetes-cost-1 .x-key > span{display:inline-flex;align-items:center;gap:7px}
.fg-reduce-kubernetes-cost-1 .x-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-reduce-kubernetes-cost-1 .sw-k{border:1.5px solid var(--text);background:#fff}
.fg-reduce-kubernetes-cost-1 .sw-a{border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.fg-reduce-kubernetes-cost-1 .sw-u{background:var(--accent)}
.fg-reduce-kubernetes-cost-1 .sw-g{width:1.5px;height:14px;border-radius:0;border-left:1.5px dashed var(--ln-g)}
.fg-reduce-kubernetes-cost-1 p.lk-s{margin-top:6px !important}
@container (max-width:547.98px){
  .fg-reduce-kubernetes-cost-1 .x-r{grid-template-columns:minmax(0,1fr)}
  .fg-reduce-kubernetes-cost-1 .lk-art.x-r{padding:12px}
  .fg-reduce-kubernetes-cost-1 .x-hd{padding:0 12px 6px}
  .fg-reduce-kubernetes-cost-1 .x-hd > :first-child{display:none}
  .fg-reduce-kubernetes-cost-1 .x-ns{column-gap:10px}
  .fg-reduce-kubernetes-cost-1 .x-r > .x-ns{margin-top:12px}
}`,
  html: `<div class="x-r x-hd"><span></span><div class="x-ns"><p class="x-nl">Node 1</p><p class="x-nl">Node 2</p><p class="x-nl">Node 3</p></div></div><div class="lk-art x-r"><div><p class="x-t">Before</p><p class="x-d">Each node: <span class="lk-mono">3 CPU</span> requested (75%), <span class="lk-mono">1 CPU</span> used</p></div><div class="x-ns"><div class="x-bar"><i class="x-rq" style="--r:.75"></i><i class="x-us" style="--u:.25"></i><i class="x-th"></i></div><div class="x-bar"><i class="x-rq" style="--r:.75"></i><i class="x-us" style="--u:.25"></i><i class="x-th"></i></div><div class="x-bar"><i class="x-rq" style="--r:.75"></i><i class="x-us" style="--u:.25"></i><i class="x-th"></i></div><p class="x-o">No node under 50% of requests, none removed</p></div></div><div class="lk-art x-r"><div><p class="x-t">After step 1: requests rebalanced</p><p class="x-d">Each node: <span class="lk-mono">1.5 CPU</span> requested (37.5%), <span class="lk-mono">1 CPU</span> used</p></div><div class="x-ns"><div class="x-bar"><i class="x-rq" style="--r:.375"></i><i class="x-us" style="--u:.25"></i><i class="x-th"></i></div><div class="x-bar"><i class="x-rq" style="--r:.375"></i><i class="x-us" style="--u:.25"></i><i class="x-th"></i></div><div class="x-bar"><i class="x-rq" style="--r:.375"></i><i class="x-us" style="--u:.25"></i><i class="x-th"></i></div><p class="x-o">Every node under 50%, one can go</p></div></div><div class="lk-art x-r"><div><p class="x-t">After step 2: spare node removed</p><p class="x-d">Nodes 1 and 2: <span class="lk-mono">2.25 CPU</span> requested each (56%)</p></div><div class="x-ns"><div class="x-bar"><i class="x-rq" style="--r:.5625"></i><i class="x-us" style="--u:.375"></i><i class="x-th"></i></div><div class="x-bar"><i class="x-rq" style="--r:.5625"></i><i class="x-us" style="--u:.375"></i><i class="x-th"></i></div><div class="x-bar is-off"></div><p class="x-o is-3">Removed</p></div></div><p class="x-key"><span><i class="x-sw sw-k"></i><span>Node, <span class="lk-mono">4 CPU</span> allocatable</span></span><span><i class="x-sw sw-a"></i>Requested</span><span><i class="x-sw sw-u"></i>Used</span><span><i class="x-sw sw-g"></i>50% of allocatable</span></p><p class="lk-s">Illustration, not a measurement: 3 nodes become 2.</p>`,
};
