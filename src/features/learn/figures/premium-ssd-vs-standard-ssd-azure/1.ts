import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-premium-ssd-vs-standard-ssd-azure-1",
  label:
    "Diagram. Monthly cost of one 512 GiB LRS disk in East US, October 2026, against billed transactions per hour from 0 to 600,000. Premium SSD P20 is flat at $73.22. Standard SSD E20 rises from $38.40 at 0 to $111.69 at its hourly cap of 502,000 an hour and stays flat after it. The lines cross at about 238,000 an hour, about 66 a second.",
  style: `.fg-premium-ssd-vs-standard-ssd-azure-1 .x-w{padding:6px 8px 26px 62px}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-p{position:relative;height:200px;border:1px solid var(--line);border-radius:3px;background:#fff;line-height:1.35}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-svg{position:absolute;inset:0;width:100%;height:100%;max-width:none}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-svg .gl{fill:none;stroke:var(--line)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-svg .l2{fill:none;stroke:var(--text)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-svg .l3{fill:none;stroke:var(--accent)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-p > p,.fg-premium-ssd-vs-standard-ssd-azure-1 .x-p > span{position:absolute;margin:0 !important;white-space:nowrap}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-y{right:calc(100% + 9px);transform:translateY(-50%);font-family:var(--code);font-size:.95em;font-weight:500;color:var(--muted)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-x{top:calc(100% + 7px);font-family:var(--code);font-size:.95em;font-weight:500;color:var(--muted);transform:translateX(-50%)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-x::before{content:"";position:absolute;left:calc(50% - .75px);top:-8px;width:1.5px;height:5px;background:var(--line)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-x.is-0{transform:translateX(-4px)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-x.is-0::before{left:3.25px}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-x.is-e{transform:translateX(-100%)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-x.is-e::before{left:auto;right:-.75px}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-k{font-weight:600}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-l2{left:10px;bottom:calc(52.3% + 6px);font-weight:500;color:var(--text)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-l3{left:10px;top:calc(72.57% + 8px);font-weight:600;color:var(--accent)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-cr{left:calc(39.749% + 10px);top:calc(47.7% + 8px);font-weight:500;color:var(--text)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-cap{right:10px;bottom:calc(79.78% + 6px);font-weight:500;color:var(--text)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-dot{left:39.749%;top:47.7%;box-sizing:border-box;width:9px;height:9px;border:1.5px solid var(--accent);border-radius:50%;background:#fff;transform:translate(-50%,-50%)}
.fg-premium-ssd-vs-standard-ssd-azure-1 .x-key{display:none}
.fg-premium-ssd-vs-standard-ssd-azure-1 .lk-s{margin-top:2px !important}
@container (max-width:547.98px){
  .fg-premium-ssd-vs-standard-ssd-azure-1 .lk-art{padding:14px 12px}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-w{padding:6px 4px 26px 62px}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-p{height:180px}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-x.is-k,.fg-premium-ssd-vs-standard-ssd-azure-1 .x-l2,.fg-premium-ssd-vs-standard-ssd-azure-1 .x-l3{display:none}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-key{display:grid;gap:4px;margin:0 0 12px !important;font-weight:500;color:var(--text)}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-key > span{display:flex;align-items:center;gap:8px}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-key i{flex:none;width:16px;height:0;border-top:2px solid var(--text)}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-key .is-3{font-weight:600;color:var(--accent)}
  .fg-premium-ssd-vs-standard-ssd-azure-1 .x-key .is-3 i{border-color:var(--accent)}
}`,
  html: `<div class="lk-art"><p class="x-key"><span><i></i><span><span class="x-k">Premium SSD P20:</span> <span class="lk-mono">$73.22</span></span></span><span class="is-3"><i></i>Standard SSD E20</span></p><div class="x-w"><div class="x-p"><svg class="lk-svg x-svg" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="gl" d="M0 36.399H502"/><path class="mt" d="M238.493 85.86V180"/><path class="l2" d="M0 85.86H600"/><path class="l3" d="M0 130.629L502 36.399H600"/></svg><span class="x-dot" aria-hidden="true"></span><p class="x-l2"><span class="x-k">Premium SSD P20:</span> <span class="lk-mono">$73.22</span></p><p class="x-l3">Standard SSD E20</p><p class="x-cap">Hourly cap</p><p class="x-cr">About 66 a second</p><p class="x-y" style="top:20.22%">$111.69</p><p class="x-y" style="top:72.57%">$38.40</p><p class="x-y" style="top:100%">$0</p><p class="x-x is-0" style="left:0">0</p><p class="x-x" style="left:39.749%">238,000</p><p class="x-x" style="left:83.667%">502,000</p><p class="x-x is-e is-k" style="left:100%">600,000</p></div></div></div><p class="lk-t">Monthly cost against billed transactions per hour</p><p class="lk-s">One 512 GiB LRS disk in East US, October 2026.</p>`,
};
