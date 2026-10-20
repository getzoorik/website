import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-btrfs-device-remove-1",
  label:
    "Diagram. Three disks in a row: devid 3 is leaving with size 0.00B, and its data and metadata chunks move one at a time to devid 1 and devid 2, each move copying the extents and then updating every pointer, while the used figure under devid 3 falls to 0.",
  style: `.fg-btrfs-device-remove-1 .x-w{max-width:480px;margin:0 auto}
.fg-btrfs-device-remove-1 .x-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
.fg-btrfs-device-remove-1 .x-hd{align-items:end;margin-bottom:8px}
.fg-btrfs-device-remove-1 .x-hd p{padding:0 4px !important;font-weight:500;line-height:1.4;color:var(--muted);text-align:center;text-wrap:balance}
.fg-btrfs-device-remove-1 .x-hd .lk-mono{color:var(--text)}
.fg-btrfs-device-remove-1 .x-ft{align-items:start;margin-top:10px}
.fg-btrfs-device-remove-1 .x-nt{grid-column:1/3;padding:0 8px !important;line-height:1.4;text-align:center;text-wrap:balance}
.fg-btrfs-device-remove-1 .x-nt b{display:block;font-weight:600;color:var(--text)}
.fg-btrfs-device-remove-1 .x-nt span{display:block;margin-top:2px;font-weight:500;color:var(--muted)}
.fg-btrfs-device-remove-1 .x-us{grid-column:3;display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:500;line-height:1.4;color:var(--muted);text-align:center}
.fg-btrfs-device-remove-1 .x-us .lk-svg{width:64%}
.fg-btrfs-device-remove-1 .x-key{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:14px !important;padding-top:12px !important;border-top:1px solid var(--line);color:var(--muted);font-weight:500}
.fg-btrfs-device-remove-1 .x-key > span{display:inline-flex;align-items:center;gap:8px}
.fg-btrfs-device-remove-1 .x-sw{flex:none;width:12px;height:12px;border-radius:3px}
.fg-btrfs-device-remove-1 .x-sw.u{background:var(--accent)}
.fg-btrfs-device-remove-1 .x-sw.uk{background:var(--text)}`,
  html: `<div class="lk-art"><div class="x-w"><div class="x-row x-hd"><p><span class="lk-mono">devid 1</span></p><p><span class="lk-mono">devid 2</span></p><p><span class="lk-mono">devid 3</span> (leaving, size <span class="lk-mono">0.00B</span>)</p></div><svg class="lk-svg" viewBox="0 0 300 92" style="aspect-ratio:300/92" aria-hidden="true" focusable="false"><rect class="k" x="18" y="4" width="64" height="60" rx="3"/><rect class="u" x="24" y="10" width="14.67" height="22" rx="1.5"/><rect class="uk" x="42.67" y="10" width="14.67" height="22" rx="1.5"/><rect class="u" x="61.33" y="10" width="14.67" height="22" rx="1.5"/><rect class="u" x="24" y="36" width="14.67" height="22" rx="1.5"/><rect class="ad" x="42.67" y="36" width="14.67" height="22" rx="1.5"/><rect class="k" x="118" y="4" width="64" height="60" rx="3"/><rect class="u" x="124" y="10" width="14.67" height="22" rx="1.5"/><rect class="uk" x="142.67" y="10" width="14.67" height="22" rx="1.5"/><rect class="ad" x="161.33" y="10" width="14.67" height="22" rx="1.5"/><rect class="u" x="124" y="36" width="14.67" height="22" rx="1.5"/><rect class="g" x="218" y="4" width="64" height="60" rx="3"/><rect class="u" x="224" y="10" width="14.67" height="22" rx="1.5"/><rect class="uk" x="242.67" y="10" width="14.67" height="22" rx="1.5"/><rect class="g" x="261.33" y="10" width="14.67" height="22" rx="1.5"/><rect class="g" x="224" y="36" width="14.67" height="22" rx="1.5"/><rect class="g" x="242.67" y="36" width="14.67" height="22" rx="1.5"/><rect class="g" x="261.33" y="36" width="14.67" height="22" rx="1.5"/><path class="m" d="M215 21h-30M188.5 17.5 185 21l3.5 3.5"/><rect class="u" x="194" y="16" width="12" height="10" rx="1.5"/><path class="m" d="M215 47h-15v37H50V67.5M46.5 71 50 67.5l3.5 3.5"/><rect class="uk" x="94" y="79" width="12" height="10" rx="1.5"/></svg><div class="x-row x-ft"><p class="x-nt"><b>One chunk at a time</b><span>Each move: copy extents, then update every pointer</span></p><div class="x-us"><span class="lk-mono">used</span><svg class="lk-svg" viewBox="0 0 64 14" style="aspect-ratio:64/14" aria-hidden="true" focusable="false"><rect class="g" x="1" y="1" width="62" height="12" rx="3"/><rect class="u" x="4" y="4" width="18.67" height="6" rx="1.5"/><path class="m" d="M53 7H28M31.5 3.5 28 7l3.5 3.5"/></svg><span>falls to 0</span></div></div></div></div><p class="x-key"><span><span class="x-sw u"></span>Data</span><span><span class="x-sw uk"></span>Metadata</span></p>`,
};
