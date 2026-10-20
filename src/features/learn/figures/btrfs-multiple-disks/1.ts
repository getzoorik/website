import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-btrfs-multiple-disks-1",
  label:
    "Diagram. The same two disks, 50 GiB and 100 GiB, under two profiles: with data single and metadata raid1, data fills both disks beside 3 GiB of metadata mirrored on each, for roughly 144 GiB usable; with data and metadata both raid1, every chunk sits on both disks, the top 50 GiB of the 100 GiB disk stays unused, and at most 50 GiB is usable.",
  style: `.fg-btrfs-multiple-disks-1 .lk-art{--cap:100%}
.fg-btrfs-multiple-disks-1 .x-d{font-weight:500;line-height:1.4;color:var(--text)}
.fg-btrfs-multiple-disks-1 .x-d + .lk-svg{margin-top:4px}
.fg-btrfs-multiple-disks-1 .lk-svg .x-un{fill:var(--line);stroke:var(--ln-g);stroke-dasharray:4 3}
.fg-btrfs-multiple-disks-1 .x-use{margin-top:6px !important;font-weight:500;line-height:1.4;color:var(--muted)}
.fg-btrfs-multiple-disks-1 .x-use b{font-weight:600;color:var(--text)}
.fg-btrfs-multiple-disks-1 .x-key{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:14px !important;padding-top:12px !important;border-top:1px solid var(--line);color:var(--muted);font-weight:500}
.fg-btrfs-multiple-disks-1 .x-key > span{display:inline-flex;align-items:center;gap:8px}
.fg-btrfs-multiple-disks-1 .x-sw{flex:none;box-sizing:border-box;width:12px;height:12px;border-radius:3px}
.fg-btrfs-multiple-disks-1 .x-sw.u{background:var(--accent)}
.fg-btrfs-multiple-disks-1 .x-sw.uk{background:var(--text)}
.fg-btrfs-multiple-disks-1 .x-bw{position:relative;margin-top:4px}
.fg-btrfs-multiple-disks-1 .x-ul{position:absolute;left:50.5%;right:1.5%;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-weight:500;line-height:1;color:var(--text)}
.fg-btrfs-multiple-disks-1 .x-bw + .x-d,.fg-btrfs-multiple-disks-1 .lk-svg + .x-d{margin-top:10px !important}
@container (max-width:419.98px){.fg-btrfs-multiple-disks-1 .lk-vh{grid-template-columns:minmax(0,1fr);gap:20px}}`,
  html: `<div class="lk-vh"><div><div class="lk-art"><p class="x-d">Disk 1, 50&nbsp;GiB</p><svg class="lk-svg" viewBox="0 0 202 22" style="aspect-ratio:202/22" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="102" height="20" rx="3"/><rect class="uk" x="3" y="3" width="5.38" height="16" rx="1.5"/><rect class="u" x="9.38" y="3" width="91.62" height="16" rx="1.5"/></svg><p class="x-d">Disk 2, 100&nbsp;GiB</p><svg class="lk-svg" viewBox="0 0 202 22" style="aspect-ratio:202/22" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="200" height="20" rx="3"/><rect class="uk" x="3" y="3" width="5.38" height="16" rx="1.5"/><rect class="u" x="9.38" y="3" width="189.62" height="16" rx="1.5"/></svg></div><p class="lk-t">Data <span class="lk-mono">single</span>, metadata <span class="lk-mono">raid1</span></p><p class="lk-s">3&nbsp;GiB of metadata mirrored on each disk</p><p class="x-use">Usable: <b>roughly 144&nbsp;GiB</b></p></div><div><div class="lk-art"><p class="x-d">Disk 1, 50&nbsp;GiB</p><svg class="lk-svg" viewBox="0 0 202 22" style="aspect-ratio:202/22" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="102" height="20" rx="3"/><rect class="uk" x="3" y="3" width="5.38" height="16" rx="1.5"/><rect class="u" x="9.38" y="3" width="91.62" height="16" rx="1.5"/></svg><p class="x-d">Disk 2, 100&nbsp;GiB</p><div class="x-bw"><svg class="lk-svg" viewBox="0 0 202 22" style="aspect-ratio:202/22" aria-hidden="true" focusable="false"><rect class="n" x="1" y="1" width="200" height="20" rx="3"/><rect class="uk" x="3" y="3" width="5.38" height="16" rx="1.5"/><rect class="u" x="9.38" y="3" width="91.62" height="16" rx="1.5"/><rect class="x-un" x="102" y="3" width="97" height="16" rx="1.5"/></svg><span class="x-ul">Unused</span></div></div><p class="lk-t">Data <span class="lk-mono">raid1</span>, metadata <span class="lk-mono">raid1</span></p><p class="lk-s">Every chunk on both disks</p><p class="x-use">Usable: <b>at most 50&nbsp;GiB</b></p></div></div><p class="x-key"><span><span class="x-sw u"></span>Data</span><span><span class="x-sw uk"></span>Metadata</span></p>`,
};
