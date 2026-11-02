import type { LearnSvgFigure } from "@/content/learn/article";

export const figure: LearnSvgFigure = {
  markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 350" width="720" height="350" role="img" aria-labelledby="fig-1-title fig-1-desc" class="sv-fig" data-fig="fig-1">
<title id="fig-1-title">A toleration lets a pod in, and node affinity keeps it there</title>
<desc id="fig-1-desc">Three pods in rows against two groups of nodes in columns. The dedicated nodes are tainted and labelled dedicated=batch. The other nodes have no taint and no label. A pod with no toleration: dedicated nodes, no, the taint keeps it out. Other nodes, a green check, may land. A pod with the toleration only: a green check in both columns, may land. The highlighted pod, with the toleration and node affinity: dedicated nodes, a green check, lands here. Other nodes, no, node affinity keeps it out.</desc>
<rect x="0.5" y="0.5" width="719" height="349" rx="6" fill="#ffffff" stroke="#cdd2e3" stroke-width="1" style="fill:var(--fig-bg, #ffffff);stroke:var(--fig-hair, #cdd2e3)"/><g transform="translate(0 -26)">

<text x="32" y="62" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="17" font-weight="700" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">A toleration lets a pod in, and node affinity keeps it there</text>
<text x="32" y="154" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="400" text-anchor="start" fill="#6b7086" style="fill:var(--fig-muted, #6b7086)">the pod has</text>
<rect x="264" y="96" width="200" height="64" rx="4" fill="none" stroke="#6b7086" stroke-width="1" style="stroke:var(--fig-muted, #6b7086)"/>
<text x="364" y="118" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">dedicated nodes</text>
<text x="364" y="135" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="400" text-anchor="middle" fill="#6b7086" style="fill:var(--fig-muted, #6b7086)">tainted and labelled</text>
<text x="364" y="151" font-family="IBM Plex Mono, ui-monospace, Menlo, monospace" font-size="12" font-weight="400" text-anchor="middle" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">dedicated=batch</text>
<rect x="488" y="96" width="200" height="64" rx="4" fill="none" stroke="#6b7086" stroke-width="1" style="stroke:var(--fig-muted, #6b7086)"/>
<text x="588" y="118" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">other nodes</text>
<text x="588" y="135" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="400" text-anchor="middle" fill="#6b7086" style="fill:var(--fig-muted, #6b7086)">no taint, no label</text>
<rect x="32" y="176" width="208" height="48" rx="4" fill="none" stroke="#6b7086" stroke-width="1" style="stroke:var(--fig-muted, #6b7086)"/>
<text x="46" y="204.5" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">no toleration</text>
<text x="278" y="197" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">no:</text>
<text x="278" y="213" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="400" text-anchor="start" fill="#6b7086" style="fill:var(--fig-muted, #6b7086)">the taint keeps it out</text>
<line x1="502" y1="200" x2="505.5" y2="203.5" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/><line x1="505.5" y1="203.5" x2="512" y2="196" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/>
<text x="520" y="204.5" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">may land</text>
<line x1="32" y1="232" x2="688" y2="232" fill="none" stroke="#cdd2e3" stroke-width="1" style="stroke:var(--fig-hair, #cdd2e3)"/>
<rect x="32" y="240" width="208" height="48" rx="4" fill="none" stroke="#6b7086" stroke-width="1" style="stroke:var(--fig-muted, #6b7086)"/>
<text x="46" y="268.5" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">the toleration only</text>
<line x1="278" y1="264" x2="281.5" y2="267.5" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/><line x1="281.5" y1="267.5" x2="288" y2="260" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/>
<text x="296" y="268.5" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">may land</text>
<line x1="502" y1="264" x2="505.5" y2="267.5" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/><line x1="505.5" y1="267.5" x2="512" y2="260" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/>
<text x="520" y="268.5" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">may land</text>
<line x1="32" y1="296" x2="688" y2="296" fill="none" stroke="#cdd2e3" stroke-width="1" style="stroke:var(--fig-hair, #cdd2e3)"/>
<rect x="32" y="304" width="208" height="48" rx="4" fill="none" stroke="#070f52" stroke-width="1.5" style="stroke:var(--fig-accent, #070f52)"/>
<text x="46" y="324" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">the toleration and</text>
<text x="46" y="341" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">node affinity</text>
<line x1="278" y1="328" x2="281.5" y2="331.5" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/><line x1="281.5" y1="331.5" x2="288" y2="324" fill="none" stroke="#12a97a" stroke-width="1.5" stroke-linecap="round" style="stroke:var(--fig-good, #12a97a)"/>
<text x="296" y="332.5" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">lands here</text>
<text x="502" y="325" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" text-anchor="start" fill="#0f1222" style="fill:var(--fig-ink, #0f1222)">no:</text>
<text x="502" y="341" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="400" text-anchor="start" fill="#6b7086" style="fill:var(--fig-muted, #6b7086)">node affinity keeps it out</text>
</g></svg>`,
  caption:
    "Illustration of the dedicated-nodes example, with batch as the group: the dedicated nodes carry the taint dedicated=batch:NoSchedule and the label dedicated=batch.",
};
