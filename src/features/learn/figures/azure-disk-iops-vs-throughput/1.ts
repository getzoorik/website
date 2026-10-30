import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-disk-iops-vs-throughput-1",
  label:
    "Diagram. On one Standard_D4s_v5 VM, requests from the application pass the VM uncached limit of 6,400 IOPS and 145 MB/s before reaching four P20 data disks of 2,300 IOPS and 150 MB/s each, 9,200 IOPS and 600 MB/s together, so the smaller limit wins: 6,400 IOPS and 145 MB/s.",
  style: `.fg-azure-disk-iops-vs-throughput-1 .x-g{display:grid;grid-template-columns:auto 30px auto 30px auto 24px minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto minmax(0,1fr);grid-template-areas:"ap a1 . a2 dk br bl" "ap a1 gt a2 dk br bl" "ap a1 cp a2 dk br bl"}
.fg-azure-disk-iops-vs-throughput-1 .x-b{min-width:0;padding:9px 12px !important;border:1px solid var(--line);border-radius:var(--r-ctl);background:#fff;line-height:1.4}
.fg-azure-disk-iops-vs-throughput-1 .x-b b{display:block;font-weight:600;color:var(--text)}
.fg-azure-disk-iops-vs-throughput-1 .x-ap{grid-area:ap;align-self:center;text-align:center}
.fg-azure-disk-iops-vs-throughput-1 .x-gt{grid-area:gt;padding:11px 12px !important;border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.fg-azure-disk-iops-vs-throughput-1 .x-gt .lk-mono{color:var(--accent);font-weight:600}
.fg-azure-disk-iops-vs-throughput-1 .x-cp{grid-area:cp;align-self:start;max-width:176px;margin-top:10px !important;font-weight:500;line-height:1.4;color:var(--text);text-wrap:balance}
.fg-azure-disk-iops-vs-throughput-1 .x-cp .lk-mono{white-space:normal}
.fg-azure-disk-iops-vs-throughput-1 .x-a{position:relative;align-self:center;height:9px}
.fg-azure-disk-iops-vs-throughput-1 .x-a::before{content:"";position:absolute;left:6px;right:7px;top:3.75px;height:1.5px;background:var(--muted)}
.fg-azure-disk-iops-vs-throughput-1 .x-a::after{content:"";position:absolute;right:7px;top:1px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-azure-disk-iops-vs-throughput-1 .x-a1{grid-area:a1}
.fg-azure-disk-iops-vs-throughput-1 .x-a2{grid-area:a2;height:1.5px}
.fg-azure-disk-iops-vs-throughput-1 .x-a2::before{left:0;right:17px;top:0}
.fg-azure-disk-iops-vs-throughput-1 .x-a2::after{display:none}
.fg-azure-disk-iops-vs-throughput-1 .x-dk{grid-area:dk;position:relative;display:grid;grid-auto-rows:1fr;gap:8px}
.fg-azure-disk-iops-vs-throughput-1 .x-dk::before{content:"";position:absolute;left:-18.5px;width:1.5px;top:calc((100% - 24px) / 8 - .75px);bottom:calc((100% - 24px) / 8 - .75px);background:var(--muted)}
.fg-azure-disk-iops-vs-throughput-1 .x-dk .x-b{position:relative;padding:8px 12px !important}
.fg-azure-disk-iops-vs-throughput-1 .x-dk .x-b::before{content:"";position:absolute;left:-17.75px;top:calc(50% - .75px);width:15px;height:1.5px;background:var(--muted)}
.fg-azure-disk-iops-vs-throughput-1 .x-dk .x-b::after{content:"";position:absolute;left:-10px;top:calc(50% - 3.5px);width:6px;height:6px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-azure-disk-iops-vs-throughput-1 .x-br{grid-area:br;position:relative;margin:0 12px 0 4px !important;border:1.5px solid var(--muted);border-left:0;border-radius:0 var(--r-ctl) var(--r-ctl) 0}
.fg-azure-disk-iops-vs-throughput-1 .x-br::after{content:"";position:absolute;left:100%;top:calc(50% - .75px);width:7px;height:1.5px;background:var(--muted)}
.fg-azure-disk-iops-vs-throughput-1 .x-bl{grid-area:bl;align-self:center;line-height:1.4}
.fg-azure-disk-iops-vs-throughput-1 .x-bl b{display:block;font-weight:600;color:var(--text)}
.fg-azure-disk-iops-vs-throughput-1 .x-bl .lk-mono{white-space:normal;font-weight:500}
@container (max-width:547.98px){
  .fg-azure-disk-iops-vs-throughput-1 .x-g{grid-template-columns:minmax(0,1fr);grid-template-rows:none;grid-template-areas:"ap" "a1" "gt" "cp" "a2" "dk" "br" "bl";justify-items:center}
  .fg-azure-disk-iops-vs-throughput-1 .x-ap,.fg-azure-disk-iops-vs-throughput-1 .x-gt,.fg-azure-disk-iops-vs-throughput-1 .x-dk,.fg-azure-disk-iops-vs-throughput-1 .x-br{justify-self:stretch}
  .fg-azure-disk-iops-vs-throughput-1 .x-gt,.fg-azure-disk-iops-vs-throughput-1 .x-cp{text-align:center}
  .fg-azure-disk-iops-vs-throughput-1 .x-cp{max-width:none;margin-top:8px !important}
  .fg-azure-disk-iops-vs-throughput-1 .x-dk .lk-mono{white-space:normal}
  .fg-azure-disk-iops-vs-throughput-1 .x-a{width:9px;height:30px}
  .fg-azure-disk-iops-vs-throughput-1 .x-a1{margin:2px 0 !important}
  .fg-azure-disk-iops-vs-throughput-1 .x-a2{margin:6px 0 8px !important}
  .fg-azure-disk-iops-vs-throughput-1 .x-a::before{left:3.75px;right:auto;top:0;bottom:1px;width:1.5px;height:auto;display:block}
  .fg-azure-disk-iops-vs-throughput-1 .x-a::after{display:block;left:1px;right:auto;top:auto;bottom:1px;border:0;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted)}
  .fg-azure-disk-iops-vs-throughput-1 .x-dk{grid-template-columns:repeat(2,minmax(0,1fr))}
  .fg-azure-disk-iops-vs-throughput-1 .x-dk .x-b::before,.fg-azure-disk-iops-vs-throughput-1 .x-dk .x-b::after,.fg-azure-disk-iops-vs-throughput-1 .x-dk::before{display:none}
  .fg-azure-disk-iops-vs-throughput-1 .x-br{height:12px;margin:8px 0 0 !important;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 var(--r-ctl) var(--r-ctl)}
  .fg-azure-disk-iops-vs-throughput-1 .x-br::after{left:calc(50% - .75px);top:100%;width:1.5px;height:7px}
  .fg-azure-disk-iops-vs-throughput-1 .x-bl{margin-top:14px !important;text-align:center}
}`,
  html: `<div class="lk-art"><div class="x-g"><p class="x-b x-ap"><b>Application</b></p><span class="x-a x-a1" aria-hidden="true"></span><p class="x-b x-gt"><b>VM uncached limit</b><span class="lk-mono">6,400 IOPS, 145&nbsp;MB/s</span></p><p class="x-cp">The smaller limit wins: <span class="lk-mono">6,400 IOPS, 145&nbsp;MB/s</span></p><span class="x-a x-a2" aria-hidden="true"></span><div class="x-dk"><p class="x-b"><b>P20 data disk</b><span class="lk-mono">2,300 IOPS, 150&nbsp;MB/s</span></p><p class="x-b"><b>P20 data disk</b><span class="lk-mono">2,300 IOPS, 150&nbsp;MB/s</span></p><p class="x-b"><b>P20 data disk</b><span class="lk-mono">2,300 IOPS, 150&nbsp;MB/s</span></p><p class="x-b"><b>P20 data disk</b><span class="lk-mono">2,300 IOPS, 150&nbsp;MB/s</span></p></div><span class="x-br" aria-hidden="true"></span><p class="x-bl"><b>Disks together</b><span class="lk-mono">9,200 IOPS, 600&nbsp;MB/s</span></p></div></div><p class="lk-t">Request path for one <span class="lk-mono">Standard_D4s_v5</span> VM</p>`,
};
