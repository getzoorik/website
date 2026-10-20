import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: "ln-d fg-compute-optimizer-ebs-1",
  label:
    "Diagram. One EC2 instance with one EBS volume: outside the instance, Compute Optimizer reads six CloudWatch metrics from the volume, VolumeReadOps, VolumeWriteOps, VolumeReadBytes, VolumeWriteBytes, VolumeIOPSExceededCheck and VolumeThroughputExceededCheck, and its output is volume type, size, IOPS and throughput; inside the instance, the filesystem’s used and provisioned-but-unused space is not in those metrics.",
  style: `.fg-compute-optimizer-ebs-1 .x-cg{display:grid;grid-template-columns:104px minmax(0,1fr) 108px 30px 168px;grid-template-areas:"in in in in in" "cn hm hm hm hm" "vo ar cw . co"}
.fg-compute-optimizer-ebs-1 .x-rd{display:contents}
.fg-compute-optimizer-ebs-1 .x-h{font-weight:600;line-height:1.4;color:var(--text)}
.fg-compute-optimizer-ebs-1 .x-in{grid-area:in;padding:12px 14px 14px;border:1.5px solid var(--text);border-radius:var(--r-card);background:var(--surface-2)}
.fg-compute-optimizer-ebs-1 .x-ih{display:flex;flex-wrap:wrap;justify-content:space-between;gap:2px 16px;margin-bottom:8px}
.fg-compute-optimizer-ebs-1 .x-fl{margin-bottom:6px;font-weight:500;line-height:1.4;color:var(--muted)}
.fg-compute-optimizer-ebs-1 .x-ih > span:last-child{font-weight:500;color:var(--muted)}
.fg-compute-optimizer-ebs-1 .x-in .lk-svg{max-width:none}
.fg-compute-optimizer-ebs-1 .x-nar{display:none !important}
.fg-compute-optimizer-ebs-1 .x-br{display:grid;grid-template-columns:35fr 65fr;margin-top:6px;font-weight:500;line-height:1.4;color:var(--text)}
.fg-compute-optimizer-ebs-1 .x-br > span{position:relative;min-width:0;padding:13px 6px 0 2px}
.fg-compute-optimizer-ebs-1 .x-br > span::before{content:"";position:absolute;left:1.5px;right:1.5px;top:0;height:7px;border:1.5px solid var(--muted);border-top:0;border-radius:0 0 2px 2px}
.fg-compute-optimizer-ebs-1 .x-cn{grid-area:cn;justify-self:center;width:1.5px;background:var(--muted)}
.fg-compute-optimizer-ebs-1 .x-hm{grid-area:hm;align-self:end;padding:16px 0 8px 12px}
.fg-compute-optimizer-ebs-1 .x-vo{grid-area:vo;display:grid;place-items:center;padding:10px 8px;border:1.5px solid var(--ln-a45);border-radius:var(--r-card);background:var(--ln-a14);font-weight:600;line-height:1.35;color:var(--text);text-align:center}
.fg-compute-optimizer-ebs-1 .x-ar{grid-area:ar;display:grid;align-content:center;gap:4px;padding:4px 0}
.fg-compute-optimizer-ebs-1 .x-ar > span{position:relative;display:block;min-width:0;height:28px;padding:0 12px 10px;font-family:var(--code);font-size:.95em;font-weight:500;line-height:18px;color:var(--text);white-space:nowrap}
.fg-compute-optimizer-ebs-1 .x-ar > span::before{content:"";position:absolute;left:0;right:1px;bottom:3.75px;height:1.5px;background:var(--muted)}
.fg-compute-optimizer-ebs-1 .x-ar > span::after{content:"";position:absolute;right:1px;bottom:1px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-compute-optimizer-ebs-1 .x-c{display:grid;place-items:center;padding:10px 12px;border-radius:var(--r-card);background:var(--surface-2);font-weight:600;line-height:1.35;color:var(--text);text-align:center}
.fg-compute-optimizer-ebs-1 .x-cw{grid-area:cw}
.fg-compute-optimizer-ebs-1 .x-co{grid-area:co;align-self:center;display:flex;flex-direction:column}
.fg-compute-optimizer-ebs-1 .x-coc{position:relative}
.fg-compute-optimizer-ebs-1 .x-coc::before{content:"";position:absolute;left:-29px;top:50%;width:26px;height:1.5px;margin-top:-.75px;background:var(--muted)}
.fg-compute-optimizer-ebs-1 .x-coc::after{content:"";position:absolute;left:-10px;top:50%;width:7px;height:7px;margin-top:-4.25px;border-right:1.5px solid var(--muted);border-top:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-compute-optimizer-ebs-1 .x-dn{position:relative;display:block;height:22px}
.fg-compute-optimizer-ebs-1 .x-dn::before{content:"";position:absolute;left:50%;top:3px;bottom:2px;width:1.5px;margin-left:-.75px;background:var(--muted)}
.fg-compute-optimizer-ebs-1 .x-dn::after{content:"";position:absolute;left:50%;bottom:2px;width:7px;height:7px;margin-left:-4.25px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
.fg-compute-optimizer-ebs-1 .x-out{padding:10px 12px;border:1.5px solid var(--accent);border-radius:var(--r-card);background:#fff;font-weight:500;line-height:1.4;color:var(--text);text-align:center;text-wrap:balance}
@container (max-width:659.98px){
  .fg-compute-optimizer-ebs-1 .x-cg{grid-template-columns:minmax(0,1fr);grid-template-areas:"in" "cn" "vo" "rd" "cw" "co"}
  .fg-compute-optimizer-ebs-1 .x-wide{display:none !important}
  .fg-compute-optimizer-ebs-1 .x-nar{display:block !important}
  .fg-compute-optimizer-ebs-1 .x-cn{justify-self:start;height:14px;margin-left:12px}
  .fg-compute-optimizer-ebs-1 .x-rd{display:block;grid-area:rd;position:relative;padding:0 0 22px 30px}
  .fg-compute-optimizer-ebs-1 .x-rd::before{content:"";position:absolute;left:12px;top:0;bottom:2px;width:1.5px;background:var(--muted)}
  .fg-compute-optimizer-ebs-1 .x-rd::after{content:"";position:absolute;left:8.5px;bottom:2px;width:7px;height:7px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:rotate(45deg)}
  .fg-compute-optimizer-ebs-1 .x-hm{padding:12px 0 6px}
  .fg-compute-optimizer-ebs-1 .x-ar{gap:6px;padding:0}
  .fg-compute-optimizer-ebs-1 .x-ar > span{height:20px;padding:0;line-height:20px}
  .fg-compute-optimizer-ebs-1 .x-ar > span::before{left:-18px;right:auto;top:50%;bottom:auto;width:12px;margin-top:-.75px}
  .fg-compute-optimizer-ebs-1 .x-ar > span::after{display:none}
  .fg-compute-optimizer-ebs-1 .x-coc::before{left:50%;top:-22px;width:1.5px;height:19px;margin:0 0 0 -.75px}
  .fg-compute-optimizer-ebs-1 .x-coc::after{left:50%;top:-12px;margin:0 0 0 -4.25px;transform:rotate(135deg)}
  .fg-compute-optimizer-ebs-1 .x-co{padding-top:22px}
}`,
  html: `<div class="x-cg"><div class="x-in"><div class="x-ih x-h"><span>Not in those metrics</span><span>EC2 instance</span></div><div class="x-fl">Filesystem on the volume</div><svg class="lk-svg x-wide" viewBox="0 0 600 26" style="aspect-ratio:600/26" aria-hidden="true" focusable="false"><rect class="a" x="0" y="2" width="600" height="22" rx="3"/><rect class="u" x="3" y="5" width="207" height="16" rx="1.5"/></svg><svg class="lk-svg x-nar" viewBox="0 0 300 26" style="aspect-ratio:300/26" aria-hidden="true" focusable="false"><rect class="a" x="0" y="2" width="300" height="22" rx="3"/><rect class="u" x="3" y="5" width="102" height="16" rx="1.5"/></svg><div class="x-br"><span>Used</span><span>Provisioned, not used</span></div></div><i class="x-cn"></i><div class="x-vo">EBS volume</div><div class="x-rd"><div class="x-h x-hm">What Compute Optimizer reads</div><div class="x-ar"><span>VolumeReadOps</span><span>VolumeWriteOps</span><span>VolumeReadBytes</span><span>VolumeWriteBytes</span><span>VolumeIOPSExceededCheck</span><span>VolumeThroughputExceededCheck</span></div></div><div class="x-c x-cw">CloudWatch</div><div class="x-co"><div class="x-c x-coc">Compute Optimizer</div><i class="x-dn"></i><div class="x-out">Volume type, size, IOPS, throughput</div></div></div>`,
};
