import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-gp2-vs-gp3-1",
  label:
    "Diagram. Baseline IOPS against volume size from 0 to 6,000 GiB. gp2 sits at 100 IOPS up to 33.33 GiB, rises at 3 IOPS per GiB through 3,000 IOPS at 1,000 GiB and flattens at 16,000 IOPS from 5,334 GiB, with a band up to 3,000 IOPS below 1,000 GiB for burst while credits last. gp3 is a flat line at 3,000 IOPS, included at any size, with an arrow showing it can be provisioned up to 80,000.",
  style: `.ln-d.fg-gp2-vs-gp3-1 .gq-w{padding:30px 0 26px 46px}
.ln-d.fg-gp2-vs-gp3-1 .gq-p{position:relative;height:210px;border:1px solid var(--line);border-radius:3px;background:#fff;line-height:1.35}
.ln-d.fg-gp2-vs-gp3-1 .gq-svg{position:absolute;inset:0;width:100%;height:100%;max-width:none}
.ln-d.fg-gp2-vs-gp3-1 .gq-svg .gl{fill:none;stroke:var(--line)}
.ln-d.fg-gp2-vs-gp3-1 .gq-svg .bd{fill:var(--line);stroke:none}
.ln-d.fg-gp2-vs-gp3-1 .gq-svg .l2{fill:none;stroke:var(--text)}
.ln-d.fg-gp2-vs-gp3-1 .gq-svg .l3{fill:none;stroke:var(--accent)}
.ln-d.fg-gp2-vs-gp3-1 .gq-p > p,.ln-d.fg-gp2-vs-gp3-1 .gq-p > span{position:absolute;margin:0 !important;white-space:nowrap}
.ln-d.fg-gp2-vs-gp3-1 .gq-y{right:calc(100% + 9px);transform:translateY(-50%);font-family:var(--code);font-size:.95em;font-weight:500;color:var(--muted)}
.ln-d.fg-gp2-vs-gp3-1 .gq-x{top:calc(100% + 7px);font-family:var(--code);font-size:.95em;font-weight:500;color:var(--muted);transform:translateX(-50%)}
.ln-d.fg-gp2-vs-gp3-1 .gq-x::before{content:"";position:absolute;left:calc(50% - .75px);top:-8px;width:1.5px;height:5px;background:var(--line)}
.ln-d.fg-gp2-vs-gp3-1 .gq-x.is-0{transform:translateX(-4px)}
.ln-d.fg-gp2-vs-gp3-1 .gq-x.is-0::before{left:3.25px}
.ln-d.fg-gp2-vs-gp3-1 .gq-x.is-e{transform:translateX(-100%)}
.ln-d.fg-gp2-vs-gp3-1 .gq-x.is-e::before{left:auto;right:-.75px}
.ln-d.fg-gp2-vs-gp3-1 .gq-k{font-weight:600}
.ln-d.fg-gp2-vs-gp3-1 .gq-l2{right:calc(38.89% + 6px);bottom:calc(61.11% + 6px);color:var(--text)}
.ln-d.fg-gp2-vs-gp3-1 .gq-l3{right:10px;bottom:calc(16.67% + 6px);display:grid;justify-items:end;font-weight:500;color:var(--text)}
.ln-d.fg-gp2-vs-gp3-1 .gq-l3 .gq-k{color:var(--accent)}
.ln-d.fg-gp2-vs-gp3-1 .gq-lb{left:calc(16.67% + 12px);top:91.67%;display:flex;align-items:center;gap:7px;transform:translateY(-50%);font-weight:500;color:var(--muted)}
.ln-d.fg-gp2-vs-gp3-1 .gq-lb i{flex:none;width:10px;height:10px;border-radius:2px;background:var(--line);box-shadow:inset 0 0 0 1.5px var(--ln-g)}
.ln-d.fg-gp2-vs-gp3-1 .gq-la{left:calc(8.33% + 10px);top:-7.78%;transform:translateY(-50%);font-weight:500;color:var(--text)}
.ln-d.fg-gp2-vs-gp3-1 .gq-ah{left:calc(8.33% - 3.5px);top:calc(-7.78% - 1px);width:7px;height:7px;border-left:1.5px solid var(--accent);border-top:1.5px solid var(--accent);transform:rotate(45deg)}
.ln-d.fg-gp2-vs-gp3-1 .lk-s{margin-top:2px !important}
@container (max-width:547.98px){
  .ln-d.fg-gp2-vs-gp3-1 .lk-art{padding:14px 12px}
  .ln-d.fg-gp2-vs-gp3-1 .gq-w{padding-left:44px}
  .ln-d.fg-gp2-vs-gp3-1 .gq-p{height:190px}
  .ln-d.fg-gp2-vs-gp3-1 .gq-x.is-k{display:none}
}`,
  html: `<div class="lk-art"><div class="gq-w"><div class="gq-p"><svg class="lk-svg gq-svg" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="gl" d="M0 20H600M100 180V150M533.333 180V20"/><path class="bd" d="M0 179H3.333L100 150H0Z"/><path class="l3" d="M0 150H600"/><path class="l2" d="M0 179H3.333L533.333 20H600"/><path class="mt" d="M50 150V-14"/></svg><span class="gq-ah" aria-hidden="true"></span><p class="gq-la">Provision up to <span class="lk-mono">80,000</span></p><p class="gq-l2 gq-k">gp2</p><p class="gq-l3"><span class="gq-k">gp3</span><span>Included at any size</span></p><p class="gq-lb"><i></i>Burst, while credits last</p><p class="gq-y" style="top:11.11%">16,000</p><p class="gq-y" style="top:83.33%">3,000</p><p class="gq-x is-0" style="left:0">0</p><p class="gq-x" style="left:16.67%">1,000</p><p class="gq-x is-k" style="left:88.89%">5,334</p><p class="gq-x is-e" style="left:100%">6,000</p></div></div></div><p class="lk-t">Baseline IOPS by volume size (GiB)</p><p class="lk-s">gp2 sits at 100 IOPS up to 33.33&nbsp;GiB, rises 3 IOPS per GiB through 3,000 at 1,000&nbsp;GiB, and flattens at 16,000 from 5,334&nbsp;GiB.</p>`,
};
