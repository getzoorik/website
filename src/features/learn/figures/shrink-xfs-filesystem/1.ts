import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-shrink-xfs-filesystem-1",
  label:
    "Diagram. An XFS filesystem of 8 allocation groups, AG0 to AG7, 22.8 GiB each and 182.3 GiB in all: xfs_growfs -D can remove only the free tail at the right end of AG7, and AG0 to AG6 can’t be removed because shrinking whole AGs isn’t implemented.",
  style: `.fg-shrink-xfs-filesystem-1 .lk-art{--cap:100%;padding:16px 16px 14px}
.fg-shrink-xfs-filesystem-1 .lk-art > .lk-svg{margin:0}
.fg-shrink-xfs-filesystem-1 .x-cant{width:87.5%;padding:0 4px !important;box-sizing:border-box;font-weight:500;line-height:1.4;color:var(--text);text-align:center;text-wrap:balance}
.fg-shrink-xfs-filesystem-1 .lk-svg.x-br{height:16px;margin-top:4px}
.fg-shrink-xfs-filesystem-1 .lk-svg.x-bar{height:70px;margin-top:3px}
.fg-shrink-xfs-filesystem-1 .lk-svg .x-o{fill:none;stroke:var(--text)}
.fg-shrink-xfs-filesystem-1 .x-ag{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));height:20px;margin-top:-28px;line-height:20px}
.fg-shrink-xfs-filesystem-1 .x-ag > .lk-mono{text-align:center;color:var(--muted)}
.fg-shrink-xfs-filesystem-1 .x-tail{margin-top:10px !important;padding-left:12% !important;font-weight:600;line-height:1.4;color:var(--text);text-align:right;text-wrap:balance}
@container (max-width:419.98px){.fg-shrink-xfs-filesystem-1 .x-ag > :last-child{padding-right:28%}}`,
  html: `<div class="lk-art"><p class="x-cant">Can’t be removed: shrinking whole AGs isn’t implemented</p><svg class="lk-svg x-br" viewBox="0 0 800 16" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="m" d="M4 15V8H696V15M350 8V1"/></svg><svg class="lk-svg x-bar" viewBox="0 0 800 70" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect class="k" x="4" y="1" width="92" height="36" rx="3"/><rect class="k" x="104" y="1" width="92" height="36" rx="3"/><rect class="k" x="204" y="1" width="92" height="36" rx="3"/><rect class="k" x="304" y="1" width="92" height="36" rx="3"/><rect class="k" x="404" y="1" width="92" height="36" rx="3"/><rect class="k" x="504" y="1" width="92" height="36" rx="3"/><rect class="k" x="604" y="1" width="92" height="36" rx="3"/><rect class="k" x="704" y="1" width="92" height="36" rx="3"/><rect class="u" x="768.4" y="1" width="27.6" height="36" rx="3"/><rect class="x-o" x="704" y="1" width="92" height="36" rx="3"/><path class="m" d="M782.2 41V69"/></svg><div class="x-ag"><span class="lk-mono">AG0</span><span class="lk-mono">AG1</span><span class="lk-mono">AG2</span><span class="lk-mono">AG3</span><span class="lk-mono">AG4</span><span class="lk-mono">AG5</span><span class="lk-mono">AG6</span><span class="lk-mono">AG7</span></div><p class="x-tail">Free tail of the last AG: the only part <span class="lk-mono">xfs_growfs -D</span> can remove</p></div><p class="lk-t">An XFS filesystem, 182.3&nbsp;GiB in all</p><p class="lk-s">8 allocation groups (AGs), 22.8&nbsp;GiB each</p>`,
};
