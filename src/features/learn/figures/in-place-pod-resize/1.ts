import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-in-place-pod-resize-1",
  label:
    "Diagram. A resize request's path: kubectl patch with the resize subresource, then the API server updates spec.containers[].resources, then the kubelet on the pod's node checks the new size against that node, with three outcomes: fits, shown as PodResizeInProgress and then status.containerStatuses[].resources showing the new size; not yet, shown as PodResizePending with reason Deferred and retried; and never on this node, shown as PodResizePending with reason Infeasible.",
  style: `.ln-d.fg-in-place-pod-resize-1 .pr-sp{display:grid;max-width:480px;margin:0 auto}
.ln-d.fg-in-place-pod-resize-1 p.pr-b{padding:9px 14px !important;border:1px solid var(--line);border-radius:var(--r-ctl);background:#fff;font-weight:500;line-height:1.4;color:var(--muted);text-align:center;text-wrap:balance}
.ln-d.fg-in-place-pod-resize-1 p.pr-b b{font-weight:600;color:var(--text)}
.ln-d.fg-in-place-pod-resize-1 .lk-mono{white-space:normal}
.ln-d.fg-in-place-pod-resize-1 p.pr-b.is-c .lk-mono{font-weight:600}
.ln-d.fg-in-place-pod-resize-1 .pr-ar{position:relative;height:20px}
.ln-d.fg-in-place-pod-resize-1 .pr-ar::before{content:"";position:absolute;left:calc(50% - .75px);top:0;bottom:1px;width:1.5px;background:var(--muted)}
.ln-d.fg-in-place-pod-resize-1 .pr-ar::after{content:"";position:absolute;left:calc(50% - 3.5px);bottom:1px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.ln-d.fg-in-place-pod-resize-1 .pr-out{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:12px;padding-top:34px}
.ln-d.fg-in-place-pod-resize-1 .pr-out::before{content:"";position:absolute;top:15px;left:calc((100% - 24px) / 6);right:calc((100% - 24px) / 6);height:1.5px;background:var(--muted)}
.ln-d.fg-in-place-pod-resize-1 .pr-out::after{content:"";position:absolute;top:0;left:calc(50% - .75px);width:1.5px;height:16.5px;background:var(--muted)}
.ln-d.fg-in-place-pod-resize-1 p.pr-o{position:relative;display:grid;align-content:start;row-gap:3px;padding:10px 12px 11px !important;border:1px solid var(--line);border-radius:var(--r-ctl);background:#fff;font-weight:500;line-height:1.4;color:var(--muted)}
.ln-d.fg-in-place-pod-resize-1 p.pr-o.is-d{border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.ln-d.fg-in-place-pod-resize-1 p.pr-o.is-d .pr-c{color:var(--accent)}
.ln-d.fg-in-place-pod-resize-1 p.pr-o b{font-weight:600;color:var(--text)}
.ln-d.fg-in-place-pod-resize-1 p.pr-o .pr-c{font-weight:600}
.ln-d.fg-in-place-pod-resize-1 p.pr-o::before{content:"";position:absolute;left:calc(50% - .75px);top:-19.5px;width:1.5px;height:17px;background:var(--muted)}
.ln-d.fg-in-place-pod-resize-1 p.pr-o::after{content:"";position:absolute;left:calc(50% - 3.5px);top:-10px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
@container (max-width:547.98px){
  .ln-d.fg-in-place-pod-resize-1 .lk-art{padding:14px 12px}
  .ln-d.fg-in-place-pod-resize-1 p.pr-b{padding:9px 12px !important}
  .ln-d.fg-in-place-pod-resize-1 .pr-out{grid-template-columns:minmax(0,1fr);row-gap:10px;padding:12px 0 0 24px;overflow:hidden}
  .ln-d.fg-in-place-pod-resize-1 .pr-out::before,.ln-d.fg-in-place-pod-resize-1 .pr-out::after{display:none}
  .ln-d.fg-in-place-pod-resize-1 p.pr-o::before{left:-16.75px;top:-1000px;bottom:50%;width:12px;height:auto;border-left:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);border-radius:0 0 0 3px;background:none}
  .ln-d.fg-in-place-pod-resize-1 p.pr-o.is-d::before{left:-17px}
  .ln-d.fg-in-place-pod-resize-1 p.pr-o::after{left:-10px;top:calc(50% - 3.25px);transform:rotate(-45deg)}
}`,
  html: `<div class="lk-art"><div class="pr-sp"><p class="pr-b is-c"><span class="lk-mono">kubectl patch --subresource resize</span></p><span class="pr-ar" aria-hidden="true"></span><p class="pr-b"><b>API server</b> updates <span class="lk-mono">spec.containers[].resources</span></p><span class="pr-ar" aria-hidden="true"></span><p class="pr-b"><b>Kubelet on the pod's node</b> checks the new size against that node</p></div><div class="pr-out"><p class="pr-o is-d"><b>Fits</b><span class="lk-mono pr-c">PodResizeInProgress</span><span>Then <span class="lk-mono">status.<wbr>containerStatuses[].<wbr>resources</span> shows the new size</span></p><p class="pr-o"><b>Not yet</b><span class="lk-mono pr-c">PodResizePending</span><span><span class="lk-mono">Deferred</span>, retried</span></p><p class="pr-o"><b>Never on this node</b><span class="lk-mono pr-c">PodResizePending</span><span><span class="lk-mono">Infeasible</span></span></p></div></div>`,
};
