import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-shrink-ebs-volume-1",
  label:
    "Diagram. The copy route as a timeline of 10 steps in three bands: with the application running, choose the size, create a gp3 volume, attach it, run mkfs and mount it at /mnt/new, and run the first rsync; with services stopped, stop services, run the final rsync --delete, move the /data mount and start services; running on the new volume, detach and delete the old volume. Both volumes are billed from step 2 to step 10.",
  style: `.fg-shrink-ebs-volume-1 .eb-g{display:grid;grid-template-columns:minmax(0,1fr) 4px;column-gap:12px;row-gap:4px;max-width:380px}
.fg-shrink-ebs-volume-1 .eb-s{display:grid;grid-template-columns:1.5em minmax(0,1fr);column-gap:6px;align-items:baseline;grid-column:1;padding:6px 10px;border-radius:var(--r-card);background:var(--surface-2);font-weight:500;line-height:1.4;color:var(--text)}
.fg-shrink-ebs-volume-1 .eb-s.is-d{background:var(--ln-a14)}
.fg-shrink-ebs-volume-1 .eb-b{grid-column:1;margin-top:8px;font-weight:600;line-height:1.4;color:var(--text)}
.fg-shrink-ebs-volume-1 .eb-b.is-d{color:var(--accent)}
.fg-shrink-ebs-volume-1 .eb-b1{grid-row:1;margin-top:0}
.fg-shrink-ebs-volume-1 .eb-s1{grid-row:2}
.fg-shrink-ebs-volume-1 .eb-bl{grid-row:3;grid-column:1;justify-self:end;margin-top:4px;font-weight:600;line-height:1.4;color:var(--text)}
.fg-shrink-ebs-volume-1 .eb-s2{grid-row:4}.fg-shrink-ebs-volume-1 .eb-s3{grid-row:5}.fg-shrink-ebs-volume-1 .eb-s4{grid-row:6}.fg-shrink-ebs-volume-1 .eb-s5{grid-row:7}
.fg-shrink-ebs-volume-1 .eb-b2{grid-row:8}
.fg-shrink-ebs-volume-1 .eb-s6{grid-row:9}.fg-shrink-ebs-volume-1 .eb-s7{grid-row:10}.fg-shrink-ebs-volume-1 .eb-s8{grid-row:11}.fg-shrink-ebs-volume-1 .eb-s9{grid-row:12}
.fg-shrink-ebs-volume-1 .eb-b3{grid-row:13}
.fg-shrink-ebs-volume-1 .eb-s10{grid-row:14}
.fg-shrink-ebs-volume-1 .eb-bar{grid-column:2;grid-row:3 / 15;width:4px;margin-top:6px;border-radius:2px;background:var(--text)}
@container (min-width:548px){
  .fg-shrink-ebs-volume-1 .eb-g{grid-template-columns:212px minmax(0,1fr) 4px 140px;column-gap:0;row-gap:4px;max-width:none}
  .fg-shrink-ebs-volume-1 .eb-s{padding:5px 10px}
  .fg-shrink-ebs-volume-1 .eb-s{grid-column:2}
  .fg-shrink-ebs-volume-1 .eb-b{position:relative;grid-column:1;align-self:stretch;margin:0 16px 0 0;padding:5px 16px 0 0;text-wrap:balance}
  .fg-shrink-ebs-volume-1 .eb-b::after{content:"";position:absolute;right:0;top:4px;bottom:4px;width:7px;border:1.5px solid var(--muted);border-right:0;border-radius:3px 0 0 3px;transform:scaleX(-1)}
  .fg-shrink-ebs-volume-1 .eb-b.is-d::after{border-color:var(--accent)}
  .fg-shrink-ebs-volume-1 .eb-b1{grid-row:1 / 6}
  .fg-shrink-ebs-volume-1 .eb-s1{grid-row:1}.fg-shrink-ebs-volume-1 .eb-s2{grid-row:2}.fg-shrink-ebs-volume-1 .eb-s3{grid-row:3}.fg-shrink-ebs-volume-1 .eb-s4{grid-row:4}.fg-shrink-ebs-volume-1 .eb-s5{grid-row:5}
  .fg-shrink-ebs-volume-1 .eb-b2{grid-row:6 / 10;margin-top:10px}
  .fg-shrink-ebs-volume-1 .eb-s6{grid-row:6;margin-top:10px}.fg-shrink-ebs-volume-1 .eb-s7{grid-row:7}.fg-shrink-ebs-volume-1 .eb-s8{grid-row:8}.fg-shrink-ebs-volume-1 .eb-s9{grid-row:9}
  .fg-shrink-ebs-volume-1 .eb-b3{grid-row:10 / 11;margin-top:10px}
  .fg-shrink-ebs-volume-1 .eb-s10{grid-row:10;margin-top:10px}
  .fg-shrink-ebs-volume-1 .eb-bar{grid-column:3;grid-row:2 / 11;margin:0 0 0 16px}
  .fg-shrink-ebs-volume-1 .eb-bl{grid-column:4;grid-row:2 / 11;align-self:center;justify-self:start;margin:0 0 0 28px;text-wrap:balance}
}`,
  html: `<div class="eb-g"><span class="eb-b eb-b1">Application running</span><span class="eb-s eb-s1"><span class="lk-num">1</span><span>Choose size</span></span><span class="eb-s eb-s2"><span class="lk-num">2</span><span>Create gp3 volume</span></span><span class="eb-s eb-s3"><span class="lk-num">3</span><span>Attach</span></span><span class="eb-s eb-s4"><span class="lk-num">4</span><span><span class="lk-mono">mkfs</span> and mount at <span class="lk-mono">/mnt/new</span></span></span><span class="eb-s eb-s5"><span class="lk-num">5</span><span>First <span class="lk-mono">rsync</span></span></span><span class="eb-b eb-b2 is-d">Services stopped</span><span class="eb-s eb-s6 is-d"><span class="lk-num">6</span><span>Stop services</span></span><span class="eb-s eb-s7 is-d"><span class="lk-num">7</span><span>Final <span class="lk-mono">rsync --delete</span></span></span><span class="eb-s eb-s8 is-d"><span class="lk-num">8</span><span>Move the <span class="lk-mono">/data</span> mount</span></span><span class="eb-s eb-s9 is-d"><span class="lk-num">9</span><span>Start services</span></span><span class="eb-b eb-b3">Running on the new volume</span><span class="eb-s eb-s10"><span class="lk-num">10</span><span>Detach and delete the old volume</span></span><span class="eb-bar"></span><span class="eb-bl">Both volumes billed</span></div>`,
};
