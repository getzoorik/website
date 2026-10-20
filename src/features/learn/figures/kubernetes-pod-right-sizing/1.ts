import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-kubernetes-pod-right-sizing-1",
  label:
    "Diagram. In one 100 ms period, a container with a 500m CPU limit and 4 busy threads on 4 cores spends its 50 ms quota in the first 12.5 ms, then is throttled for 87.5 ms until the quota refills at the next period.",
  style: `.fg-kubernetes-pod-right-sizing-1 .fk-top{display:grid;grid-template-columns:minmax(0,12.5fr) minmax(0,87.5fr);margin-bottom:6px;font-weight:600;color:var(--text);white-space:nowrap}
.fg-kubernetes-pod-right-sizing-1 .fk-top > span:first-child{color:var(--accent)}
.fg-kubernetes-pod-right-sizing-1 .fk-top > span + span{text-align:center}
.fg-kubernetes-pod-right-sizing-1 .fk-ax{display:flex;justify-content:space-between;margin-top:6px;font-weight:500;color:var(--muted)}
.fg-kubernetes-pod-right-sizing-1 .fk-k{display:flex;flex-wrap:wrap;gap:4px 20px;margin-top:2px}
.fg-kubernetes-pod-right-sizing-1 .fk-i{display:inline-flex;align-items:center;gap:8px}
.fg-kubernetes-pod-right-sizing-1 .fk-sw{flex:none;box-sizing:border-box;width:10px;height:10px;border-radius:2px}
.fg-kubernetes-pod-right-sizing-1 .sw-u{background:var(--accent)}
.fg-kubernetes-pod-right-sizing-1 .sw-g{border:1.5px dashed var(--ln-g)}
.fg-kubernetes-pod-right-sizing-1 .sw-mt{width:0;height:12px;border-left:1.5px dashed var(--accent);border-radius:0;margin:0 4px}
.fg-kubernetes-pod-right-sizing-1 .lk-art > .fk-p{display:none}
@container (max-width:419.98px){.fg-kubernetes-pod-right-sizing-1 .lk-art > .fk-d{display:none}.fg-kubernetes-pod-right-sizing-1 .lk-art > .fk-p{display:block}}`,
  html: `<div class="lk-art" style="--cap:100%"><div class="fk-top"><span class="lk-mono">12.5 ms</span><span>Throttled for <span class="lk-mono">87.5 ms</span></span></div><svg class="lk-svg fk-d" viewBox="0 0 400 76" style="aspect-ratio:400/76" aria-hidden="true" focusable="false"><path class="m" d="M1 6V1.5h48V6M51 6V1.5H397.5V6"/><rect class="u" x="0" y="11" width="49.2" height="10" rx="3"/><rect class="g" x="51.55" y="11.75" width="345.95" height="8.5" rx="2.5"/><rect class="u" x="0" y="28" width="49.2" height="10" rx="3"/><rect class="g" x="51.55" y="28.75" width="345.95" height="8.5" rx="2.5"/><rect class="u" x="0" y="45" width="49.2" height="10" rx="3"/><rect class="g" x="51.55" y="45.75" width="345.95" height="8.5" rx="2.5"/><rect class="u" x="0" y="62" width="49.2" height="10" rx="3"/><rect class="g" x="51.55" y="62.75" width="345.95" height="8.5" rx="2.5"/><path class="mt" d="M400 1v75"/></svg><svg class="lk-svg fk-p" viewBox="0 0 280 72" style="aspect-ratio:280/72" aria-hidden="true" focusable="false"><path class="m" d="M1 6V1.5h33V6M36 6V1.5H277.5V6"/><rect class="u" x="0" y="11" width="34.2" height="10" rx="3"/><rect class="g" x="36.55" y="11.75" width="240.95" height="8.5" rx="2.5"/><rect class="u" x="0" y="27" width="34.2" height="10" rx="3"/><rect class="g" x="36.55" y="27.75" width="240.95" height="8.5" rx="2.5"/><rect class="u" x="0" y="43" width="34.2" height="10" rx="3"/><rect class="g" x="36.55" y="43.75" width="240.95" height="8.5" rx="2.5"/><rect class="u" x="0" y="59" width="34.2" height="10" rx="3"/><rect class="g" x="36.55" y="59.75" width="240.95" height="8.5" rx="2.5"/><path class="mt" d="M280 1v71"/></svg><div class="fk-ax"><span class="lk-mono">0</span><span class="lk-mono">100 ms</span></div></div><p class="lk-t">One 100 ms period: a 500m CPU limit, 4 busy threads on 4 cores</p><div class="lk-s fk-k"><span class="fk-i"><i class="fk-sw sw-u"></i>Spending the 50 ms quota</span><span class="fk-i"><i class="fk-sw sw-g"></i>Throttled</span><span class="fk-i"><i class="fk-sw sw-mt"></i>Quota refills at the next period</span></div>`,
};
