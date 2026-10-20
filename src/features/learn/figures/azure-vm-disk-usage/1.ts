import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-vm-disk-usage-1",
  label:
    "Diagram. One Linux VM seen two ways: Azure sees data disks at LUN 1 and LUN 2 with their provisioned sizes, and df -Th inside the VM sees /dev/sdd1, a 32G ext4 filesystem with 30G used on /opt/db/data, and /dev/sde1, 32G with 49M used on /opt/db/log; the links in /dev/disk/azure/scsi1 join LUN 1 to /dev/sdd and LUN 2 to /dev/sde.",
  style: `.fg-azure-vm-disk-usage-1 .x-map{display:grid;grid-template-columns:minmax(0,1fr) 172px minmax(0,1fr);grid-template-areas:"ha lk hv" "a1 r1 v1" "a2 r2 v2";gap:10px 12px}
.fg-azure-vm-disk-usage-1 .x-h{align-self:end;font-weight:600;line-height:1.4;color:var(--text)}
.fg-azure-vm-disk-usage-1 .x-ha{grid-area:ha}
.fg-azure-vm-disk-usage-1 .x-hv{grid-area:hv}
.fg-azure-vm-disk-usage-1 .x-lk{grid-area:lk;align-self:end;display:flex;align-items:center;justify-content:center;gap:6px;color:var(--muted);font-weight:500}
.fg-azure-vm-disk-usage-1 .x-lk svg{display:none;flex:none;width:14px;height:10px;fill:none;stroke:var(--muted);stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}
.fg-azure-vm-disk-usage-1 .x-lk .lk-mono{color:var(--muted)}
.fg-azure-vm-disk-usage-1 .x-c{display:flex;flex-direction:column;min-width:0;padding:12px 14px;border-radius:var(--r-card);background:var(--surface-2)}
.fg-azure-vm-disk-usage-1 .x-c .lk-t{margin-top:0 !important}
.fg-azure-vm-disk-usage-1 .x-c .lk-svg{box-sizing:content-box;margin-top:auto;padding-top:10px}
.fg-azure-vm-disk-usage-1 .x-a1{grid-area:a1}.fg-azure-vm-disk-usage-1 .x-v1{grid-area:v1}.fg-azure-vm-disk-usage-1 .x-r1{grid-area:r1}
.fg-azure-vm-disk-usage-1 .x-a2{grid-area:a2}.fg-azure-vm-disk-usage-1 .x-v2{grid-area:v2}.fg-azure-vm-disk-usage-1 .x-r2{grid-area:r2}
.fg-azure-vm-disk-usage-1 .x-r{position:relative;min-height:24px}
.fg-azure-vm-disk-usage-1 .x-r::before{content:"";position:absolute;left:2px;right:3px;top:50%;height:1.5px;margin-top:-.75px;background:var(--muted)}
.fg-azure-vm-disk-usage-1 .x-r::after{content:"";position:absolute;right:3px;top:50%;width:7px;height:7px;margin-top:-4.25px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg);transform-origin:center}
.fg-azure-vm-disk-usage-1 .x-dev{font-weight:600}
@container (max-width:419.98px){
  .fg-azure-vm-disk-usage-1 .x-map{grid-template-columns:minmax(0,1fr) 20px minmax(0,1fr);grid-template-areas:"ha . hv" "a1 r1 v1" "a2 r2 v2" "lk lk lk";gap:8px 6px}
  .fg-azure-vm-disk-usage-1 .x-c{padding:10px 10px 12px}
  .fg-azure-vm-disk-usage-1 .x-lk{margin-top:4px;justify-content:flex-start}
  .fg-azure-vm-disk-usage-1 .x-lk svg{display:block}
}`,
  html: `<div class="x-map"><p class="x-h x-ha">What Azure sees</p><p class="x-lk"><svg viewBox="0 0 14 10" aria-hidden="true" focusable="false"><path d="M1 5h11.5M9 1.5 12.5 5 9 8.5"/></svg><span class="lk-mono">/dev/disk/azure/scsi1</span></p><p class="x-h x-hv">What the VM sees (<span class="lk-mono">df -Th</span>)</p><div class="x-c x-a1"><p class="lk-t">Data disk at LUN&nbsp;1</p><p class="lk-s">Provisioned size, from <span class="lk-mono">az disk list</span></p><svg class="lk-svg" viewBox="0 0 120 10" style="aspect-ratio:120/10" aria-hidden="true" focusable="false"><rect class="g" x="1" y="1" width="118" height="8" rx="2"/></svg></div><span class="x-r x-r1" aria-hidden="true"></span><div class="x-c x-v1"><p class="lk-t"><span class="lk-mono x-dev">/dev/sdd1</span></p><p class="lk-s">ext4, 32G, 30G used</p><p class="lk-s">on <span class="lk-mono">/opt/db/data</span></p><svg class="lk-svg" viewBox="0 0 120 10" style="aspect-ratio:120/10" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="118" height="8" rx="2"/><rect class="u" x="1" y="1" width="110.63" height="8" rx="2"/></svg></div><div class="x-c x-a2"><p class="lk-t">Data disk at LUN&nbsp;2</p><p class="lk-s">Provisioned size, from <span class="lk-mono">az disk list</span></p><svg class="lk-svg" viewBox="0 0 120 10" style="aspect-ratio:120/10" aria-hidden="true" focusable="false"><rect class="g" x="1" y="1" width="118" height="8" rx="2"/></svg></div><span class="x-r x-r2" aria-hidden="true"></span><div class="x-c x-v2"><p class="lk-t"><span class="lk-mono x-dev">/dev/sde1</span></p><p class="lk-s">ext4, 32G, 49M used</p><p class="lk-s">on <span class="lk-mono">/opt/db/log</span></p><svg class="lk-svg" viewBox="0 0 120 10" style="aspect-ratio:120/10" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="118" height="8" rx="2"/><rect class="u" x="1" y="1" width="1" height="8" rx=".5"/></svg></div></div>`,
};
