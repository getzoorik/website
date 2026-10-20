import type { CSSProperties, JSX } from "react";

/**
 * The marks of what the two products run on: Azure, AWS, Windows, Linux and Kubernetes.
 *
 * They live here rather than beside one feature because every surface that
 * names a platform draws them: the product sections' "Runs on" chips, the
 * footer's "Built for" tag, the login cards and the assessment's cloud choice.
 * A second hand-copied set would drift the moment a vendor's artwork is
 * retouched.
 *
 * ─── THE CLASS IS THE CALLER'S, AND THAT CHANGED ───────────────────────────
 * While only the footer and the login cards drew these, the class was baked in.
 * The mock now sizes the same artwork four different ways: by `.az-mark` in the
 * "Built for" tag, by its container in a chip (`.chip svg`, `.login .az svg`),
 * and by `.as-mk` on the assessment page. So each mark takes the class its
 * surface gives it, exactly as the mock's `<use>` elements do.
 *
 * All of them are `aria-hidden`: each sits beside a real text label. Each also
 * carries a stable `data-mark` naming its platform, because an aria-hidden SVG
 * has no text: it is how a test tells a Windows mark from a Kubernetes one, and
 * so how it proves Coral is never drawn with Windows or Linux.
 *
 * The Azure and AWS marks may stand alone instead, with no word beside them (a
 * tool's clouds on Cloud cost optimization tools): given a `label`, the mark is
 * an image with that name for the ear.
 */

export interface CloudMarkProps {
  readonly className?: string;
}

/** A mark with no word beside it names itself (`role="img"`); a mark beside its name is hidden from the ear. */
const spoken = (label?: string) =>
  label ? ({ role: "img", "aria-label": label } as const) : ({ "aria-hidden": true } as const);

/**
 * The Microsoft Azure logo.
 *
 * 🔴 THE GRADIENT IDS ARE A REQUIRED PARAMETER, NOT A CONSTANT. `url(#id)`
 * resolves against the DOCUMENT, so two copies of this mark on one page that
 * share an id both paint with whichever gradient the browser saw first, and
 * the home page now draws it five times. Making the suffix an argument means
 * another copy cannot be added without being given one.
 */
export function AzureMark({
  idSuffix,
  className,
  label,
}: CloudMarkProps & { readonly idSuffix: string; readonly label?: string }): JSX.Element {
  const a = `azA-${idSuffix}`;
  const c = `azC-${idSuffix}`;
  return (
    <svg className={className} data-mark="azure" viewBox="0 0 18 18" fill="none" {...spoken(label)}>
      <defs>
        <linearGradient id={a} x1="7.3" y1="1.06" x2="3.7" y2="11.7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#114A8B" />
          <stop offset="1" stopColor="#0669BC" />
        </linearGradient>
        <linearGradient
          id={c}
          x1="7.98"
          y1="0.75"
          x2="11.96"
          y2="11.28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3CCBF4" />
          <stop offset="1" stopColor="#2892DF" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${a})`}
        d="M6.36 1.19h4.78L6.18 15.9a.76.76 0 0 1-.72.52H1.73a.76.76 0 0 1-.72-1L5.64 1.71a.76.76 0 0 1 .72-.52z"
      />
      <path
        fill="#0078D4"
        d="M13.32 11.08H5.7a.35.35 0 0 0-.24.61l4.9 4.57a.76.76 0 0 0 .52.2h4.29z"
      />
      <path
        fill={`url(#${c})`}
        d="M12.29 1.71a.76.76 0 0 0-.72-.52H6.42a.76.76 0 0 1 .72.52l4.64 13.68a.76.76 0 0 1-.72 1.01h5.15a.76.76 0 0 0 .72-1.01z"
      />
    </svg>
  );
}

/**
 * The AWS smile. One drawing, two crops, because the mock frames it twice:
 *
 *   `badge`  tight on the arrow, so it sits on the Azure mark's baseline in the
 *            "Built for" tag rather than towering over it;
 *   `chip`   the sprite's looser box, with air above and below, which is what a
 *            chip and the assessment's cloud card are sized against.
 */
const AWS_VIEW_BOX = {
  badge: "5.2 22.2 29.2 11.9",
  chip: "5.2 20.2 29.2 15.9",
} as const;

