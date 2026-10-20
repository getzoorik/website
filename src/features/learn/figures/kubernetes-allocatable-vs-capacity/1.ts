import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-kubernetes-allocatable-vs-capacity-1",
  label:
    "Diagram. A node with 32Gi of memory capacity: 28.5Gi is allocatable to pods, and the rest goes to kube-reserved 2Gi, system-reserved 1Gi and a 500Mi hard eviction threshold.",
  style: `.fg-kubernetes-allocatable-vs-capacity-1 .fk-l{margin:0 0 10px;font-weight:600;color:var(--text)}
.fg-kubernetes-allocatable-vs-capacity-1 .lk-svg .mu{fill:var(--muted);stroke:none}
.fg-kubernetes-allocatable-vs-capacity-1 .fk-k{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 20px;margin-top:12px;font-weight:500;color:var(--text)}
.fg-kubernetes-allocatable-vs-capacity-1 .fk-k > span{display:flex;align-items:center;gap:8px;min-width:0}
.fg-kubernetes-allocatable-vs-capacity-1 .fk-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-kubernetes-allocatable-vs-capacity-1 .sw-u{background:var(--accent)}
.fg-kubernetes-allocatable-vs-capacity-1 .sw-uk{background:var(--text)}
.fg-kubernetes-allocatable-vs-capacity-1 .sw-mu{background:var(--muted)}
.fg-kubernetes-allocatable-vs-capacity-1 .sw-g{border:1.5px dashed var(--ln-g)}
.fg-kubernetes-allocatable-vs-capacity-1 p.lk-s{margin-top:12px}
@container (max-width:419.98px){.fg-kubernetes-allocatable-vs-capacity-1 .fk-k{grid-template-columns:minmax(0,1fr)}}`,
  html: `<div class="lk-art" style="--cap:100%"><p class="fk-l">Capacity: <span class="lk-mono">32Gi</span> memory</p><svg class="lk-svg" viewBox="0 0 480 78" style="aspect-ratio:480/78" aria-hidden="true" focusable="false"><rect class="u" x="0" y="2" width="426.88" height="20" rx="3"/><rect class="uk" x="428.48" y="2" width="28.4" height="20" rx="3"/><rect class="g" x="459.23" y="2.75" width="11.9" height="18.5" rx="2.5"/><rect class="mu" x="473.48" y="2" width="6.52" height="20" rx="3"/><path class="m" d="M427.68 26 192 52M480 26v26"/><rect class="uk" x="192" y="56" width="164.33" height="20" rx="3"/><rect class="g" x="358.68" y="56.75" width="79.46" height="18.5" rx="2.5"/><rect class="mu" x="440.49" y="56" width="39.51" height="20" rx="3"/></svg></div><div class="fk-k"><span><i class="fk-sw sw-u"></i><span>Allocatable: <span class="lk-mono">28.5Gi</span></span></span><span><i class="fk-sw sw-uk"></i><span>kube-reserved: <span class="lk-mono">2Gi</span></span></span><span><i class="fk-sw sw-g"></i><span>system-reserved: <span class="lk-mono">1Gi</span></span></span><span><i class="fk-sw sw-mu"></i><span>Hard eviction threshold: <span class="lk-mono">500Mi</span></span></span></div><p class="lk-s">The Kubernetes docs' example node. CPU on the same node: 16 capacity, 14.5 allocatable.</p>`,
};
