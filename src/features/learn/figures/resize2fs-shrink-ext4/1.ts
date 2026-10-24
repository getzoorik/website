import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-resize2fs-shrink-ext4-1",
  label:
    "Diagram. Three stacked layers for /data: first the ext4 filesystem, with 100 GiB used, shrinks to 150 GiB, then logical volume data_lv shrinks to 150 GiB, while disk /dev/sdc stays at 512 GiB provisioned and is still billed at 512 GiB.",
  style: `.fg-resize2fs-shrink-ext4-1 .rf-hd{margin-bottom:12px;font-weight:600;color:var(--text)}
.fg-resize2fs-shrink-ext4-1 .rf-hd .lk-mono{font-weight:600}
.fg-resize2fs-shrink-ext4-1 .rf-l + .rf-l{margin-top:14px}
.fg-resize2fs-shrink-ext4-1 .rf-n{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 8px;margin-bottom:6px;line-height:1.4}
.fg-resize2fs-shrink-ext4-1 .rf-nm{font-weight:600;color:var(--text)}
.fg-resize2fs-shrink-ext4-1 .rf-nm .lk-mono{font-weight:600}
.fg-resize2fs-shrink-ext4-1 .rf-c{font-weight:500;color:var(--muted)}
.fg-resize2fs-shrink-ext4-1 .rf-b{position:relative;height:28px}
.fg-resize2fs-shrink-ext4-1 .rf-b i{position:absolute;top:0;bottom:0;left:0;box-sizing:border-box;border:1.5px solid var(--text);border-radius:3px;background:#fff}
.fg-resize2fs-shrink-ext4-1 .rf-b .rf-k{width:29.296875%}
.fg-resize2fs-shrink-ext4-1 .rf-b .rf-fs{border-color:var(--ln-a45);background:var(--ln-a14)}
.fg-resize2fs-shrink-ext4-1 .rf-b .rf-u{left:3px;top:3px;bottom:3px;width:calc(19.53125% - 3px);border:0;border-radius:1.5px;background:var(--accent)}
.fg-resize2fs-shrink-ext4-1 .rf-b .rf-dk{right:0}
.fg-resize2fs-shrink-ext4-1 .rf-x{position:absolute;top:0;bottom:0;left:29.296875%;right:0;display:flex;align-items:center;gap:8px;box-sizing:border-box;padding:0 10px 0 5px;border:1.5px dashed var(--ln-g);border-left:0;border-radius:0 3px 3px 0}
.fg-resize2fs-shrink-ext4-1 .rf-x .rf-ar{position:relative;flex:1 1 auto;min-width:18px;top:auto;bottom:auto;left:auto;height:1.5px;border:0;border-radius:0;background:var(--muted)}
.fg-resize2fs-shrink-ext4-1 .rf-x .rf-ar::before{content:"";position:absolute;left:0;top:-2.75px;width:7px;height:7px;box-sizing:border-box;border-left:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-resize2fs-shrink-ext4-1 .rf-al{flex:none;font-weight:500;line-height:1.4;color:var(--text);white-space:nowrap}
.fg-resize2fs-shrink-ext4-1 .rf-al .lk-num{min-width:0;margin-right:6px}
.fg-resize2fs-shrink-ext4-1 .rf-br{position:relative;margin-top:6px;padding-top:12px;font-weight:600;line-height:1.4;color:var(--text);text-align:center}
.fg-resize2fs-shrink-ext4-1 .rf-br::before{content:"";position:absolute;left:0;right:0;top:0;height:6px;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 3px 3px}`,
  html: `<div class="lk-art"><div class="rf-hd"><span class="lk-mono">/data</span></div><div class="rf-l"><div class="rf-n"><span class="rf-nm">ext4 filesystem</span><span class="rf-c">100 GiB used</span></div><div class="rf-b"><i class="rf-k rf-fs"></i><i class="rf-u"></i><span class="rf-x"><i class="rf-ar"></i><span class="rf-al"><span class="lk-num">1</span>Shrink to 150 GiB</span></span></div></div><div class="rf-l"><div class="rf-n"><span class="rf-nm">Logical volume <span class="lk-mono">data_lv</span></span><span class="rf-c">LVM</span></div><div class="rf-b"><i class="rf-k"></i><span class="rf-x"><i class="rf-ar"></i><span class="rf-al"><span class="lk-num">2</span>Shrink to 150 GiB</span></span></div></div><div class="rf-l"><div class="rf-n"><span class="rf-nm">Disk <span class="lk-mono">/dev/sdc</span></span><span class="rf-c">512 GiB provisioned</span></div><div class="rf-b"><i class="rf-dk"></i></div><div class="rf-br">Still billed at 512 GiB</div></div></div>`,
};
