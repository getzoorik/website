import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-disk-expand-without-downtime-1",
  label:
    "Diagram. Four layers grow in turn, top to bottom, while the VM keeps running and the mount stays in place: the managed disk in Azure from 256 GiB to 512 GiB, then the device the kernel sees, /dev/sdc, then the partition, /dev/sdc1, then the filesystem at /datadrive.",
  style: `.fg-azure-disk-expand-without-downtime-1 .x-w{display:grid;grid-template-columns:minmax(0,1fr) 128px;grid-template-areas:"st ar";column-gap:14px}
.fg-azure-disk-expand-without-downtime-1 .x-st{grid-area:st;display:grid;gap:8px}
.fg-azure-disk-expand-without-downtime-1 .x-l{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 16px;min-width:0;padding:11px 14px !important;border:1px solid var(--line);border-radius:var(--r-ctl);background:#fff;line-height:1.4}
.fg-azure-disk-expand-without-downtime-1 .x-l:nth-child(2){margin-left:18px !important}
.fg-azure-disk-expand-without-downtime-1 .x-l:nth-child(3){margin-left:36px !important}
.fg-azure-disk-expand-without-downtime-1 .x-l:nth-child(4){margin-left:54px !important}
.fg-azure-disk-expand-without-downtime-1 .x-n{font-weight:600;color:var(--text)}
.fg-azure-disk-expand-without-downtime-1 .x-n .lk-mono{font-weight:600}
.fg-azure-disk-expand-without-downtime-1 .x-l:first-child .x-n .lk-mono{color:var(--accent)}
.fg-azure-disk-expand-without-downtime-1 .x-c{font-weight:500;color:var(--muted)}
.fg-azure-disk-expand-without-downtime-1 .x-ar{grid-area:ar;display:grid;grid-template-columns:9px minmax(0,1fr);align-items:center;column-gap:12px}
.fg-azure-disk-expand-without-downtime-1 .x-ar i{position:relative;align-self:stretch;margin:12px 0 !important}
.fg-azure-disk-expand-without-downtime-1 .x-ar i::before{content:"";position:absolute;left:3.75px;top:0;bottom:1px;width:1.5px;background:var(--accent)}
.fg-azure-disk-expand-without-downtime-1 .x-ar i::after{content:"";position:absolute;left:1px;bottom:1px;width:7px;height:7px;border-right:1.5px solid var(--accent);border-bottom:1.5px solid var(--accent);transform:rotate(45deg)}
.fg-azure-disk-expand-without-downtime-1 .x-ar span{font-weight:600;line-height:1.4;color:var(--text);text-wrap:balance}
@container (max-width:547.98px){
  .fg-azure-disk-expand-without-downtime-1 .x-w{grid-template-columns:minmax(0,1fr) 9px;grid-template-areas:"st ar" "lb lb";row-gap:10px;column-gap:12px}
  .fg-azure-disk-expand-without-downtime-1 .x-ar{display:contents}
  .fg-azure-disk-expand-without-downtime-1 .x-ar i{grid-area:ar}
  .fg-azure-disk-expand-without-downtime-1 .x-ar span{grid-area:lb;justify-self:end;text-align:right}
  .fg-azure-disk-expand-without-downtime-1 .x-l{flex-direction:column;align-items:flex-start;padding:10px 12px !important}
  .fg-azure-disk-expand-without-downtime-1 .x-l:nth-child(2){margin-left:10px !important}
  .fg-azure-disk-expand-without-downtime-1 .x-l:nth-child(3){margin-left:20px !important}
  .fg-azure-disk-expand-without-downtime-1 .x-l:nth-child(4){margin-left:30px !important}
}`,
  html: `<div class="lk-art"><div class="x-w"><div class="x-st"><p class="x-l"><span class="x-n">Managed disk in Azure: <span class="lk-mono">256&nbsp;GiB to 512&nbsp;GiB</span></span><span class="x-c">portal or <span class="lk-mono">az disk update</span></span></p><p class="x-l"><span class="x-n">Device the kernel sees: <span class="lk-mono">/dev/sdc</span></span><span class="x-c">rescan</span></p><p class="x-l"><span class="x-n">Partition: <span class="lk-mono">/dev/sdc1</span></span><span class="x-c"><span class="lk-mono">growpart</span></span></p><p class="x-l"><span class="x-n">Filesystem at <span class="lk-mono">/datadrive</span></span><span class="x-c"><span class="lk-mono">xfs_growfs</span> or <span class="lk-mono">resize2fs</span></span></p></div><p class="x-ar"><i></i><span>VM running, mount in place</span></p></div></div>`,
};
