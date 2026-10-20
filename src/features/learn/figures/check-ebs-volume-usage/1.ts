import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-check-ebs-volume-usage-1",
  label:
    "Diagram. One EC2 instance seen two ways: AWS bills the 30 GiB volume, and on the instance lsblk shows it as nvme1n1, 30G, with the volume ID as its serial, while df -hT shows an 8.0G xfs filesystem on it, so 22G sit outside the filesystem and are still billed.",
  style: `.fg-check-ebs-volume-usage-1 .x-m{display:grid;grid-template-columns:minmax(0,.8fr) 120px minmax(0,1.45fr);grid-template-areas:"hl hl hr" "v ar l" ". . d" "b b b";gap:10px 12px}
.fg-check-ebs-volume-usage-1 .x-h{align-self:end;font-weight:600;line-height:1.4;color:var(--text)}
.fg-check-ebs-volume-usage-1 .x-hl{grid-area:hl}.fg-check-ebs-volume-usage-1 .x-hr{grid-area:hr}
.fg-check-ebs-volume-usage-1 .x-h .lk-mono{font-weight:500}
.fg-check-ebs-volume-usage-1 .x-c{min-width:0;padding:12px 14px;border-radius:var(--r-card);background:var(--surface-2)}
.fg-check-ebs-volume-usage-1 .x-v{grid-area:v}.fg-check-ebs-volume-usage-1 .x-l{grid-area:l}.fg-check-ebs-volume-usage-1 .x-d{grid-area:d}
.fg-check-ebs-volume-usage-1 .x-c .lk-t{margin-top:0 !important}
.fg-check-ebs-volume-usage-1 .x-c .lk-t .lk-mono{font-weight:600}
.fg-check-ebs-volume-usage-1 .x-v .lk-svg{margin-top:10px}
.fg-check-ebs-volume-usage-1 .x-o{margin-top:2px !important;font-family:var(--code);font-size:.95em;font-weight:500;line-height:1.5;color:var(--text)}
.fg-check-ebs-volume-usage-1 .x-o > span{white-space:nowrap}
.fg-check-ebs-volume-usage-1 .x-ar{grid-area:ar;align-self:center;display:flex;flex-direction:column;align-items:center;gap:6px;margin:0 -8px !important;font-weight:500;line-height:1.35;color:var(--muted);text-align:center;text-wrap:balance}
.fg-check-ebs-volume-usage-1 .x-ar .lk-mono{color:var(--muted)}
.fg-check-ebs-volume-usage-1 .x-ar i{position:relative;display:block;width:100%;height:9px}
.fg-check-ebs-volume-usage-1 .x-ar i::before{content:"";position:absolute;left:0;right:1px;top:3.75px;height:1.5px;background:var(--muted)}
.fg-check-ebs-volume-usage-1 .x-ar i::after{content:"";position:absolute;right:1px;top:1px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-check-ebs-volume-usage-1 .x-b{grid-area:b;margin-top:4px;padding:14px 16px}
.fg-check-ebs-volume-usage-1 .x-b .lk-t{margin-bottom:8px !important}
.fg-check-ebs-volume-usage-1 .x-b .lk-svg{max-width:none}
.fg-check-ebs-volume-usage-1 .x-nar{display:none !important}
.fg-check-ebs-volume-usage-1 .x-br{display:grid;grid-template-columns:8fr 22fr;margin-top:6px !important;font-weight:500;line-height:1.4;color:var(--text)}
.fg-check-ebs-volume-usage-1 .x-br > span{position:relative;min-width:0;padding:13px 6px 0 2px}
.fg-check-ebs-volume-usage-1 .x-br > span::before{content:"";position:absolute;left:1.5px;right:1.5px;top:0;height:7px;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 2px 2px}
.fg-check-ebs-volume-usage-1 .x-br .x-hot{font-weight:600}
@container (max-width:547.98px){
  .fg-check-ebs-volume-usage-1 .x-m{grid-template-columns:minmax(0,1fr);grid-template-areas:"hl" "v" "ar" "hr" "l" "d" "b";gap:8px}
  .fg-check-ebs-volume-usage-1 .x-hr{margin-top:2px !important}
  .fg-check-ebs-volume-usage-1 .x-ar{flex-direction:row-reverse;justify-content:flex-end;gap:10px;margin:0 !important;padding-left:24px !important;text-align:left}
  .fg-check-ebs-volume-usage-1 .x-ar i{flex:none;width:9px;height:26px}
  .fg-check-ebs-volume-usage-1 .x-ar i::before{left:3.75px;right:auto;top:0;bottom:1px;width:1.5px;height:auto}
  .fg-check-ebs-volume-usage-1 .x-ar i::after{left:1px;right:auto;top:auto;bottom:1px;border-top:0;border-bottom:1.5px solid var(--muted)}
}
@container (max-width:419.98px){
  .fg-check-ebs-volume-usage-1 .x-wide{display:none !important}
  .fg-check-ebs-volume-usage-1 .x-nar{display:block !important}
}`,
  html: `<div class="x-m"><p class="x-h x-hl">What AWS bills (<span class="lk-mono">describe-volumes</span>)</p><p class="x-h x-hr">What the instance sees</p><div class="x-c x-v"><p class="lk-t"><span class="lk-mono">vol-&lt;id&gt;</span></p><p class="lk-s">Size <span class="lk-mono">30 GiB</span></p><svg class="lk-svg" viewBox="0 0 120 10" style="aspect-ratio:120/10" aria-hidden="true" focusable="false"><rect class="a" x="1" y="1" width="118" height="8" rx="2"/></svg></div><p class="x-ar"><span><span class="lk-mono">SERIAL</span> = volume ID</span><i></i></p><div class="x-c x-l"><p class="lk-t"><span class="lk-mono">lsblk</span></p><p class="x-o"><span>nvme1n1,</span> <span>30G,</span> <span>SERIAL vol&lt;id&gt;,</span> <span>/data</span></p></div><div class="x-c x-d"><p class="lk-t"><span class="lk-mono">df -hT</span></p><p class="x-o"><span>/dev/nvme1n1,</span> <span>xfs,</span> <span>8.0G,</span> <span>33M used,</span> <span>/data</span></p></div><div class="x-c x-b"><p class="lk-t"><span class="lk-mono">nvme1n1, 30G</span></p><svg class="lk-svg x-wide" viewBox="0 0 600 30" style="aspect-ratio:600/30" aria-hidden="true" focusable="false"><rect class="a" x="0" y="2" width="600" height="26" rx="3"/><rect class="u" x="3" y="5" width="157" height="20" rx="1.5"/></svg><svg class="lk-svg x-nar" viewBox="0 0 300 30" style="aspect-ratio:300/30" aria-hidden="true" focusable="false"><rect class="a" x="0" y="2" width="300" height="26" rx="4"/><rect class="u" x="3" y="5" width="77" height="20" rx="2"/></svg><p class="x-br"><span><span class="lk-mono">8.0G</span> filesystem</span><span class="x-hot"><span class="lk-mono">22G</span> outside the filesystem, still billed</span></p></div></div>`,
};
