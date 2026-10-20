import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-keda-vs-hpa-vs-vpa-1",
  label:
    "Diagram. A ScaledObject points to the keda-operator, which scales the Deployment between 0 and 1 replicas and creates and manages an HPA, keda-hpa-<name>. The HPA scales the Deployment between 1 and N replicas, checking every 15 s, and reads external metrics from keda-operator-metrics-apiserver, which reads the event source: a queue, stream or Prometheus. The keda-operator polls the event source every 30 s (pollingInterval).",
  style: `.fg-keda-vs-hpa-vs-vpa-1 .x-g{--gut:16px;--lane:144px;position:relative;display:grid;max-width:640px;margin:0 auto;
  grid-template-columns:var(--gut) minmax(0,1fr) var(--lane) minmax(0,1fr);
  grid-template-rows:auto 22px auto 40px auto 46px auto 22px auto}
.fg-keda-vs-hpa-vs-vpa-1 .x-b{display:grid;place-items:center;min-height:36px;padding:8px 10px;box-sizing:border-box;
  border:1.5px solid var(--line);border-radius:3px;background:#fff;text-align:center;font-weight:600;color:var(--text);line-height:1.35}
.fg-keda-vs-hpa-vs-vpa-1 .x-b.is-k{border-color:var(--text)}
.fg-keda-vs-hpa-vs-vpa-1 .x-b .x-s{font-weight:500;color:var(--muted)}
.fg-keda-vs-hpa-vs-vpa-1 .x-b code{font-family:var(--code);font-size:.95em;font-weight:500;color:var(--muted);background:none;border:0;padding:0}
.fg-keda-vs-hpa-vs-vpa-1 .x-l{position:absolute;font-weight:500;color:var(--muted);line-height:1.35}
.fg-keda-vs-hpa-vs-vpa-1 .x-l code{font-family:var(--code);font-size:.95em;font-weight:500;color:inherit;background:none;border:0;padding:0}
.fg-keda-vs-hpa-vs-vpa-1 .x-c{position:absolute;box-sizing:border-box;border:0 solid var(--muted)}
.fg-keda-vs-hpa-vs-vpa-1 .x-c.x-acc{border-color:var(--accent)}
.fg-keda-vs-hpa-vs-vpa-1 .x-l.x-acc{color:var(--accent)}
.fg-keda-vs-hpa-vs-vpa-1 .x-c.x-dot{border-style:dotted}
.fg-keda-vs-hpa-vs-vpa-1 .x-v{left:50%;top:0;bottom:0;width:0;margin-left:-.75px;border-left-width:1.5px}
.fg-keda-vs-hpa-vs-vpa-1 .x-hz{top:50%;left:0;right:0;height:0;margin-top:-.75px;border-top-width:1.5px}
.fg-keda-vs-hpa-vs-vpa-1 .x-c.x-ah::after{content:"";position:absolute;box-sizing:border-box;width:8px;height:8px;border:0 solid;border-color:inherit;
  border-right-width:1.5px;border-bottom-width:1.5px}
.fg-keda-vs-hpa-vs-vpa-1 .x-c.x-dn::after{left:-4.75px;bottom:2.5px;transform:rotate(45deg)}
.fg-keda-vs-hpa-vs-vpa-1 .x-c.x-lt::after{top:-4.75px;left:2.5px;transform:rotate(135deg)}
.fg-keda-vs-hpa-vs-vpa-1 .x-c.x-rt::after{bottom:-4.75px;right:2.5px;transform:rotate(-45deg)}
.fg-keda-vs-hpa-vs-vpa-1 .x-c.x-ah.x-dot::after{border-style:solid}
/* E7, keda-operator to the event source: the gutter, dotted */
.fg-keda-vs-hpa-vs-vpa-1 .e7a{grid-area:3/1/4/2;top:50%;bottom:0;left:calc(var(--gut) / 2);right:0;border-top-width:1.5px;border-left-width:1.5px;border-top-left-radius:4px;margin-top:-.75px}
.fg-keda-vs-hpa-vs-vpa-1 .e7b{grid-area:4/1/9/2;top:0;bottom:0;left:calc(var(--gut) / 2);border-left-width:1.5px}
.fg-keda-vs-hpa-vs-vpa-1 .e7c{grid-area:9/1/10/4;top:0;bottom:50%;left:calc(var(--gut) / 2);right:0;border-left-width:1.5px;border-bottom-width:1.5px;border-bottom-left-radius:4px;margin-bottom:-.75px}
.fg-keda-vs-hpa-vs-vpa-1 .e7l{grid-area:9/2/10/4;bottom:calc(50% + 7px);left:10px;right:12px}
/* E3, keda-operator to the HPA: across, then down */
.fg-keda-vs-hpa-vs-vpa-1 .e3a{grid-area:3/3/4/4}
.fg-keda-vs-hpa-vs-vpa-1 .e3b{grid-area:3/4/4/5;top:50%;bottom:0;left:0;right:50%;border-top-width:1.5px;border-right-width:1.5px;border-top-right-radius:4px;margin-top:-.75px;margin-right:-.75px}
.fg-keda-vs-hpa-vs-vpa-1 .e3c{grid-area:4/4/5/5}
.fg-keda-vs-hpa-vs-vpa-1 .e3l{grid-area:3/3/4/5;bottom:calc(50% + 6px);left:8px}
/* E1, E2 down the left column; E4 back across the lane; E5, E6 down the right column */
.fg-keda-vs-hpa-vs-vpa-1 .e1{grid-area:2/2/3/3}
.fg-keda-vs-hpa-vs-vpa-1 .e2{grid-area:4/2/5/3}
.fg-keda-vs-hpa-vs-vpa-1 .e2l{grid-area:4/2/5/3;top:50%;left:calc(50% + 10px);transform:translateY(-50%);white-space:nowrap}
.fg-keda-vs-hpa-vs-vpa-1 .e4{grid-area:5/3/6/4}
.fg-keda-vs-hpa-vs-vpa-1 .e4l{grid-area:6/3/7/4;top:6px;left:6px;right:6px;text-align:center;text-wrap:balance}
.fg-keda-vs-hpa-vs-vpa-1 .e5{grid-area:6/4/7/5}
.fg-keda-vs-hpa-vs-vpa-1 .e5l{grid-area:6/4/7/5;top:50%;left:calc(50% + 10px);right:0;transform:translateY(-50%)}
.fg-keda-vs-hpa-vs-vpa-1 .e6{grid-area:8/4/9/5}
@container (max-width:479.98px){
  .fg-keda-vs-hpa-vs-vpa-1 .lk-art{padding:14px 12px}
  .fg-keda-vs-hpa-vs-vpa-1 .x-g{--gut:14px;--lane:34px}
  .fg-keda-vs-hpa-vs-vpa-1 .x-b{padding:8px 6px}
  .fg-keda-vs-hpa-vs-vpa-1 .e3l{max-width:6.4em}
  .fg-keda-vs-hpa-vs-vpa-1 .e4l{grid-area:6/2/7/4;left:auto;right:4px;max-width:9.6em;text-align:right}
  .fg-keda-vs-hpa-vs-vpa-1 .e5,.fg-keda-vs-hpa-vs-vpa-1 .e6{left:30%}
  .fg-keda-vs-hpa-vs-vpa-1 .e5l{left:calc(30% + 10px)}
}`,
  html: `<div class="lk-art"><div class="x-g"><div class="x-b" style="grid-area:1/2/2/3"><span>ScaledObject</span></div><div class="x-b" style="grid-area:3/2/4/3"><span>keda-operator</span></div><div class="x-b is-k" style="grid-area:5/2/6/3"><span>Deployment</span></div><div class="x-b" style="grid-area:5/4/6/5"><span>HPA <code>(keda-hpa-&lt;name&gt;)</code></span></div><div class="x-b" style="grid-area:7/4/8/5"><span>keda-operator-metrics-apiserver</span></div><div class="x-b" style="grid-area:9/4/10/5"><span>Event source: <span class="x-s">queue, stream, Prometheus</span></span></div><span class="x-c x-v x-ah x-dn e1"></span><span class="x-c x-v x-ah x-dn x-acc e2"></span><span class="x-l e2l x-acc">0 ↔ 1 replicas</span><span class="x-c x-hz e3a"></span><span class="x-c e3b"></span><span class="x-c x-v x-ah x-dn e3c"></span><span class="x-l e3l">creates and manages</span><span class="x-c x-hz x-ah x-lt x-acc e4"></span><span class="x-l e4l x-acc">1 ↔ N replicas, checks every 15&nbsp;s</span><span class="x-c x-v x-ah x-dn e5"></span><span class="x-l e5l">external metrics</span><span class="x-c x-v x-ah x-dn e6"></span><span class="x-c x-dot e7a"></span><span class="x-c x-dot e7b"></span><span class="x-c x-dot x-ah x-rt e7c"></span><span class="x-l e7l">polls every 30&nbsp;s (<code>pollingInterval</code>)</span></div></div>`,
};
