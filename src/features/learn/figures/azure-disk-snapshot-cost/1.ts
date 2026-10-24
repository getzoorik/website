import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-azure-disk-snapshot-cost-1",
  label:
    "Diagram. Seven daily snapshots of a disk holding 200 GB, with 5 GB changing a day: full snapshots reach 1,400 GB and $70.00 a month, incremental snapshots reach 230 GB and $11.50 a month, both at $0.05 per GB per month (East US, October 2026).",
  style: `.fg-azure-disk-snapshot-cost-1 .lk-vh .lk-art{--cap:120px}
.fg-azure-disk-snapshot-cost-1 .x-c{margin-top:2px !important;font-weight:500;line-height:1.45;color:var(--muted)}
.fg-azure-disk-snapshot-cost-1 .x-c b{font-weight:600;color:var(--text);font-variant-numeric:tabular-nums}
.fg-azure-disk-snapshot-cost-1 .x-m{margin-top:2px !important}
.fg-azure-disk-snapshot-cost-1 .x-m .lk-mono{color:var(--muted);white-space:normal}
.fg-azure-disk-snapshot-cost-1 .x-key{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:14px !important;padding-top:12px !important;border-top:1px solid var(--line);color:var(--muted);font-weight:500}
.fg-azure-disk-snapshot-cost-1 .x-key > span{display:inline-flex;align-items:center;gap:8px}
.fg-azure-disk-snapshot-cost-1 .x-sw{flex:none;width:12px;height:12px;border-radius:3px}
.fg-azure-disk-snapshot-cost-1 .x-sw.u{background:var(--accent)}
.fg-azure-disk-snapshot-cost-1 .x-sw.uk{background:var(--text)}
.fg-azure-disk-snapshot-cost-1 .x-px{margin-top:6px !important}`,
  html: `<div class="lk-vh"><div><div class="lk-art"><svg class="lk-svg" viewBox="0 0 120 174" style="aspect-ratio:120/174" aria-hidden="true" focusable="false"><rect class="u" x="24" y="2" width="72" height="23" rx="3"/><rect class="u" x="24" y="27" width="72" height="22" rx="3"/><rect class="u" x="24" y="51" width="72" height="22" rx="3"/><rect class="u" x="24" y="75" width="72" height="22" rx="3"/><rect class="u" x="24" y="99" width="72" height="22" rx="3"/><rect class="u" x="24" y="123" width="72" height="22" rx="3"/><rect class="u" x="24" y="147" width="72" height="23" rx="3"/><path class="m" d="M8 171.5h104"/></svg></div><p class="lk-t">Full: 1,400&nbsp;GB</p><p class="x-c"><b>$70.00</b> a month</p><p class="lk-s x-m"><span class="lk-mono">7 × 200&nbsp;GB</span></p></div><div><div class="lk-art"><svg class="lk-svg" viewBox="0 0 120 174" style="aspect-ratio:120/174" aria-hidden="true" focusable="false"><rect class="uk" x="24" y="142.4" width="72" height="3.6" rx="1.5"/><rect class="u" x="24" y="147" width="72" height="23" rx="3"/><path class="m" d="M8 171.5h104"/></svg></div><p class="lk-t">Incremental: 230&nbsp;GB</p><p class="x-c"><b>$11.50</b> a month</p><p class="lk-s x-m"><span class="lk-mono">200 + 6 × 5&nbsp;GB</span></p></div></div><p class="x-key"><span><span class="x-sw u"></span>Full copy, 200&nbsp;GB</span><span><span class="x-sw uk"></span>Changes, 5&nbsp;GB a day</span></p><p class="lk-s x-px">Both at $0.05 per GB per month (East US, October 2026)</p>`,
};
