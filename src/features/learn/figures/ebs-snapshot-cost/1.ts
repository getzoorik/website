import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-ebs-snapshot-cost-1",
  label:
    "Diagram. One volume's snapshots before and after deleting Snap A. Before: Snap A stores 10 GiB, and Snap B stores the 4 GiB that changed and points at 6 GiB inside Snap A, so 14 GiB is billed. After deleting Snap A: Snap A's 4 GiB of unique data is removed and its other 6 GiB moves under Snap B, so 10 GiB is billed.",
  style: `.ln-d.fg-ebs-snapshot-cost-1 .lk-ba{align-items:stretch}
.ln-d.fg-ebs-snapshot-cost-1 .lk-ba > div{display:flex;flex-direction:column}
.ln-d.fg-ebs-snapshot-cost-1 .lk-art{flex:1;display:flex;align-items:center}
.ln-d.fg-ebs-snapshot-cost-1 .sc-g{display:grid;grid-template-columns:auto minmax(0,4fr) minmax(0,6fr);grid-template-rows:minmax(41px,auto) 20px 22px 20px minmax(41px,auto);column-gap:3px;width:100%;line-height:1.35}
.ln-d.fg-ebs-snapshot-cost-1 p.sc-n{align-self:center;margin-right:7px !important;font-weight:600;color:var(--text);white-space:nowrap}
.ln-d.fg-ebs-snapshot-cost-1 p.sc-n.is-x{color:var(--muted)}
.ln-d.fg-ebs-snapshot-cost-1 .sc-s{height:20px;border-radius:3px;box-sizing:border-box}
.ln-d.fg-ebs-snapshot-cost-1 .sc-a{background:var(--ln-a14);border:1.5px solid var(--ln-a45)}
.ln-d.fg-ebs-snapshot-cost-1 .sc-u{background:var(--accent)}
.ln-d.fg-ebs-snapshot-cost-1 .sc-ad{border:1.5px dashed var(--accent)}
.ln-d.fg-ebs-snapshot-cost-1 .sc-gd{border:1.5px dashed var(--ln-g)}
.ln-d.fg-ebs-snapshot-cost-1 p.sc-l{font-weight:500;color:var(--muted);text-wrap:balance}
.ln-d.fg-ebs-snapshot-cost-1 p.sc-l.is-up{align-self:end;padding-bottom:5px !important}
.ln-d.fg-ebs-snapshot-cost-1 p.sc-l.is-dn{align-self:start;padding-top:5px !important}
.ln-d.fg-ebs-snapshot-cost-1 p.sc-l.is-w{grid-column:2/4}
.ln-d.fg-ebs-snapshot-cost-1 p.sc-l .lk-mono{font-weight:600}
.ln-d.fg-ebs-snapshot-cost-1 .sc-p{position:relative;grid-column:3;height:22px}
.ln-d.fg-ebs-snapshot-cost-1 .sc-p::before{content:"";position:absolute;left:calc(50% - .75px);top:3px;bottom:3px;border-left:1.5px dashed var(--accent)}
.ln-d.fg-ebs-snapshot-cost-1 .sc-p::after{content:"";position:absolute;left:calc(50% - 3.5px);width:6px;height:6px;border-left:1.5px solid var(--accent);border-top:1.5px solid var(--accent)}
.ln-d.fg-ebs-snapshot-cost-1 .sc-p.is-up::after{top:3px;transform:rotate(45deg)}
.ln-d.fg-ebs-snapshot-cost-1 .sc-p.is-dn::after{bottom:3px;transform:rotate(225deg)}
.ln-d.fg-ebs-snapshot-cost-1 .lk-s .lk-mono{font-weight:600}
@container (max-width:419.98px){.ln-d.fg-ebs-snapshot-cost-1 .sc-g{grid-template-rows:auto 20px 22px 20px auto}}`,
  html: `<div class="lk-ba"><div><div class="lk-art"><div class="sc-g"><span></span><p class="sc-l is-up is-w">Stores <span class="lk-mono">10&nbsp;GiB</span></p><p class="sc-n">Snap A</p><span class="sc-s sc-a"></span><span class="sc-s sc-u"></span><span class="sc-p is-up"></span><p class="sc-n">Snap B</p><span class="sc-s sc-a"></span><span class="sc-s sc-ad"></span><span></span><p class="sc-l is-dn"><span class="lk-mono">4&nbsp;GiB</span> that changed</p><p class="sc-l is-dn">Points at <span class="lk-mono">6&nbsp;GiB</span> inside Snap A</p></div></div><p class="lk-t">Before</p><p class="lk-s"><span class="lk-mono">14&nbsp;GiB</span> billed</p></div><span class="lk-to" aria-hidden="true"></span><div><div class="lk-art"><div class="sc-g"><span></span><p class="sc-l is-up"><span class="lk-mono">4&nbsp;GiB</span> removed</p><p class="sc-l is-up"><span class="lk-mono">6&nbsp;GiB</span> moves under Snap B</p><p class="sc-n is-x">Snap A</p><span class="sc-s sc-gd"></span><span class="sc-s sc-gd"></span><span class="sc-p is-dn"></span><p class="sc-n">Snap B</p><span class="sc-s sc-a"></span><span class="sc-s sc-u"></span><span></span><p class="sc-l is-dn is-w">Stores <span class="lk-mono">10&nbsp;GiB</span></p></div></div><p class="lk-t">After deleting Snap A</p><p class="lk-s"><span class="lk-mono">10&nbsp;GiB</span> billed</p></div></div>`,
};
