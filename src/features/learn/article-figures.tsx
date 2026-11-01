import { Fragment, type CSSProperties, type JSX, type ReactNode } from "react";

import type { ArticleFigureId, ArticleStripStep } from "@/content/learn/article";

/**
 * The VPA article's still diagrams, which make it easier to read and to
 * understand without any animation: the three-step strip under the short
 * answer and five figures. Ported from the mock shape for shape and number
 * for number, and styled by its `learn-figs` block (`src/styles/article.css`).
 *
 * Each figure is a `<figure role="img">` whose `aria-label` says what it
 * shows; the art inside is `aria-hidden`, and the labels under it are HTML
 * text. Nothing moves. Shapes take their look from a class:
 *
 *   n   neutral (a node, an empty bar)      u   use, in the accent
 *   uk  the HPA's use, in the text colour   a   a request (accent at 14%)
 *   ad  a pod arriving (dashed accent)      k   the HPA's pods
 *   g   what was there before (dashed)      m   a connector, muted
 *   mt  the HPA's target line (dashed accent)
 *
 * Every number a label shows is in the article's own text.
 */

/** A coordinate as the mock prints it (`%g`): no float noise such as 25.400000000000006. */
const g = (value: number): number => Number(value.toPrecision(6));

/** The art box: a scalable SVG whose aspect ratio is its viewBox's. */
function Art({ box, children }: { readonly box: string; readonly children: ReactNode }) {
  const [, , w, h] = box.split(" ");
  return (
    <svg
      className="lk-svg"
      viewBox={box}
      style={{ aspectRatio: `${w}/${h}` }}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** A rectangle with the stroke and fill of its class. */
function R({
  cls,
  x,
  y,
  w,
  h,
  rx,
}: {
  readonly cls: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly rx: number;
}): JSX.Element {
  return <rect className={cls} x={g(x)} y={g(y)} width={g(w)} height={g(h)} rx={rx} />;
}

/** A pod: its request outline, and its use inside, 3 in from the outline. */
function Pod({
  x,
  y,
  w,
  h,
  cls = "n",
  use,
  useCls = "u",
}: {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly cls?: string;
  readonly use?: number;
  readonly useCls?: string;
}): JSX.Element {
  return (
    <>
      <R cls={cls} x={x} y={y} w={w} h={h} rx={3} />
      {use ? <R cls={useCls} x={x + 3} y={y + h - 3 - use} w={w - 6} h={use} rx={1.5} /> : null}
    </>
  );
}

function Figure({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <figure className="ln-d" role="img" aria-label={label}>
      {children}
    </figure>
  );
}

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

/* ─── The strip under the short answer ────────────────────────────────────── */

const STRIP_ICONS: Record<ArticleStripStep["icon"], JSX.Element> = {
  "pod-v": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="6" width="9.5" height="12.5" rx="1.75" />
      <path
        className="ac"
        d="M18.5 4v16M16.25 6.25 18.5 4l2.25 2.25M16.25 17.75 18.5 20l2.25-2.25"
      />
    </svg>
  ),
  pods: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="7" width="5" height="10" rx="1.25" />
      <rect x="9.5" y="7" width="5" height="10" rx="1.25" />
      <rect className="ac" x="16.5" y="7" width="5" height="10" rx="1.25" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="ac" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
};

/** Three steps under the short answer, an icon each. */
export function ArticleStrip({
  steps,
}: {
  readonly steps: readonly ArticleStripStep[];
}): JSX.Element {
  return (
    <div className="ln-strip-w">
      <ol className="ln-strip" role="list">
        {steps.map((step) => (
          <li key={step.icon}>
            <span className="ln-si" aria-hidden="true">
              {STRIP_ICONS[step.icon]}
            </span>
            <span className="ln-st">{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─── Steps in a figure (the clash and the order) ─────────────────────────── */

interface FigureStep {
  readonly art: ReactNode;
  readonly label: string;
  /** A second line of figures, in Plex mono ("500m → 250m"). */
  readonly figures?: string;
}

/** Numbered steps, each a small art box and its label; a loop arrow back to 1 for the clash. */
function Steps({
  steps,
  loop,
}: {
  readonly steps: readonly FigureStep[];
  readonly loop?: boolean;
}): JSX.Element {
  return (
    <div
      className={loop ? "lk-loop is-loop" : "lk-loop"}
      style={{ "--n": steps.length } as CSSProperties}
    >
      <ol className="lk-ol lk-cl" role="list">
        {steps.map((step, index) => (
          <li className="lk-cs" key={step.label}>
            <div className="lk-art">
              <Art box="0 0 120 64">{step.art}</Art>
            </div>
            <p className="lk-s">
              <span className="lk-num">{index + 1}</span>{" "}
              <span>
                {step.label}
                {step.figures ? (
                  <>
                    <br />
                    <span className="lk-mono">{step.figures}</span>
                  </>
                ) : null}
              </span>
            </p>
          </li>
        ))}
      </ol>
      {loop ? <span className="lk-ret" /> : null}
    </div>
  );
}

/* ─── The five figures ────────────────────────────────────────────────────── */

/** "What are the VPA and the HPA?": the VPA changes pod size, the HPA pod count. */
function VpaHpaPair(): JSX.Element {
  return (
    <Figure label="Diagram. The VPA changes how big each pod is; the HPA changes how many pods run.">
      <div className="lk-vh">
        <div>
          <div className="lk-art">
            <Art box="0 0 160 86">
              <R cls="g" x={55} y={6} w={30} h={74} rx={3} />
              <Pod x={55} y={38} w={30} h={42} cls="a" use={26} />
              <path
                className="m"
                d="M106 8v70M102.5 11.5 106 8l3.5 3.5M102.5 74.5 106 78l3.5-3.5"
              />
            </Art>
          </div>
          <p className="lk-t">VPA changes pod size</p>
        </div>
        <div>
          <div className="lk-art">
            <Art box="0 0 160 86">
              {range(4).map((i) => (
                <Pod key={i} x={18 + 34 * i} y={30} w={26} h={42} cls="k" use={22} useCls="uk" />
              ))}
              <path
                className="m"
                d="M18 80h128M21.5 76.5 18 80l3.5 3.5M142.5 76.5 146 80l-3.5 3.5"
              />
            </Art>
          </div>
          <p className="lk-t">HPA changes pod count</p>
        </div>
      </div>
    </Figure>
  );
}

/** n pods across the box, each using pct of its request; over 100 the use stands above the outline. */
function HpaPods({ n, pct }: { readonly n: number; readonly pct: number }): JSX.Element {
  const [w, gap] = n <= 4 ? [24, 10] : [13, 5];
  const x0 = (160 - (n * w + (n - 1) * gap)) / 2;
  const use = (34 * pct) / 100;
  return (
    <>
      {range(n).map((i) => {
        const x = x0 + i * (w + gap);
        return (
          <Fragment key={i}>
            <R cls="k" x={x} y={36} w={w} h={40} rx={3} />
            <R cls="uk" x={x + 3} y={73 - use} w={w - 6} h={use} rx={1.5} />
          </Fragment>
        );
      })}
      {/* the 70% target: 70% of the 34 a request holds, up from 73 */}
      <path className="mt" d="M4 49.2h152" />
    </>
  );
}

/** "What is the HPA?": with a 70% target, 4 pods at 140% become 8 at 70%. */
function HpaExample(): JSX.Element {
  return (
    <Figure label="Diagram. With a 70% CPU target, 4 pods running at 140% of their request become 8 pods at 70%.">
      <div className="lk-ba">
        <div>
          <div className="lk-art">
            <Art box="0 0 160 86">
              <HpaPods n={4} pct={140} />
            </Art>
          </div>
          <p className="lk-t">4 pods at 140%</p>
        </div>
        <span className="lk-to" aria-hidden="true" />
        <div>
          <div className="lk-art">
            <Art box="0 0 160 86">
              <HpaPods n={8} pct={70} />
            </Art>
          </div>
          <p className="lk-t">8 pods at 70%</p>
        </div>
      </div>
      <p className="lk-s" style={{ marginTop: "10px" }}>
        Dashed line: the 70% CPU target
      </p>
    </Figure>
  );
}

/** "Requests decide what you pay for": one node, full of requests, each four times its use. */
function Requests(): JSX.Element {
  return (
    <Figure label="Diagram. A node is full when the requests on it add up to its capacity: four pods whose requests fill it, each using a quarter of what it requests.">
      <div className="lk-art" style={{ "--cap": "320px" } as CSSProperties}>
        <Art box="0 0 200 88">
          <R cls="n" x={4} y={4} w={192} h={80} rx={4} />
          {range(4).map((i) => (
            <Pod key={i} x={14 + 45 * i} y={12} w={37} h={64} cls="a" use={14.5} />
          ))}
        </Art>
      </div>
      <p className="lk-t">A node full of requests</p>
      <p className="lk-s">Each request four times its real use</p>
    </Figure>
  );
}

/** Four small pods across a step's box; `arriving` draws the last two dashed. */
function FourPods({
  use,
  arriving,
}: {
  readonly use: number;
  readonly arriving?: boolean;
}): JSX.Element {
  return (
    <>
      {range(4).map((j) => (
        <Pod
          key={j}
          x={15 + 26 * j}
          y={17}
          w={18}
          h={30}
          cls={arriving && j >= 2 ? "ad" : "k"}
          use={use}
          useCls="uk"
        />
      ))}
    </>
  );
}

/** "Why they clash on CPU": the four steps that loop back to the first. */
function Clash(): JSX.Element {
  const steps: FigureStep[] = [
    {
      /* the request comes down to the use: 500m to 250m, the pod using 200m */
      art: (
        <>
          <R cls="g" x={46} y={4} w={28} h={56} rx={3} />
          <Pod x={46} y={32} w={28} h={28} cls="a" use={20} />
        </>
      ),
      label: "VPA lowers the request",
      figures: "500m → 250m",
    },
    {
      /* use over request: 40% reads 80%, past the 70% target */
      art: (
        <>
          <R cls="n" x={10} y={27} w={100} h={10} rx={2} />
          <R cls="uk" x={10} y={27} w={80} h={10} rx={2} />
          <path className="m" d="M80 20v24" />
        </>
      ),
      label: "Utilization reads higher",
      figures: "40% → 80%",
    },
    { art: <FourPods use={12} arriving />, label: "HPA adds pods" },
    { art: <FourPods use={6} />, label: "Use per pod falls" },
  ];
  return (
    <Figure label="Diagram. On the same CPU metric, the VPA lowers the request from 500m to 250m, utilization reads 80% instead of 40%, the HPA adds pods, each pod uses less, and the VPA lowers the request again.">
      <Steps steps={steps} loop />
    </Figure>
  );
}

/** "Set requests from real use first, then scale out": the order that works. */
function Order(): JSX.Element {
  /* smaller requests fit on fewer nodes: two nodes full, one half full, the empty one goes */
  const blocks = range(3).flatMap((j) =>
    range(2).flatMap((k) =>
      range(2)
        .filter((r) => !(j === 2 && r === 1))
        .map((r) => ({ x: 12 + 28 * j + 10 * k, y: 23 + 10 * r })),
    ),
  );
  const steps: FigureStep[] = [
    {
      /* the request sized to measured use */
      art: (
        <>
          <R cls="g" x={46} y={4} w={28} h={56} rx={3} />
          <Pod x={46} y={30} w={28} h={30} cls="a" use={22} />
        </>
      ),
      label: "Size requests to measured use",
    },
    {
      /* the HPA target on an honest request: 70% */
      art: (
        <>
          <R cls="n" x={10} y={27} w={100} h={10} rx={2} />
          <R cls="uk" x={10} y={27} w={70} h={10} rx={2} />
          <path className="mt" d="M80 18v28" />
        </>
      ),
      label: "Set the HPA target",
    },
    {
      art: (
        <>
          {range(3).map((j) => (
            <R key={j} cls="n" x={8 + 28 * j} y={17} w={26} h={30} rx={3} />
          ))}
          {blocks.map((b) => (
            <R key={`${b.x}-${b.y}`} cls="u" x={b.x} y={b.y} w={8} h={8} rx={1.5} />
          ))}
          <R cls="ad" x={92} y={17} w={26} h={30} rx={3} />
        </>
      ),
      label: "Let the node autoscaler remove empty nodes",
    },
  ];
  return (
    <Figure label="Diagram. The order that works: size requests to measured use, then set the HPA target, then let the node autoscaler remove the nodes left empty.">
      <Steps steps={steps} />
    </Figure>
  );
}

const FIGURES: Record<ArticleFigureId, () => JSX.Element> = {
  "vpa-hpa-pair": VpaHpaPair,
  "hpa-example": HpaExample,
  requests: Requests,
  clash: Clash,
  order: Order,
};

export function ArticleFigure({ figure }: { readonly figure: ArticleFigureId }): JSX.Element {
  const Drawn = FIGURES[figure];
  return <Drawn />;
}
