import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-resize-pvc-kubernetes-1",
  label:
    "Diagram. The PVC expansion path in four steps: kubectl patch pvc raises requests.storage from 100Gi to 200Gi, the CSI driver expands the existing disk with no new PV, the filesystem grows on the node while the pod starts or runs, and kubectl get pvc shows CAPACITY 200Gi; from the first step, a StorageClass without allowVolumeExpansion: true means the request is refused.",
  style: `.fg-resize-pvc-kubernetes-1 .pv-w{display:grid;grid-template-columns:minmax(0,1fr);max-width:400px}
.fg-resize-pvc-kubernetes-1 .pv-w > *{grid-column:1}
.fg-resize-pvc-kubernetes-1 .pv-s{display:grid;grid-template-columns:1.1em minmax(0,1fr);column-gap:10px;align-content:start;padding:10px 12px;border-radius:var(--r-card);background:var(--surface-2)}
.fg-resize-pvc-kubernetes-1 .pv-s .lk-num{grid-row:1 / 3}
.fg-resize-pvc-kubernetes-1 .pv-t{font-weight:600;line-height:1.4;color:var(--text);text-wrap:balance}
.fg-resize-pvc-kubernetes-1 .pv-d{margin-top:2px;font-weight:500;line-height:1.45;color:var(--muted);text-wrap:balance}
.fg-resize-pvc-kubernetes-1 .pv-t .lk-mono{font-weight:600}
.fg-resize-pvc-kubernetes-1 .pv-v{color:var(--accent)}
.fg-resize-pvc-kubernetes-1 .pv-c{position:relative;display:block;height:22px}
.fg-resize-pvc-kubernetes-1 .pv-c::before{content:"";position:absolute;left:17.25px;top:3px;bottom:3px;width:1.5px;background:var(--muted)}
.fg-resize-pvc-kubernetes-1 .pv-c::after{content:"";position:absolute;left:14.5px;bottom:3.5px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg);box-sizing:border-box}
.fg-resize-pvc-kubernetes-1 .pv-s1{grid-row:1}
.fg-resize-pvc-kubernetes-1 .pv-c1{grid-row:2;height:auto}
.fg-resize-pvc-kubernetes-1 .pv-br{grid-row:2;position:relative;padding:12px 0 22px 40px}
.fg-resize-pvc-kubernetes-1 .pv-s2{grid-row:3}
.fg-resize-pvc-kubernetes-1 .pv-c2{grid-row:4}
.fg-resize-pvc-kubernetes-1 .pv-s3{grid-row:5}
.fg-resize-pvc-kubernetes-1 .pv-c3{grid-row:6}
.fg-resize-pvc-kubernetes-1 .pv-s4{grid-row:7}
.fg-resize-pvc-kubernetes-1 .pv-e{position:absolute;left:17.25px;top:3px;width:16px;height:calc(50% - 8px);border-left:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);border-radius:0 0 0 3px}
.fg-resize-pvc-kubernetes-1 .pv-e::after{content:"";position:absolute;right:-1px;bottom:-4.25px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg);box-sizing:border-box}
.fg-resize-pvc-kubernetes-1 .pv-bx{display:block;padding:9px 12px;border:1.5px dashed var(--ln-g);border-radius:var(--r-card);font-weight:500;line-height:1.45;color:var(--text);text-wrap:pretty}
.fg-resize-pvc-kubernetes-1 .pv-bx b{font-weight:600}
.fg-resize-pvc-kubernetes-1 .pv-bx .lk-mono{white-space:normal}
@container (min-width:548px){
  .fg-resize-pvc-kubernetes-1 .pv-w{grid-template-columns:minmax(0,1fr) 22px minmax(0,1fr) 22px minmax(0,1fr) 22px minmax(0,1fr);max-width:none}
  .fg-resize-pvc-kubernetes-1 .pv-s{grid-template-columns:minmax(0,1fr);row-gap:4px;grid-row:1;padding:11px 12px 12px}
  .fg-resize-pvc-kubernetes-1 .pv-s .lk-num{grid-row:auto}
  .fg-resize-pvc-kubernetes-1 .pv-d{margin-top:0}
  .fg-resize-pvc-kubernetes-1 .pv-s1{grid-column:1}.fg-resize-pvc-kubernetes-1 .pv-s2{grid-column:3}
  .fg-resize-pvc-kubernetes-1 .pv-s3{grid-column:5}.fg-resize-pvc-kubernetes-1 .pv-s4{grid-column:7}
  .fg-resize-pvc-kubernetes-1 .pv-c{grid-row:1;align-self:center;height:22px}
  .fg-resize-pvc-kubernetes-1 .pv-c1{grid-column:2}.fg-resize-pvc-kubernetes-1 .pv-c2{grid-column:4}.fg-resize-pvc-kubernetes-1 .pv-c3{grid-column:6}
  .fg-resize-pvc-kubernetes-1 .pv-c::before{left:3px;right:3px;top:10.25px;bottom:auto;width:auto;height:1.5px}
  .fg-resize-pvc-kubernetes-1 .pv-c::after{left:auto;right:3.5px;bottom:auto;top:7.5px;transform:rotate(-45deg)}
  .fg-resize-pvc-kubernetes-1 .pv-br{grid-row:2;grid-column:1 / -1;justify-self:start;max-width:100%;padding:14px 0 0 44px}
  .fg-resize-pvc-kubernetes-1 .pv-e{left:20.25px;top:0;height:calc(50% + 7px);width:18px}
}`,
  html: `<div class="pv-w"><div class="pv-s pv-s1"><span class="lk-num">1</span><span class="pv-t"><span class="lk-mono">kubectl patch pvc</span></span><span class="pv-d"><span class="lk-mono">requests.storage</span> <span class="lk-mono">100Gi → <span class="pv-v">200Gi</span></span></span></div><i class="pv-c pv-c1"></i><div class="pv-s pv-s2"><span class="lk-num">2</span><span class="pv-t">CSI driver expands the existing disk</span><span class="pv-d">No new PV</span></div><i class="pv-c pv-c2"></i><div class="pv-s pv-s3"><span class="lk-num">3</span><span class="pv-t">Filesystem grows on the node</span><span class="pv-d">Pod starting, or running</span></div><i class="pv-c pv-c3"></i><div class="pv-s pv-s4"><span class="lk-num">4</span><span class="pv-t"><span class="lk-mono">kubectl get pvc</span></span><span class="pv-d"><span class="lk-mono">CAPACITY <span class="pv-v">200Gi</span></span></span></div><div class="pv-br"><i class="pv-e"></i><span class="pv-bx">StorageClass without <span class="lk-mono">allowVolumeExpansion: true</span> → <b>request refused</b></span></div></div>`,
};
