import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-what-is-keda-1",
  label:
    "Diagram. The keda-operator polls the event source (a queue, topic or Prometheus) every 30 s, scales the Deployment between 0 and 1 replica, and creates and manages an HPA, keda-hpa-<name>, which reads external metrics from keda-operator-metrics-apiserver and scales the Deployment between 1 and N replicas every 15 s.",
  style: `.fg-what-is-keda-1 .zf-g{position:relative;display:grid}
.fg-what-is-keda-1 .zf-b{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:0;padding:8px 10px;box-sizing:border-box;
  border:1.5px solid var(--line);border-radius:3px;background:#fff;text-align:center;font-weight:600;line-height:1.35;color:var(--text)}
.fg-what-is-keda-1 .zf-b.zf-k{border-color:var(--text)}
.fg-what-is-keda-1 .zf-s{font-weight:500;color:var(--muted)}
.fg-what-is-keda-1 .zf-m{font-family:var(--code);font-size:.95em;font-weight:500;color:var(--muted)}
.fg-what-is-keda-1 .zf-c{position:absolute;box-sizing:border-box;border:0 solid var(--muted)}
.fg-what-is-keda-1 .zf-c.zf-ac{border-color:var(--accent)}
.fg-what-is-keda-1 .zf-c.zf-dt{border-style:dotted}
.fg-what-is-keda-1 .zf-h{left:0;right:0;top:50%;height:0;margin-top:-.75px;border-top-width:1.5px}
.fg-what-is-keda-1 .zf-v{top:0;bottom:0;left:50%;width:0;margin-left:-.75px;border-left-width:1.5px}
.fg-what-is-keda-1 .zf-c::after{position:absolute;box-sizing:border-box;width:7px;height:7px;border:0 solid;border-color:inherit;border-right-width:1.5px;border-bottom-width:1.5px}
.fg-what-is-keda-1 .zf-r::after,.fg-what-is-keda-1 .zf-d::after,.fg-what-is-keda-1 .zf-u::after,.fg-what-is-keda-1 .zf-el::after{content:""}
.fg-what-is-keda-1 .zf-r::after{right:1.5px;top:-4.25px;transform:rotate(-45deg)}
.fg-what-is-keda-1 .zf-l::after{content:"";left:1.5px;top:-4.25px;transform:rotate(135deg)}
.fg-what-is-keda-1 .zf-d::after{bottom:1.5px;left:-4.25px;transform:rotate(45deg)}
.fg-what-is-keda-1 .zf-u::after{top:1.5px;left:-4.25px;transform:rotate(-135deg)}
.fg-what-is-keda-1 .zf-t{position:absolute;font-weight:500;line-height:1.35;color:var(--muted);white-space:nowrap}
.fg-what-is-keda-1 .zf-t.zf-ac{color:var(--accent)}
.fg-what-is-keda-1 .zf-t .zf-m{font-size:.95em}
.fg-what-is-keda-1 .zf-ab{bottom:calc(50% + 5px)}
.fg-what-is-keda-1 .zf-be{top:calc(50% + 5px)}
.fg-what-is-keda-1 .zf-cx{left:0;right:0;text-align:center}
.fg-what-is-keda-1 .zf-sd{top:50%;transform:translateY(-50%)}
/* desktop: event source and the metrics server on the left, keda-operator and the HPA in the middle, the Deployment right */
@container (min-width:660px){
  .fg-what-is-keda-1 .zf-ph{display:none}
  .fg-what-is-keda-1 .zf-g{grid-template-columns:minmax(0,1fr) 124px minmax(0,1fr) 120px minmax(0,.7fr);grid-template-rows:auto 52px auto}
  .fg-what-is-keda-1 .b-es{grid-area:1/1/2/2} .fg-what-is-keda-1 .b-op{grid-area:1/3/2/4} .fg-what-is-keda-1 .b-ms{grid-area:3/1/4/2} .fg-what-is-keda-1 .b-hpa{grid-area:3/3/4/4} .fg-what-is-keda-1 .b-dep{grid-area:1/5/4/6}
  .fg-what-is-keda-1 .d-poll{grid-area:1/2/2/3} .fg-what-is-keda-1 .d-zero{grid-area:1/4/2/5} .fg-what-is-keda-1 .d-cm{grid-area:2/3/3/4} .fg-what-is-keda-1 .d-es{grid-area:2/1/3/2}
  .fg-what-is-keda-1 .d-ext{grid-area:3/2/4/3} .fg-what-is-keda-1 .d-n{grid-area:3/4/4/5}
  .fg-what-is-keda-1 .d-cmt{grid-area:2/3/3/4;left:calc(50% + 10px)}
}
/* phone: event source on top, the two tracks side by side, the Deployment at the foot */
@container (max-width:659.98px){
  .fg-what-is-keda-1 .zf-dk{display:none}
  .fg-what-is-keda-1 .lk-art{padding:14px 12px}
  .fg-what-is-keda-1 .zf-g{grid-template-columns:minmax(0,1fr) 28px minmax(0,1fr);grid-template-rows:auto 58px auto 58px auto 58px auto}
  .fg-what-is-keda-1 .b-es{grid-area:1/1/2/4} .fg-what-is-keda-1 .b-op{grid-area:3/1/4/2} .fg-what-is-keda-1 .b-ms{grid-area:3/3/4/4} .fg-what-is-keda-1 .b-hpa{grid-area:5/3/6/4} .fg-what-is-keda-1 .b-dep{grid-area:7/1/8/4}
  .fg-what-is-keda-1 .zf-ph.zf-v{left:20px}
  .fg-what-is-keda-1 .p-poll{grid-area:2/1/3/2} .fg-what-is-keda-1 .p-es{grid-area:2/3/3/4} .fg-what-is-keda-1 .p-zero{grid-area:4/1/7/2} .fg-what-is-keda-1 .p-ext{grid-area:4/3/5/4} .fg-what-is-keda-1 .p-n{grid-area:6/3/7/4}
  .fg-what-is-keda-1 .p-cm1{grid-area:4/1/5/2;left:50% !important}
  .fg-what-is-keda-1 .p-cm2{grid-area:5/1/6/3;top:0;bottom:50%;left:calc((100% - 28px) / 2);right:0;margin-bottom:-.75px;margin-left:-.75px;border-left-width:1.5px;border-bottom-width:1.5px;border-bottom-left-radius:4px}
  .fg-what-is-keda-1 .p-cm2::after{content:"";right:1.5px;bottom:-4.25px;transform:rotate(-45deg)}
  .fg-what-is-keda-1 .zf-ph.zf-t{left:30px}
  .fg-what-is-keda-1 .p-pollt{grid-area:2/1/3/3} .fg-what-is-keda-1 .p-extt{grid-area:4/3/5/4} .fg-what-is-keda-1 .p-nt{grid-area:6/3/7/4} .fg-what-is-keda-1 .p-zerot{grid-area:6/1/7/2}
  .fg-what-is-keda-1 .p-cmt{grid-area:4/1/5/3;left:calc((100% - 28px) / 2 + 10px) !important;white-space:normal;max-width:7.4em}
}`,
  html: `<div class="lk-art"><div class="zf-g"><div class="zf-b b-es"><span>Event source</span><span class="zf-s">(queue, topic, Prometheus)</span></div><div class="zf-b b-op"><span>keda-operator</span></div><div class="zf-b b-ms"><span>keda-operator-metrics-apiserver</span></div><div class="zf-b b-hpa"><span>HPA</span><span class="zf-m">(keda-hpa-&lt;name&gt;)</span></div><div class="zf-b zf-k b-dep"><span>Deployment</span></div><span class="zf-c zf-h zf-dt zf-l zf-dk d-poll"></span><span class="zf-t zf-ab zf-cx zf-dk d-poll">polls every 30&nbsp;s</span><span class="zf-t zf-be zf-cx zf-dk d-poll"><span class="zf-m">pollingInterval</span></span><span class="zf-c zf-h zf-ac zf-r zf-dk d-zero"></span><span class="zf-t zf-ab zf-cx zf-ac zf-dk d-zero">0 ↔ 1 replica</span><span class="zf-c zf-v zf-d zf-dk d-cm"></span><span class="zf-t zf-sd zf-dk d-cmt">creates and manages</span><span class="zf-c zf-h zf-r zf-dk d-ext"></span><span class="zf-t zf-ab zf-cx zf-dk d-ext">external metrics</span><span class="zf-c zf-h zf-ac zf-r zf-dk d-n"></span><span class="zf-t zf-ab zf-cx zf-ac zf-dk d-n">1 ↔ N replicas,</span><span class="zf-t zf-be zf-cx zf-ac zf-dk d-n">every 15&nbsp;s</span><span class="zf-c zf-v zf-dt zf-u zf-ph p-poll"></span><span class="zf-t zf-sd zf-ph p-pollt">polls every 30&nbsp;s<br><span class="zf-m">pollingInterval</span></span><span class="zf-c zf-v zf-ac zf-d zf-ph p-zero"></span><span class="zf-t zf-sd zf-ac zf-ph p-zerot">0 ↔ 1 replica</span><span class="zf-c zf-v zf-ph p-cm1"></span><span class="zf-c zf-ph p-cm2"></span><span class="zf-t zf-sd zf-ph p-cmt">creates and manages</span><span class="zf-c zf-v zf-d zf-ph p-ext"></span><span class="zf-t zf-sd zf-ph p-extt">external metrics</span><span class="zf-c zf-v zf-ac zf-d zf-ph p-n"></span><span class="zf-t zf-sd zf-ac zf-ph p-nt">1 ↔ N replicas,<br>every 15&nbsp;s</span></div></div>`,
};
