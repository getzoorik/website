import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-find-unattached-disks-azure-1",
  label:
    "Diagram. A managed disk is Attached while its VM runs, Reserved once the VM is deallocated, and Unattached once the disk is detached or the VM deleted; in all three states it is billed for its provisioned size.",
  style: `.fg-find-unattached-disks-azure-1 .x-g{display:grid;grid-template-columns:minmax(0,1fr) 104px minmax(0,1fr) minmax(0,1fr);grid-template-areas:"arc arc arc arc" "p1 tr p2 p3" "l1 . l2 l3" "bill bill bill bill";column-gap:12px}
.fg-find-unattached-disks-azure-1 .lk-art{--cap:120px}
.fg-find-unattached-disks-azure-1 .x-p1{grid-area:p1}.fg-find-unattached-disks-azure-1 .x-p2{grid-area:p2}.fg-find-unattached-disks-azure-1 .x-p3{grid-area:p3}
.fg-find-unattached-disks-azure-1 .x-l1{grid-area:l1}.fg-find-unattached-disks-azure-1 .x-l2{grid-area:l2}.fg-find-unattached-disks-azure-1 .x-l3{grid-area:l3}
.fg-find-unattached-disks-azure-1 .x-q{font-weight:500;color:var(--muted);white-space:nowrap}
.fg-find-unattached-disks-azure-1 .x-tr{grid-area:tr;align-self:center;display:flex;flex-direction:column;align-items:center;gap:7px;margin:0 -6px !important;font-weight:500;line-height:1.35;color:var(--text);text-align:center;text-wrap:balance}
.fg-find-unattached-disks-azure-1 .x-tr i{position:relative;display:block;width:100%;height:9px}
.fg-find-unattached-disks-azure-1 .x-tr i::before{content:"";position:absolute;left:0;right:1px;top:3.75px;height:1.5px;background:var(--muted)}
.fg-find-unattached-disks-azure-1 .x-tr i::after{content:"";position:absolute;right:1px;top:1px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-find-unattached-disks-azure-1 .x-arc{grid-area:arc;position:relative;height:30px;margin:10px calc((100% - 140px) / 6) 6px !important;border:1.5px solid var(--muted);border-bottom:0;border-radius:var(--r-ctl) var(--r-ctl) 0 0;font-weight:500;line-height:1.35;color:var(--text)}
.fg-find-unattached-disks-azure-1 .x-arc span{position:absolute;left:50%;top:0;padding:0 10px;background:#fff;white-space:nowrap;transform:translate(-50%,-55%)}
.fg-find-unattached-disks-azure-1 .x-arc i{position:absolute;right:-5px;bottom:0;width:7px;height:7px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg);transform-origin:center}
.fg-find-unattached-disks-azure-1 .x-fk{grid-area:fk;display:none}
.fg-find-unattached-disks-azure-1 .x-bill{grid-area:bill;margin-top:14px !important;padding:8px 12px !important;border:1.5px solid var(--ln-a45);border-radius:var(--r-ctl);background:var(--ln-a14);font-weight:600;color:var(--text);text-align:center}
@container (max-width:547.98px){
  .fg-find-unattached-disks-azure-1 .x-g{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:"p1 l1" "fk fk" "tr arc" "p2 p3" "l2 l3" "bill bill"}
  .fg-find-unattached-disks-azure-1 .x-l1{align-self:center;margin-top:0 !important}
  .fg-find-unattached-disks-azure-1 .x-fk{display:block;position:relative;height:16px}
  .fg-find-unattached-disks-azure-1 .x-fk::before{content:"";position:absolute;left:calc((100% - 12px) / 4 - .75px);top:0;bottom:0;width:1.5px;background:var(--muted)}
  .fg-find-unattached-disks-azure-1 .x-fk::after{content:"";position:absolute;left:calc((100% - 12px) / 4 - .75px);right:calc((100% - 12px) / 4 - .75px);top:7px;bottom:0;border-top:1.5px solid var(--muted);border-right:1.5px solid var(--muted);border-top-right-radius:var(--r-ctl)}
  .fg-find-unattached-disks-azure-1 .x-tr,.fg-find-unattached-disks-azure-1 .x-arc{position:relative;align-self:stretch;display:flex;flex-direction:column;align-items:center;gap:6px;height:auto;margin:0 !important;padding:10px 4px 6px !important;border:0;border-radius:0;text-align:center;text-wrap:balance}
  .fg-find-unattached-disks-azure-1 .x-tr::before,.fg-find-unattached-disks-azure-1 .x-arc::before{content:"";position:absolute;left:calc(50% - .75px);top:0;height:8px;width:1.5px;background:var(--muted)}
  .fg-find-unattached-disks-azure-1 .x-arc span{position:static;padding:0;background:none;white-space:normal;transform:none}
  .fg-find-unattached-disks-azure-1 .x-tr i,.fg-find-unattached-disks-azure-1 .x-arc i{position:relative;right:auto;bottom:auto;display:block;flex:1 0 14px;width:9px;height:auto;border:0;transform:none}
  .fg-find-unattached-disks-azure-1 .x-tr i::before,.fg-find-unattached-disks-azure-1 .x-arc i::before{content:"";position:absolute;left:3.75px;right:auto;top:0;bottom:1px;width:1.5px;height:auto;background:var(--muted)}
  .fg-find-unattached-disks-azure-1 .x-tr i::after,.fg-find-unattached-disks-azure-1 .x-arc i::after{content:"";position:absolute;left:1px;right:auto;top:auto;bottom:1px;width:7px;height:7px;border:0;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
}`,
  html: `<div class="x-g"><p class="x-arc"><span>Detach the disk or delete the VM</span><i></i></p><div class="lk-art x-p1"><svg class="lk-svg" viewBox="0 0 120 64" style="aspect-ratio:120/64" aria-hidden="true" focusable="false"><rect class="k" x="34" y="6" width="52" height="26" rx="3"/><path class="m" d="M60 32v8"/><rect class="u" x="38" y="40" width="44" height="18" rx="3"/></svg></div><p class="lk-t x-l1">Attached <span class="x-q">(VM running)</span></p><p class="x-tr"><span>Deallocate the VM</span><i></i></p><div class="lk-art x-p2"><svg class="lk-svg" viewBox="0 0 120 64" style="aspect-ratio:120/64" aria-hidden="true" focusable="false"><rect class="g" x="34" y="6" width="52" height="26" rx="3"/><path class="m" d="M60 32v8"/><rect class="u" x="38" y="40" width="44" height="18" rx="3"/></svg></div><p class="lk-t x-l2">Reserved <span class="x-q">(VM deallocated)</span></p><div class="lk-art x-p3"><svg class="lk-svg" viewBox="0 0 120 64" style="aspect-ratio:120/64" aria-hidden="true" focusable="false"><rect class="u" x="38" y="40" width="44" height="18" rx="3"/></svg></div><p class="lk-t x-l3">Unattached <span class="x-q">(no VM)</span></p><span class="x-fk"></span><p class="x-bill">Billed for the provisioned size</p></div>`,
};
