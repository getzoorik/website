import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-increase-ebs-volume-size-1",
  label:
    "Diagram. Four layers grow in turn, top to bottom, while the instance keeps running and /data stays mounted: the EBS volume from 500 GiB to 1,000 GiB with modify-volume, then the device the instance sees, /dev/nvme1n1, which takes the new size at optimizing, usually in seconds, then the partition /dev/nvme1n1p1 with growpart, only if the volume has one, then the filesystem at /data with xfs_growfs or resize2fs.",
  style: `.fg-increase-ebs-volume-size-1 .x-w{display:grid;grid-template-columns:minmax(0,1fr) 132px;grid-template-areas:"st ar";column-gap:14px}
.fg-increase-ebs-volume-size-1 .x-st{grid-area:st;display:grid;gap:8px}
.fg-increase-ebs-volume-size-1 .x-l{display:grid;gap:2px;min-width:0;padding:10px 14px !important;border:1px solid var(--line);border-radius:var(--r-ctl);background:#fff;line-height:1.4}
.fg-increase-ebs-volume-size-1 .x-l:nth-child(2){margin-left:18px !important}
.fg-increase-ebs-volume-size-1 .x-l:nth-child(3){margin-left:36px !important}
.fg-increase-ebs-volume-size-1 .x-l:nth-child(4){margin-left:54px !important}
.fg-increase-ebs-volume-size-1 .x-n{font-weight:600;color:var(--text)}
.fg-increase-ebs-volume-size-1 .x-n .lk-mono{font-weight:600}
.fg-increase-ebs-volume-size-1 .x-l:first-child .x-n .lk-mono{color:var(--accent)}
.fg-increase-ebs-volume-size-1 .x-c{font-weight:500;color:var(--muted);text-wrap:balance}
.fg-increase-ebs-volume-size-1 .x-ar{grid-area:ar;display:grid;grid-template-columns:9px minmax(0,1fr);align-items:center;column-gap:12px}
.fg-increase-ebs-volume-size-1 .x-ar i{position:relative;align-self:stretch;margin:12px 0 !important}
.fg-increase-ebs-volume-size-1 .x-ar i::before{content:"";position:absolute;left:3.75px;top:0;bottom:1px;width:1.5px;background:var(--accent)}
.fg-increase-ebs-volume-size-1 .x-ar i::after{content:"";position:absolute;left:1px;bottom:1px;width:7px;height:7px;border-right:1.5px solid var(--accent);border-bottom:1.5px solid var(--accent);transform:rotate(45deg)}
.fg-increase-ebs-volume-size-1 .x-ar span{font-weight:600;line-height:1.4;color:var(--text);text-wrap:balance}
@container (max-width:547.98px){
  .fg-increase-ebs-volume-size-1 .x-w{grid-template-columns:minmax(0,1fr) 9px;grid-template-areas:"st ar" "lb lb";row-gap:10px;column-gap:12px}
  .fg-increase-ebs-volume-size-1 .x-ar{display:contents}
  .fg-increase-ebs-volume-size-1 .x-ar i{grid-area:ar}
  .fg-increase-ebs-volume-size-1 .x-ar span{grid-area:lb;justify-self:end;text-align:right}
  .fg-increase-ebs-volume-size-1 .x-l{padding:10px 12px !important}
  .fg-increase-ebs-volume-size-1 .x-l:nth-child(2){margin-left:10px !important}
  .fg-increase-ebs-volume-size-1 .x-l:nth-child(3){margin-left:20px !important}
  .fg-increase-ebs-volume-size-1 .x-l:nth-child(4){margin-left:30px !important}
}`,
  html: `<div class="lk-art"><div class="x-w"><div class="x-st"><p class="x-l"><span class="x-n">EBS volume: <span class="lk-mono">500&nbsp;GiB to 1,000&nbsp;GiB</span></span><span class="x-c"><span class="lk-mono">modify-volume</span></span></p><p class="x-l"><span class="x-n">Device the instance sees: <span class="lk-mono">/dev/nvme1n1</span></span><span class="x-c">New size at <span class="lk-mono">optimizing</span>, usually seconds</span></p><p class="x-l"><span class="x-n">Partition: <span class="lk-mono">/dev/nvme1n1p1</span></span><span class="x-c"><span class="lk-mono">growpart</span>, only if the volume has one</span></p><p class="x-l"><span class="x-n">Filesystem at <span class="lk-mono">/data</span></span><span class="x-c"><span class="lk-mono">xfs_growfs</span> or <span class="lk-mono">resize2fs</span></span></p></div><p class="x-ar"><i></i><span>Instance running, <span class="lk-mono">/data</span> mounted</span></p></div></div>`,
};
