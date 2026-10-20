import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-btrfs-unallocated-space-1",
  label:
    "Diagram. The btrfs documentation's 1.82 TiB device as one bar: Data 1.15 TiB with 1.13 TiB used, Metadata 12.00 GiB with 6.45 GiB used, System 32 MiB and Unallocated 669.99 GiB; Free (estimated), 692.57 GiB, is the free part of Data plus Unallocated, and the free part of Metadata is not counted as free.",
  style: `.fg-btrfs-unallocated-space-1 .lk-art{--cap:100%}
.fg-btrfs-unallocated-space-1 .lk-art > .lk-svg{height:98px}
.fg-btrfs-unallocated-space-1 .lk-svg .x-sy{fill:var(--muted);stroke:none}
.fg-btrfs-unallocated-space-1 .x-fr{padding:0 0 4px 62.7% !important;font-weight:600;line-height:1.4;color:var(--text);text-align:center}
.fg-btrfs-unallocated-space-1 .x-nf{padding:4px .75% 0 53.4% !important;font-weight:500;line-height:1.4;color:var(--muted);text-align:center}
.fg-btrfs-unallocated-space-1 .x-key{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 20px;margin-top:12px !important;color:var(--muted);font-weight:500}
.fg-btrfs-unallocated-space-1 .x-key > span{display:flex;align-items:center;gap:8px}
.fg-btrfs-unallocated-space-1 .x-sw{flex:none;box-sizing:border-box;width:12px;height:12px;border-radius:3px}
.fg-btrfs-unallocated-space-1 .x-sw.u{background:var(--accent)}
.fg-btrfs-unallocated-space-1 .x-sw.uk{background:var(--text)}
.fg-btrfs-unallocated-space-1 .x-sw.sy{background:var(--muted)}
.fg-btrfs-unallocated-space-1 .x-sw.g{border:1.5px dashed var(--ln-g)}
@container (max-width:419.98px){
  .fg-btrfs-unallocated-space-1 .x-fr{padding-left:0 !important;text-align:right}
  .fg-btrfs-unallocated-space-1 .x-key{grid-template-columns:minmax(0,1fr)}
}`,
  html: `<div class="lk-art"><p class="x-fr">Free (estimated) 692.57&nbsp;GiB</p><svg class="lk-svg" viewBox="0 0 600 98" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="m" d="M376.29 10V3H599V10"/><rect class="k" x="1" y="14" width="3.86" height="24" rx="1"/><rect class="uk" x="1" y="14" width="2.07" height="24" rx="1"/><rect class="a" x="6.37" y="14" width="377.18" height="24" rx="2"/><rect class="u" x="6.37" y="14" width="369.92" height="24" rx="2"/><rect class="g" x="385.05" y="14" width="213.95" height="24" rx="2"/><path class="m" d="M1 38V68M4.87 38 599 68"/><rect class="k" x="1" y="68" width="594.5" height="18" rx="2"/><rect class="uk" x="1" y="68" width="319.54" height="18" rx="2"/><rect class="x-sy" x="597" y="68" width="2" height="18" rx=".5"/><path class="m" d="M320.54 90v7H595.5v-7"/></svg><p class="x-nf">Not counted as free</p></div><p class="lk-t">The documentation's 1.82&nbsp;TiB device</p><p class="x-key"><span><span class="x-sw u"></span>Data 1.15&nbsp;TiB (1.13&nbsp;TiB used)</span><span><span class="x-sw uk"></span>Metadata 12.00&nbsp;GiB (6.45&nbsp;GiB used)</span><span><span class="x-sw sy"></span>System 32&nbsp;MiB</span><span><span class="x-sw g"></span>Unallocated 669.99&nbsp;GiB</span></p>`,
};
