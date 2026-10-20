import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-disk-cost-optimization-1",
  label:
    "Diagram. Four 512 GiB data disks on one VM bill 2,048 GiB for 1,000 GiB of data; the same 1,000 GiB on one pool runs 80% to 90% full, and the pool expands as data grows and removes a disk when it shrinks.",
  style: `.fg-azure-disk-cost-optimization-1 .lk-ba .lk-art{--cap:240px}
.fg-azure-disk-cost-optimization-1 .x-dir{display:flex;align-items:center;gap:8px;color:var(--muted);font-weight:500;line-height:1.45}
.fg-azure-disk-cost-optimization-1 .lk-s + .x-dir{margin-top:8px !important}
.fg-azure-disk-cost-optimization-1 .x-dir + .x-dir{margin-top:4px !important}
.fg-azure-disk-cost-optimization-1 .x-dir svg{flex:none;width:10px;height:12px;fill:none;stroke:var(--muted);stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}
.fg-azure-disk-cost-optimization-1 .x-key{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:14px !important;padding-top:12px !important;border-top:1px solid var(--line);color:var(--muted);font-weight:500}
.fg-azure-disk-cost-optimization-1 .x-key > span{display:inline-flex;align-items:center;gap:8px}
.fg-azure-disk-cost-optimization-1 .x-sw{flex:none;width:12px;height:12px;border-radius:3px}
.fg-azure-disk-cost-optimization-1 .x-sw.u{background:var(--accent)}
.fg-azure-disk-cost-optimization-1 .x-sw.a{box-sizing:border-box;border:1.5px solid var(--ln-a45);background:var(--ln-a14)}`,
  html: `<div class="lk-ba"><div><div class="lk-art"><svg class="lk-svg" viewBox="0 0 160 96" style="aspect-ratio:160/96" aria-hidden="true" focusable="false"><rect class="n" x="6" y="6" width="148" height="84" rx="4"/><rect class="a" x="16" y="16" width="26" height="64" rx="3"/><rect class="u" x="19" y="48.68" width="20" height="28.32" rx="1.5"/><rect class="a" x="50" y="16" width="26" height="64" rx="3"/><rect class="u" x="53" y="48.68" width="20" height="28.32" rx="1.5"/><rect class="a" x="84" y="16" width="26" height="64" rx="3"/><rect class="u" x="87" y="48.68" width="20" height="28.32" rx="1.5"/><rect class="a" x="118" y="16" width="26" height="64" rx="3"/><rect class="u" x="121" y="48.68" width="20" height="28.32" rx="1.5"/></svg></div><p class="lk-t">2,048&nbsp;GiB billed</p><p class="lk-s">Four 512&nbsp;GiB data disks on one VM</p><p class="lk-s">1,000&nbsp;GiB of data</p></div><span class="lk-to" aria-hidden="true"></span><div><div class="lk-art"><svg class="lk-svg" viewBox="0 0 160 96" style="aspect-ratio:160/96" aria-hidden="true" focusable="false"><rect class="n" x="6" y="6" width="148" height="84" rx="4"/><rect class="a" x="42" y="16" width="52" height="64" rx="3"/><rect class="u" x="45" y="27.7" width="46" height="49.3" rx="1.5"/><path class="m" d="M114 44V16M110.5 19.5 114 16l3.5 3.5M114 52v28M110.5 76.5 114 80l3.5-3.5"/></svg></div><p class="lk-t">One pool, 80% to 90% full</p><p class="lk-s">The same 1,000&nbsp;GiB of data</p><p class="x-dir"><svg viewBox="0 0 10 12" aria-hidden="true" focusable="false"><path d="M5 11V1.5M1.75 4.75 5 1.5l3.25 3.25"/></svg><span>Expands as data grows</span></p><p class="x-dir"><svg viewBox="0 0 10 12" aria-hidden="true" focusable="false"><path d="M5 1v9.5M1.75 7.25 5 10.5l3.25-3.25"/></svg><span>Removes a disk when it shrinks</span></p></div></div><p class="x-key"><span><span class="x-sw u"></span>Data</span><span><span class="x-sw a"></span>Billed but empty</span></p>`,
};