export function AwsMark({
  className,
  crop = "chip",
  label,
}: CloudMarkProps & {
  readonly crop?: keyof typeof AWS_VIEW_BOX;
  readonly label?: string;
}): JSX.Element {
  return (
    <svg
      className={className}
      data-mark="aws"
      viewBox={AWS_VIEW_BOX[crop]}
      fill="none"
      {...spoken(label)}
    >
      <path
        d="M6 26.5c4.3 3 10.2 4.5 15.6 4.5 3.6 0 7.6-.75 11.3-2.3.55-.25 1 .35.47.75-3.3 2.45-8.1 3.75-12.2 3.75-5.8 0-11-2.15-15-5.7-.3-.3-.03-.7.33-.5z"
        fill="#FF9900"
      />
      <path
        d="M31.4 24.9c-.5-.65-3.3-.3-4.55-.15-.38.05-.44-.28-.1-.52 2.23-1.57 5.9-1.12 6.32-.59.43.53-.11 4.2-2.2 5.96-.32.27-.63.13-.49-.23.47-1.2 1.52-3.83 1.02-4.47z"
        fill="#FF9900"
      />
    </svg>
  );
}

/**
 * Tux. Painted in `currentColor`, so the ground decides the ink: near-black in
 * a light chip and the tag's own muted grey in the footer's "Built for".
 * `style` is here for the one place the mock sets the ink inline, the footer's
 * Linux chip.
 */
export function LinuxMark({
  className,
  style,
}: CloudMarkProps & { readonly style?: CSSProperties }): JSX.Element {
  return (
    <svg
      className={className}
      data-mark="linux"
      style={style}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z"
      />
    </svg>
  );
}

/**
 * The Windows four-pane mark, in Windows blue #0078D4 as every mock draws it:
 * a third-party mark in its own colour, like the Azure, AWS and Kubernetes
 * marks. Only Tux paints in `currentColor`, because its brand is ink.
 */
export function WindowsMark({ className }: CloudMarkProps): JSX.Element {
  return (
    <svg className={className} data-mark="windows" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#0078D4"
        d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z"
      />
    </svg>
  );
}

/**
 * The official Kubernetes helm, in the Kubernetes trademark blue #326CE5: a
 * third-party mark in its own colour, as the Azure and AWS marks are.
 *
 * This is the heavier of the two helm drawings the site carries, inked for a
 * box of 17px and up. The footer's cloud chip keeps its own finer one, drawn
 * for 14px, in `footer-marks.tsx`.
 */
export function KubernetesMark({ className }: CloudMarkProps): JSX.Element {
  return (
    <svg
      className={className}
      data-mark="kubernetes"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="#326CE5"
        d="M 24.00 2.00 L 41.20 10.28 L 45.45 28.90 L 33.55 43.82 L 14.45 43.82 L 2.55 28.90 L 6.80 10.28 Z"
      />
      <path
        fill="#FFFFFF"
        d="M 24.00 18.80 L 28.07 20.76 L 29.07 25.16 L 26.26 28.69 L 21.74 28.69 L 18.93 25.16 L 19.93 20.76 Z M 26.60 19.40 L 25.90 9.80 L 22.10 9.80 L 21.40 19.40 Z M 29.22 23.16 L 36.29 16.63 L 33.92 13.66 L 25.98 19.10 Z M 27.91 27.56 L 37.42 29.01 L 38.27 25.31 L 29.06 22.49 Z M 23.65 29.27 L 28.45 37.62 L 31.87 35.97 L 28.34 27.02 Z M 19.66 27.02 L 16.13 35.97 L 19.55 37.62 L 24.35 29.27 Z M 18.94 22.49 L 9.73 25.31 L 10.58 29.01 L 20.09 27.56 Z M 22.02 19.10 L 14.08 13.66 L 11.71 16.63 L 18.78 23.16 Z M 24.00 4.50 L 26.42 5.67 L 27.02 8.29 L 25.35 10.39 L 22.65 10.39 L 20.98 8.29 L 21.58 5.67 Z M 36.82 10.67 L 39.25 11.84 L 39.84 14.46 L 38.17 16.57 L 35.48 16.57 L 33.80 14.46 L 34.40 11.84 Z M 39.99 24.55 L 42.41 25.72 L 43.01 28.34 L 41.33 30.44 L 38.64 30.44 L 36.97 28.34 L 37.57 25.72 Z M 31.12 35.68 L 33.54 36.84 L 34.14 39.47 L 32.46 41.57 L 29.77 41.57 L 28.09 39.47 L 28.69 36.84 Z M 16.88 35.68 L 19.31 36.84 L 19.91 39.47 L 18.23 41.57 L 15.54 41.57 L 13.86 39.47 L 14.46 36.84 Z M 8.01 24.55 L 10.43 25.72 L 11.03 28.34 L 9.36 30.44 L 6.67 30.44 L 4.99 28.34 L 5.59 25.72 Z M 11.18 10.67 L 13.60 11.84 L 14.20 14.46 L 12.52 16.57 L 9.83 16.57 L 8.16 14.46 L 8.75 11.84 Z"
      />
    </svg>
  );
}
