import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-shrink-azure-managed-disk-2",
  label:
    "Diagram. The copy route as nine numbered steps: measure the data, attach a new disk, format and mount it, rsync pass 1, stop services, rsync pass 2, move the mount, start services, and retire the old disk; steps 5 to 8 are downtime, and both disks are billed from step 2 to step 9.",
  style: `.ln-d.fg-shrink-azure-managed-disk-2 .f4-g{display:grid;grid-template-columns:minmax(0,1fr) 6px;column-gap:12px;row-gap:4px;max-width:340px}
.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:.5em;align-items:baseline;padding:6px 10px;border-radius:var(--r-card);background:var(--surface-2);font-weight:500;line-height:1.35;color:var(--text);text-wrap:balance}
.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c.is-d{background:var(--ln-a14)}
.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c1{grid-area:1/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c2{grid-area:3/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c3{grid-area:4/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c4{grid-area:5/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c5{grid-area:7/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c6{grid-area:8/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c7{grid-area:9/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c8{grid-area:10/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c9{grid-area:11/1}
.ln-d.fg-shrink-azure-managed-disk-2 p.f4-dl{grid-area:6/1;margin-top:4px;font-weight:600;color:var(--accent)}
.ln-d.fg-shrink-azure-managed-disk-2 p.f4-bl{grid-area:2/1;justify-self:end;margin-top:4px;font-weight:600;color:var(--text)}
.ln-d.fg-shrink-azure-managed-disk-2 .f4-bar{grid-area:2/2/12/3;justify-self:center;width:4px;margin-top:6px;border-radius:2px;background:var(--text)}
@container (min-width:548px){
  .ln-d.fg-shrink-azure-managed-disk-2 .f4-g{grid-template-columns:repeat(9,minmax(0,1fr));column-gap:4px;row-gap:0;max-width:none}
  .ln-d.fg-shrink-azure-managed-disk-2 p.f4-c{grid-template-columns:minmax(0,1fr);row-gap:3px;align-content:start;padding:9px 6px 10px}
  .ln-d.fg-shrink-azure-managed-disk-2 p.f4-c1{grid-area:2/1}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c2{grid-area:2/2}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c3{grid-area:2/3}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c4{grid-area:2/4}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c5{grid-area:2/5}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c6{grid-area:2/6}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c7{grid-area:2/7}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c8{grid-area:2/8}.ln-d.fg-shrink-azure-managed-disk-2 p.f4-c9{grid-area:2/9}
  .ln-d.fg-shrink-azure-managed-disk-2 p.f4-dl{position:relative;grid-area:1/5/2/9;margin:0 0 10px;padding-bottom:5px;border-bottom:1.5px solid var(--accent);text-align:center}
  .ln-d.fg-shrink-azure-managed-disk-2 p.f4-dl::before,.ln-d.fg-shrink-azure-managed-disk-2 p.f4-dl::after{content:"";position:absolute;bottom:-6.5px;left:0;width:1.5px;height:6px;background:var(--accent)}
  .ln-d.fg-shrink-azure-managed-disk-2 p.f4-dl::after{left:auto;right:0}
  .ln-d.fg-shrink-azure-managed-disk-2 .f4-bar{grid-area:3/2/4/10;justify-self:stretch;width:auto;height:4px;margin-top:12px}
  .ln-d.fg-shrink-azure-managed-disk-2 p.f4-bl{grid-area:4/2/5/10;justify-self:start;margin-top:6px}
}`,
  html: `<div class="f4-g"><p class="f4-c f4-c1"><span class="lk-num">1</span><span>Measure the data</span></p><p class="f4-c f4-c2"><span class="lk-num">2</span><span>Attach a new disk</span></p><p class="f4-c f4-c3"><span class="lk-num">3</span><span>Format, mount it</span></p><p class="f4-c f4-c4"><span class="lk-num">4</span><span>rsync pass 1</span></p><p class="f4-c f4-c5 is-d"><span class="lk-num">5</span><span>Stop services</span></p><p class="f4-c f4-c6 is-d"><span class="lk-num">6</span><span>rsync pass 2</span></p><p class="f4-c f4-c7 is-d"><span class="lk-num">7</span><span>Move the mount</span></p><p class="f4-c f4-c8 is-d"><span class="lk-num">8</span><span>Start services</span></p><p class="f4-c f4-c9"><span class="lk-num">9</span><span>Retire the old disk</span></p><p class="f4-dl">Downtime</p><span class="f4-bar"></span><p class="f4-bl">Both disks billed</p></div>`,
};
