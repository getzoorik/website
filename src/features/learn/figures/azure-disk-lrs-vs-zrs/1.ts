import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-disk-lrs-vs-zrs-1",
  label:
    "Diagram. One Azure region with availability zones 1, 2 and 3, drawn three times. Regional LRS keeps its three copies in one datacenter in a zone Azure chooses. Zonal LRS keeps a VM and all three copies in zone 1, and attaches only to VMs in zone 1. ZRS keeps one copy in each of zones 1, 2 and 3, so a data disk on a VM in zone 1 can be force detached, then attached to a second VM in zone 2.",
  style: `.fg-azure-disk-lrs-vs-zrs-1 .x-p{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.fg-azure-disk-lrs-vs-zrs-1 .lk-art{--cap:100%}
.fg-azure-disk-lrs-vs-zrs-1 .x-in{max-width:240px;margin:0 auto}
.fg-azure-disk-lrs-vs-zrs-1 .x-z{display:grid;grid-template-columns:54fr 8fr 54fr 8fr 54fr;margin:0 0 6px !important;font-weight:500;line-height:1.3;color:var(--muted);text-align:center;white-space:nowrap}
.fg-azure-disk-lrs-vs-zrs-1 .x-z span:nth-child(2){grid-column:3}
.fg-azure-disk-lrs-vs-zrs-1 .x-z span:nth-child(3){grid-column:5}
.fg-azure-disk-lrs-vs-zrs-1 .lk-svg .ah{fill:none;stroke:var(--accent)}
.fg-azure-disk-lrs-vs-zrs-1 .x-s{display:flex;align-items:baseline;gap:8px}
.fg-azure-disk-lrs-vs-zrs-1 .x-dl{flex:none;position:relative;top:-3px;width:16px;height:0;border-top:1.5px dashed var(--accent)}
.fg-azure-disk-lrs-vs-zrs-1 .x-k{display:flex;flex-wrap:wrap;align-items:center;gap:6px 20px;margin-top:14px !important;padding-top:12px !important;border-top:1px solid var(--line);font-weight:500;color:var(--text)}
.fg-azure-disk-lrs-vs-zrs-1 .x-k > span{display:inline-flex;align-items:center;gap:8px}
.fg-azure-disk-lrs-vs-zrs-1 .x-k .x-r{color:var(--muted)}
.fg-azure-disk-lrs-vs-zrs-1 .x-sw{flex:none;box-sizing:border-box;width:12px;height:12px;border-radius:3px}
.fg-azure-disk-lrs-vs-zrs-1 .x-sw.u{width:9px;height:12px;border-radius:1.5px;background:var(--accent)}
.fg-azure-disk-lrs-vs-zrs-1 .x-sw.uk{width:14px;height:9px;border-radius:2px;background:var(--text)}
.fg-azure-disk-lrs-vs-zrs-1 .x-sw.g{border:1.5px dashed var(--ln-g)}
@container (max-width:547.98px){
  .fg-azure-disk-lrs-vs-zrs-1 .x-p{grid-template-columns:minmax(0,1fr);gap:16px}
  .fg-azure-disk-lrs-vs-zrs-1 .x-in{max-width:228px}
}`,
  html: `<div class="x-p"><div><div class="lk-art"><div class="x-in"><p class="x-z" aria-hidden="true"><span>Zone 1</span><span>Zone 2</span><span>Zone 3</span></p><svg class="lk-svg" viewBox="0 0 180 72" style="aspect-ratio:180/72" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="54" height="70" rx="3"/><rect class="n" x="63" y="1" width="54" height="70" rx="3"/><rect class="n" x="125" y="1" width="54" height="70" rx="3"/><rect class="g" x="68" y="33" width="44" height="30" rx="3"/><rect class="u" x="72" y="40" width="10" height="16" rx="1.5"/><rect class="u" x="85" y="40" width="10" height="16" rx="1.5"/><rect class="u" x="98" y="40" width="10" height="16" rx="1.5"/></svg></div></div><p class="lk-t">Regional LRS</p><p class="lk-s">Zone chosen by Azure</p></div><div><div class="lk-art"><div class="x-in"><p class="x-z" aria-hidden="true"><span>Zone 1</span><span>Zone 2</span><span>Zone 3</span></p><svg class="lk-svg" viewBox="0 0 180 72" style="aspect-ratio:180/72" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="54" height="70" rx="3"/><rect class="n" x="63" y="1" width="54" height="70" rx="3"/><rect class="n" x="125" y="1" width="54" height="70" rx="3"/><rect class="uk" x="13" y="9" width="30" height="15" rx="3"/><rect class="g" x="6" y="33" width="44" height="30" rx="3"/><rect class="u" x="10" y="40" width="10" height="16" rx="1.5"/><rect class="u" x="23" y="40" width="10" height="16" rx="1.5"/><rect class="u" x="36" y="40" width="10" height="16" rx="1.5"/></svg></div></div><p class="lk-t">Zonal LRS</p><p class="lk-s">Attaches only to VMs in zone 1</p></div><div><div class="lk-art"><div class="x-in"><p class="x-z" aria-hidden="true"><span>Zone 1</span><span>Zone 2</span><span>Zone 3</span></p><svg class="lk-svg" viewBox="0 0 180 72" style="aspect-ratio:180/72" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="54" height="70" rx="3"/><rect class="n" x="63" y="1" width="54" height="70" rx="3"/><rect class="n" x="125" y="1" width="54" height="70" rx="3"/><rect class="uk" x="13" y="9" width="30" height="15" rx="3"/><rect class="uk" x="75" y="9" width="30" height="15" rx="3"/><path class="mt" d="M47 16.5h23"/><path class="ah" d="M68 13 71.5 16.5 68 20"/><rect class="u" x="23" y="40" width="10" height="16" rx="1.5"/><rect class="u" x="85" y="40" width="10" height="16" rx="1.5"/><rect class="u" x="147" y="40" width="10" height="16" rx="1.5"/></svg></div></div><p class="lk-t">ZRS</p><p class="lk-s x-s"><span class="x-dl" aria-hidden="true"></span><span>Force detach, then attach (data disks only)</span></p></div></div><p class="x-k"><span><span class="x-sw u"></span>Copy</span><span><span class="x-sw uk"></span>VM</span><span><span class="x-sw g"></span>Datacenter</span><span class="x-r">Each panel is one Azure region</span></p>`,
};
