import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-vm-disk-space-alert-1",
  label:
    "Diagram. Inside the VM, Azure Monitor Agent reads the guest OS filesystems / and /data and splits into two paths: OpenTelemetry metrics to an Azure Monitor workspace and a query-based metric alert in PromQL (preview), or VM insights logs to the InsightsMetrics table in a Log Analytics workspace and a log search alert in KQL; both end at an email action group, while host metrics from outside the VM report IOPS, throughput, latency and burst credits but no free space.",
  style: `.fg-azure-vm-disk-space-alert-1{--G:12px;--P:10px}
.fg-azure-vm-disk-space-alert-1 p.x-b{display:flex;align-items:center;justify-content:center;min-width:0;padding:8px 10px;border-radius:var(--r-card);background:var(--surface-2);font-weight:500;line-height:1.4;color:var(--text);text-align:center;text-wrap:balance}
.fg-azure-vm-disk-space-alert-1 .x-b .lk-mono{white-space:normal}
.fg-azure-vm-disk-space-alert-1 .x-vm{position:relative;padding:var(--P);border:1.5px solid var(--line);border-radius:var(--r-card)}
.fg-azure-vm-disk-space-alert-1 .x-vl{margin-bottom:8px !important;font-weight:600;line-height:1.4;color:var(--muted)}
.fg-azure-vm-disk-space-alert-1 .x-r1{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:calc(var(--G) + 2 * var(--P))}
.fg-azure-vm-disk-space-alert-1 p.x-os{position:relative;padding:6.5px 8.5px;border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.fg-azure-vm-disk-space-alert-1 .x-os::after{content:"";position:absolute;left:100%;top:50%;width:calc(var(--G) + 2 * var(--P) - 4px);height:1.5px;margin:-.75px 0 0 2px;background:var(--muted)}
.fg-azure-vm-disk-space-alert-1 .x-ag{position:relative}
.fg-azure-vm-disk-space-alert-1 .x-ag::before{content:"";position:absolute;right:100%;top:50%;width:7px;height:7px;margin:-4.25px 3px 0 0;border-top:1.5px solid var(--muted);border-right:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-azure-vm-disk-space-alert-1 .x-ag::after{content:"";position:absolute;left:50%;top:100%;width:1.5px;height:calc(var(--P) + 1.5px);margin-left:-.75px;background:var(--muted)}
.fg-azure-vm-disk-space-alert-1 .x-fk,.fg-azure-vm-disk-space-alert-1 .x-mg{position:relative;display:block;height:26px}
.fg-azure-vm-disk-space-alert-1 .x-fk::before{content:"";position:absolute;left:calc((100% - var(--G)) / 4 - .75px);right:calc((100% - var(--G)) / 4 - .75px);top:11px;bottom:3px;border-top:1.5px solid var(--muted);border-left:1.5px solid var(--muted)}
.fg-azure-vm-disk-space-alert-1 .x-fk::after{content:"";position:absolute;right:calc((100% - var(--G)) / 4 - .75px);top:0;bottom:3px;width:1.5px;background:var(--muted)}
.fg-azure-vm-disk-space-alert-1 .x-hd{position:absolute;bottom:2px;width:7px;height:7px;margin-left:-3.5px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-azure-vm-disk-space-alert-1 .x-h1{left:calc((100% - var(--G)) / 4)}
.fg-azure-vm-disk-space-alert-1 .x-h2{left:calc(100% - (100% - var(--G)) / 4)}
.fg-azure-vm-disk-space-alert-1 .x-hc{left:50%}
.fg-azure-vm-disk-space-alert-1 .x-ln{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:var(--G)}
.fg-azure-vm-disk-space-alert-1 .x-dn{position:relative;display:block;height:18px}
.fg-azure-vm-disk-space-alert-1 .x-dn::before{content:"";position:absolute;left:50%;top:2px;bottom:3px;width:1.5px;margin-left:-.75px;background:var(--muted)}
.fg-azure-vm-disk-space-alert-1 .x-dn::after{content:"";position:absolute;left:50%;bottom:2px;width:7px;height:7px;margin-left:-3.5px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-azure-vm-disk-space-alert-1 .x-mg::before{content:"";position:absolute;left:calc((100% - var(--G)) / 4 - .75px);right:calc((100% - var(--G)) / 4 - .75px);top:0;height:12px;border:1.5px solid var(--muted);border-top:0}
.fg-azure-vm-disk-space-alert-1 .x-mg::after{content:"";position:absolute;left:50%;top:12px;bottom:3px;width:1.5px;margin-left:-.75px;background:var(--muted)}
.fg-azure-vm-disk-space-alert-1 p.x-end{width:calc((100% - var(--G)) / 2);margin:0 auto;padding:6.5px 8.5px;border:1.5px solid var(--text);background:#fff}
.fg-azure-vm-disk-space-alert-1 p.x-host{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 16px;margin-top:16px !important;padding:10px 12px;border:1.5px dashed var(--ln-g);border-radius:var(--r-card);line-height:1.4}
.fg-azure-vm-disk-space-alert-1 .x-host span{font-weight:500;color:var(--text)}
.fg-azure-vm-disk-space-alert-1 .x-host b{font-weight:600;color:var(--muted)}`,
  html: `<div class="x-vm"><p class="x-vl">VM</p><div class="x-r1"><p class="x-b x-os"><span>Guest OS: filesystems <span class="lk-mono">/</span>, <span class="lk-mono">/data</span></span></p><p class="x-b x-ag">Azure Monitor Agent</p></div></div><span class="x-fk" aria-hidden="true"><i class="x-hd x-h1"></i><i class="x-hd x-h2"></i></span><div class="x-ln"><p class="x-b">OpenTelemetry metrics</p><p class="x-b">VM insights logs</p><span class="x-dn" aria-hidden="true"></span><span class="x-dn" aria-hidden="true"></span><p class="x-b">Azure Monitor workspace</p><p class="x-b"><span>Log Analytics workspace, <span class="lk-mono">InsightsMetrics</span></span></p><span class="x-dn" aria-hidden="true"></span><span class="x-dn" aria-hidden="true"></span><p class="x-b">Query-based metric alert (PromQL, preview)</p><p class="x-b">Log search alert (KQL)</p></div><span class="x-mg" aria-hidden="true"><i class="x-hd x-hc"></i></span><p class="x-b x-end">Action group: email</p><p class="x-host"><span>Host metrics: IOPS, throughput, latency, burst credits</span><b>No free space</b></p>`,
};
