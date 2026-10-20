import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-remove-disk-from-lvm-1",
  label:
    "Diagram. One volume group of three disks, A, B and C, 512 GiB each. When the LV fills the VG, it spans all three disks: the filesystem holds 300 GiB, PFree is 0 on every disk and pvmove has nowhere to go. Once the LV is reduced to fit two disks, it spans only disks A and B with free extents left on them, disk C is empty after pvmove, and its next steps are vgreduce, pvremove, detach and delete.",
  style: `.fg-remove-disk-from-lvm-1 .lk-art{padding:12px 14px 14px}
.fg-remove-disk-from-lvm-1 .lk-art + .lk-art{margin-top:10px}
.fg-remove-disk-from-lvm-1 .x-h{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 20px;margin-bottom:12px}
.fg-remove-disk-from-lvm-1 .x-t{font-weight:600;color:var(--text)}
.fg-remove-disk-from-lvm-1 .x-vg{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 12px;padding:12px 10px 10px;border:1.5px dashed var(--accent);border-radius:3px}
.fg-remove-disk-from-lvm-1 .x-vgl{position:absolute;left:8px;top:-9px;padding:0 4px !important;background:var(--surface-2);font-family:var(--code);font-size:.95em;font-weight:500;line-height:16px;color:var(--accent)}
.fg-remove-disk-from-lvm-1 .x-dl{margin-bottom:5px !important;font-weight:500;color:var(--text)}
.fg-remove-disk-from-lvm-1 .x-dl .lk-mono{color:var(--muted)}
.fg-remove-disk-from-lvm-1 .x-bar{box-sizing:border-box;height:30px;padding:3px;border:1.5px solid var(--text);border-radius:3px;background:#fff}
.fg-remove-disk-from-lvm-1 .x-bar > i{display:block;width:calc(100% * var(--f));height:100%;border-radius:1.5px;background:var(--accent)}
.fg-remove-disk-from-lvm-1 .x-ob{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 12px;padding:0 11.5px}
.fg-remove-disk-from-lvm-1 .x-bk{grid-column:1 / -1;height:6px;margin-top:8px;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 3px 3px}
.fg-remove-disk-from-lvm-1 .x-bk.is-c{grid-column:3}
.fg-remove-disk-from-lvm-1 .x-o{grid-column:1 / -1;margin-top:5px !important;text-align:center;font-weight:600;color:var(--text);text-wrap:balance}
.fg-remove-disk-from-lvm-1 .x-o.is-c{grid-column:2 / -1;text-align:right}
.fg-remove-disk-from-lvm-1 .x-o .x-m{display:block;font-weight:500;color:var(--muted)}
.fg-remove-disk-from-lvm-1 .x-key{display:flex;flex-wrap:wrap;gap:4px 16px;font-weight:500;color:var(--muted)}
.fg-remove-disk-from-lvm-1 .x-key > span{display:inline-flex;align-items:center;gap:7px}
.fg-remove-disk-from-lvm-1 .x-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-remove-disk-from-lvm-1 .sw-u{background:var(--accent)}
.fg-remove-disk-from-lvm-1 .sw-n{border:1.5px solid var(--text);background:#fff}
@container (max-width:547.98px){
  .fg-remove-disk-from-lvm-1 .lk-art{padding:12px}
  .fg-remove-disk-from-lvm-1 .x-vg{column-gap:8px;padding:12px 8px 8px}
  .fg-remove-disk-from-lvm-1 .x-ob{column-gap:8px;padding:0 9.5px}
  .fg-remove-disk-from-lvm-1 .x-o.is-c{grid-column:1 / -1}
  .fg-remove-disk-from-lvm-1 .x-h{flex-direction:column;align-items:flex-start}
}`,
  html: `<div class="lk-art"><div class="x-h"><p class="x-t">LV fills the VG</p><p class="x-key"><span><i class="x-sw sw-u"></i>LV extents</span><span><i class="x-sw sw-n"></i>Free extents</span></p></div><div class="x-vg"><p class="x-vgl">VG</p><div><p class="x-dl">Disk A <span class="lk-mono">512 GiB</span></p><div class="x-bar"><i style="--f:1"></i></div></div><div><p class="x-dl">Disk B <span class="lk-mono">512 GiB</span></p><div class="x-bar"><i style="--f:1"></i></div></div><div><p class="x-dl">Disk C <span class="lk-mono">512 GiB</span></p><div class="x-bar"><i style="--f:1"></i></div></div></div><div class="x-ob"><i class="x-bk"></i><p class="x-o">Filesystem holds <span class="lk-mono">300 GiB</span>, <span class="lk-mono">PFree 0</span> on every disk, <span class="lk-mono">pvmove</span> has nowhere to go</p></div></div><div class="lk-art"><div class="x-h"><p class="x-t">LV reduced to fit two disks</p></div><div class="x-vg"><p class="x-vgl">VG</p><div><p class="x-dl">Disk A <span class="lk-mono">512 GiB</span></p><div class="x-bar"><i style="--f:.7"></i></div></div><div><p class="x-dl">Disk B <span class="lk-mono">512 GiB</span></p><div class="x-bar"><i style="--f:.7"></i></div></div><div><p class="x-dl">Disk C <span class="lk-mono">512 GiB</span></p><div class="x-bar"><i style="--f:0"></i></div></div></div><div class="x-ob"><i class="x-bk is-c"></i><p class="x-o is-c"><span class="x-m">Empty after <span class="lk-mono">pvmove</span></span><span class="lk-mono">vgreduce</span>, <span class="lk-mono">pvremove</span>, detach, delete</p></div></div>`,
};
