import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-shrink-azure-managed-disk-1",
  label:
    "Diagram. A 2,048 GiB disk drawn as one bar with data blocks spread along its length; shrinking it in place at the 1,024 GiB mark would cut off the three blocks that sit past that mark, so their data is lost.",
  style: `.fg-shrink-azure-managed-disk-1 .lk-svg .cut{fill:none;stroke:var(--text);stroke-dasharray:4 3}
.fg-shrink-azure-managed-disk-1 .f3-a{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;margin-bottom:6px;line-height:1.4}
.fg-shrink-azure-managed-disk-1 .f3-c{grid-column:2;text-align:center;font-weight:600;color:var(--text)}
.fg-shrink-azure-managed-disk-1 .f3-c .lk-mono{display:block;font-weight:500;color:var(--muted)}
.fg-shrink-azure-managed-disk-1 .f3-e{grid-column:3;justify-self:end}
.fg-shrink-azure-managed-disk-1 .f3-e .lk-mono{color:var(--muted)}
.fg-shrink-azure-managed-disk-1 .f3-b{position:relative;height:18px;margin-top:4px}
.fg-shrink-azure-managed-disk-1 .f3-l{position:absolute;top:0;left:77.000%;transform:translateX(-50%);font-weight:600;color:var(--accent);white-space:nowrap}`,
  html: `<div class="lk-art" style="--cap:100%"><div class="f3-a"><p class="f3-c">Shrink in place<span class="lk-mono">1,024 GiB</span></p><p class="f3-e"><span class="lk-mono">2,048 GiB</span></p></div><svg class="lk-svg" viewBox="0 0 600 54" style="aspect-ratio:600/54" aria-hidden="true" focusable="false"><rect class="n" x="0" y="10" width="600" height="28" rx="3"/><rect class="uk" x="14" y="14" width="26" height="20" rx="2"/><rect class="uk" x="56" y="14" width="18" height="20" rx="2"/><rect class="uk" x="90" y="14" width="30" height="20" rx="2"/><rect class="uk" x="148" y="14" width="22" height="20" rx="2"/><rect class="uk" x="194" y="14" width="26" height="20" rx="2"/><rect class="uk" x="250" y="14" width="20" height="20" rx="2"/><rect class="u" x="336" y="14" width="24" height="20" rx="2"/><rect class="u" x="450" y="14" width="28" height="20" rx="2"/><rect class="u" x="566" y="14" width="22" height="20" rx="2"/><path class="cut" d="M300 0v48"/><path class="m" d="M336 44v6h252v-6"/></svg><div class="f3-b"><span class="f3-l">Data lost</span></div></div><p class="lk-t">A <span class="lk-mono">2,048 GiB</span> disk with data blocks spread along its length</p>`,
};
