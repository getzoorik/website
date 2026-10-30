import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-disk-performance-tiers-1",
  label:
    "Diagram. One 512 GiB Premium SSD over four weeks. Raising the tier keeps the disk at 512 GiB and runs it at P30, billed at $135.17 a month, in week 2 only, and at P20, $73.22 a month, in weeks 1, 3 and 4. Growing the disk takes it to 1,024 GiB and P30 at $135.17 a month from week 2 onward, and it can't shrink back.",
  style: `.fg-azure-disk-performance-tiers-1 .x-g{display:grid;grid-template-columns:136px minmax(0,1fr);gap:0 16px;align-items:center}
.fg-azure-disk-performance-tiers-1 .x-w4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));text-align:center}
.fg-azure-disk-performance-tiers-1 .x-wk{grid-column:2;margin-bottom:8px !important;font-weight:500;color:var(--muted)}
.fg-azure-disk-performance-tiers-1 .x-rl{line-height:1.4}
.fg-azure-disk-performance-tiers-1 .x-rl b{display:block;font-weight:600;color:var(--text)}
.fg-azure-disk-performance-tiers-1 .x-rl span{display:block;font-weight:500;color:var(--muted)}
.fg-azure-disk-performance-tiers-1 .x-rl + .x-tl + .x-rl,.fg-azure-disk-performance-tiers-1 .x-rl + .x-tl + .x-rl + .x-tl{margin-top:18px !important}
.fg-azure-disk-performance-tiers-1 .x-lb{margin-top:6px !important;line-height:1.4;color:var(--muted);font-weight:500}
.fg-azure-disk-performance-tiers-1 .x-lb .lk-mono{display:block}
.fg-azure-disk-performance-tiers-1 .x-lb .x-ac{color:var(--accent);font-weight:600}
.fg-azure-disk-performance-tiers-1 .x-sp{grid-column:2 / span 3;position:relative;padding-top:6px !important}
.fg-azure-disk-performance-tiers-1 .x-sp::before{content:"";position:absolute;top:0;left:7.333%;right:7.333%;height:6px;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 var(--r-ctl) var(--r-ctl)}
.fg-azure-disk-performance-tiers-1 .x-k{display:flex;flex-wrap:wrap;gap:6px 22px;margin-top:12px !important;padding-top:12px !important;border-top:1px solid var(--line);font-weight:500;color:var(--text)}
.fg-azure-disk-performance-tiers-1 .x-k > span{display:inline-flex;align-items:baseline;gap:8px}
.fg-azure-disk-performance-tiers-1 .x-sw{flex:none;position:relative;top:1px;box-sizing:border-box;width:12px;height:12px;border-radius:3px}
.fg-azure-disk-performance-tiers-1 .x-sw.a{border:1.5px solid var(--ln-a45);background:var(--ln-a14)}
.fg-azure-disk-performance-tiers-1 .x-sw.u{background:var(--accent)}
@container (max-width:547.98px){
  .fg-azure-disk-performance-tiers-1 .x-g{grid-template-columns:minmax(0,1fr)}
  .fg-azure-disk-performance-tiers-1 .x-wk{grid-column:1}
  .fg-azure-disk-performance-tiers-1 .x-g > i{display:none}
  .fg-azure-disk-performance-tiers-1 .x-rl{margin-bottom:10px !important}
  .fg-azure-disk-performance-tiers-1 .x-rl b,.fg-azure-disk-performance-tiers-1 .x-rl span{display:inline}
  .fg-azure-disk-performance-tiers-1 .x-rl span::before{content:" · "}
  .fg-azure-disk-performance-tiers-1 .x-rl + .x-tl + .x-rl + .x-tl{margin-top:0 !important}
  .fg-azure-disk-performance-tiers-1 .x-k{flex-direction:column}
}`,
  html: `<div class="lk-art"><div class="x-g"><i aria-hidden="true"></i><p class="x-w4 x-wk"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></p><p class="x-rl"><b>Raise the tier</b><span>Size fixed at 512&nbsp;GiB</span></p><div class="x-tl"><svg class="lk-svg" viewBox="0 0 400 56" style="aspect-ratio:400/56" aria-hidden="true" focusable="false"><rect class="a" x="22" y="28" width="56" height="26" rx="3"/><rect class="u" x="122" y="28" width="56" height="26" rx="3"/><rect class="a" x="222" y="28" width="56" height="26" rx="3"/><rect class="a" x="322" y="28" width="56" height="26" rx="3"/></svg><p class="x-w4 x-lb"><span class="lk-mono">P20</span><span class="lk-mono x-ac">P30</span><span class="lk-mono">P20</span><span class="lk-mono">P20</span></p></div><p class="x-rl"><b>Grow the disk</b><span>Can't shrink back</span></p><div class="x-tl"><svg class="lk-svg" viewBox="0 0 400 56" style="aspect-ratio:400/56" aria-hidden="true" focusable="false"><rect class="a" x="22" y="28" width="56" height="26" rx="3"/><rect class="u" x="122" y="2" width="56" height="52" rx="3"/><rect class="u" x="222" y="2" width="56" height="52" rx="3"/><rect class="u" x="322" y="2" width="56" height="52" rx="3"/></svg><p class="x-w4 x-lb"><span><span class="lk-mono">P20</span>512&nbsp;GiB</span><span class="x-sp"><span class="lk-mono x-ac">P30</span>1,024&nbsp;GiB</span></p></div></div></div><p class="lk-t">One 512&nbsp;GiB Premium SSD in East US, October 2026</p><p class="x-k"><span><span class="x-sw a"></span><span><span class="lk-mono">P20</span>: 2,300 IOPS, 150&nbsp;MB/s, $73.22 a month</span></span><span><span class="x-sw u"></span><span><span class="lk-mono">P30</span>: 5,000 IOPS, 200&nbsp;MB/s, billed at $135.17 a month</span></span></p>`,
};
