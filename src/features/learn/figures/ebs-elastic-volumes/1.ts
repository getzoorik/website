import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-ebs-elastic-volumes-1",
  label:
    "Diagram. One modification of a 1 TiB gp3 volume, left to right: modify-volume submitted, then modifying, then optimizing, where the new size is usable, usually within seconds, and performance sits between old and new, then completed, with the full new performance typically up to about 6 hours for 1 TiB, then the next modification can start, at most 4 in any rolling 24 hours; a bar under the whole line shows the volume is billed at the new configuration from the start of the modification.",
  style: `.ln-d.fg-ebs-elastic-volumes-1 .ev-g{display:grid;grid-template-columns:minmax(0,1fr) 4px;column-gap:14px;row-gap:14px}
.ln-d.fg-ebs-elastic-volumes-1 p.ev-h{grid-area:1/1/2/3;margin-bottom:-4px !important}
.ln-d.fg-ebs-elastic-volumes-1 p.ev-c{position:relative;display:grid;grid-template-columns:minmax(0,1fr);row-gap:3px;align-content:start;padding:10px 12px !important;border-radius:var(--r-card);background:var(--surface-2);line-height:1.4}
.ln-d.fg-ebs-elastic-volumes-1 p.ev-c.is-d{background:var(--ln-a14)}
.ln-d.fg-ebs-elastic-volumes-1 p.ev-c1{grid-area:2/1}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c2{grid-area:3/1}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c3{grid-area:4/1}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c4{grid-area:5/1}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c5{grid-area:6/1}
.ln-d.fg-ebs-elastic-volumes-1 .ev-n{font-weight:600;color:var(--text);text-wrap:balance}
.ln-d.fg-ebs-elastic-volumes-1 .ev-n .lk-mono{font-weight:600}
.ln-d.fg-ebs-elastic-volumes-1 .ev-d{font-weight:500;color:var(--muted);text-wrap:pretty}
.ln-d.fg-ebs-elastic-volumes-1 p.ev-c:not(.ev-c5)::after{content:"";position:absolute;left:50%;bottom:-11px;width:6px;height:6px;margin-left:-3px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.ln-d.fg-ebs-elastic-volumes-1 .ev-bar{grid-area:2/2/7/3;justify-self:center;width:4px;border-radius:2px;background:var(--text)}
.ln-d.fg-ebs-elastic-volumes-1 p.ev-bl{grid-area:7/1/8/3;justify-self:end;margin-top:-6px !important;font-weight:600;line-height:1.4;color:var(--text);text-align:right;text-wrap:balance}
@container (min-width:548px){
  .ln-d.fg-ebs-elastic-volumes-1 .ev-g{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr) minmax(0,1.4fr) minmax(0,1.4fr) minmax(0,1.05fr);row-gap:0}
  .ln-d.fg-ebs-elastic-volumes-1 p.ev-h{grid-area:1/1/2/6;margin-bottom:10px !important}
  .ln-d.fg-ebs-elastic-volumes-1 p.ev-c{padding:10px 11px 12px !important}
  .ln-d.fg-ebs-elastic-volumes-1 p.ev-c1{grid-area:2/1}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c2{grid-area:2/2}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c3{grid-area:2/3}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c4{grid-area:2/4}.ln-d.fg-ebs-elastic-volumes-1 p.ev-c5{grid-area:2/5}
  .ln-d.fg-ebs-elastic-volumes-1 p.ev-c:not(.ev-c5)::after{left:auto;right:-10.5px;bottom:auto;top:50%;margin:-3px 0 0;transform:rotate(-45deg)}
  .ln-d.fg-ebs-elastic-volumes-1 .ev-bar{grid-area:3/1/4/6;justify-self:stretch;width:auto;height:4px;margin-top:12px}
  .ln-d.fg-ebs-elastic-volumes-1 p.ev-bl{grid-area:4/1/5/6;justify-self:start;margin-top:6px !important;text-align:left}
}`,
  html: `<div class="ev-g"><p class="lk-s ev-h">One modification of a 1&nbsp;TiB <span class="lk-mono">gp3</span> volume</p><p class="ev-c ev-c1"><span class="ev-n"><span class="lk-mono">modify-volume</span> submitted</span></p><p class="ev-c ev-c2"><span class="ev-n"><span class="lk-mono">modifying</span></span></p><p class="ev-c ev-c3 is-d"><span class="ev-n"><span class="lk-mono">optimizing</span></span><span class="ev-d">New size usable (usually seconds), performance between old and new</span></p><p class="ev-c ev-c4"><span class="ev-n"><span class="lk-mono">completed</span></span><span class="ev-d">Full new performance (typically up to about 6&nbsp;hours for 1&nbsp;TiB)</span></p><p class="ev-c ev-c5"><span class="ev-n">Next modification can start</span><span class="ev-d">At most 4 in any rolling 24&nbsp;hours</span></p><span class="ev-bar" aria-hidden="true"></span><p class="ev-bl">Billed at the new configuration from the start of the modification</p></div>`,
};
