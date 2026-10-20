import type { JSX } from "react";

import type { AutoscalerLogo } from "@/content/product-page";

/**
 * Two autoscalers' logos for /coral's "Compatible with your native" row, each in
 * its project's own colours, verbatim from the mocks. Drawn inline, at the
 * symbol's own viewBox, rather than as a sprite: the row is the only place they
 * appear.
 *
 * 🔴 NEVER BESIDE "PARTNER" OR "OFFICIAL". They say what Coral works with, not
 * who endorses it.
 *  - Karpenter: github.com/aws/karpenter-provider-aws, website/assets/icons/
 *    logo.svg (Apache-2.0); the colour #5C62B0 from website/static/
 *    full_logo.svg in the same repository.
 *  - KEDA: github.com/cncf/artwork, projects/keda/icon/color/
 *    keda-icon-color.svg (Linux Foundation trademark usage guidelines); its
 *    embedded raster shadow dropped.
 *
 * Decorative: the name beside each mark carries the item.
 */
export function AutoscalerMark({ logo }: { readonly logo: AutoscalerLogo }): JSX.Element {
  return logo === "karpenter" ? <KarpenterMark /> : <KedaMark />;
}

function KarpenterMark(): JSX.Element {
  return (
    <svg
      className="vk-mk vk-mk-karpenter"
      viewBox="0 0 500 443"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#5C62B0"
        fillRule="evenodd"
        d="M237.7,0 C314.7,0 377,62.4 377,139.3 L377,139.3 L377,336.4 L442.6,336.4 C474.3,336.4 500,362 500,393.7 L500,393.7 L500,443 L492.5,443 C474.2,443 459.4,428.4 459,410.2 L459,410.2 L459,402 L459,401.6 C458.8,388.2 447.9,377.4 434.4,377.4 L434.4,377.4 L106.6,377.4 C47.7,377.4 0,329.7 0,270.8 L0,270.8 L0,139.3 C0,62.4 62.4,0 139.3,0 L139.3,0 Z M229.5,41 L147.5,41 L145.8,41 C87.7,42 41,89.3 41,147.6 L41,147.6 L41,270.8 L41,271.9 C41.6,307.6 70.7,336.4 106.6,336.4 L106.6,336.4 L270.5,336.4 C306.7,336.4 336.1,307 336.1,270.8 L336.1,270.8 L336.1,147.6 L336.1,145.8 C335.1,87.8 287.8,41 229.5,41 L229.5,41 Z M147.9,106.6 C157.2,106.6 164.6,114.3 164.6,123.9 L164.6,123.9 L164.6,173.8 L221.4,115.3 C228.8,108.4 238.9,107.9 246,114.5 L246,114.5 L246,114.8 C252.9,121.2 252.4,131.8 244.8,138.6 L244.8,138.6 L202.7,182 L251.6,251.9 C257.5,260.5 255.8,271.3 248,276.5 C239.3,281.4 229.5,278.7 223.6,270.1 L223.6,270.1 L179.6,205.6 L164.6,221.3 L164.6,261.7 C164.6,271.5 157.2,278.9 147.9,278.9 C138.5,278.9 131.1,271.5 131.1,261.7 L131.1,261.7 L131.1,123.9 C131.1,114.3 138.5,106.6 147.9,106.6 Z"
      />
    </svg>
  );
}

function KedaMark(): JSX.Element {
  return (
    <svg className="vk-mk vk-mk-keda" viewBox="0 0 625 625" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id="vkKedaG"
          x1="13.47"
          y1="482.29"
          x2="13.47"
          y2="481.29"
          gradientTransform="matrix(518.53, 0, 0, -494.87, -6676.79, 238739.99)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#719bea" />
          <stop offset="1" stopColor="#5478e0" />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#vkKedaG)"
        strokeWidth="30"
        d="M522.24,172.9c-1.86-5.44-6.28-10.35-12.36-13.63L318.77,68.71l-.11-.06c-2.07-1-5.08-1.55-9-1.55-3.56,0-5.14,0-7,.13a34.57,34.57,0,0,0-3.85.42L109.09,158.16l-.17.08A18.47,18.47,0,0,0,98.41,171L51.47,374.84a23.88,23.88,0,0,0,4.13,17.75l131.48,161a31,31,0,0,0,18.28,8.21h211.1l.82.09c5.8.64,11.32-1.88,15.16-7.06l.21-.28L564.91,392.59a27,27,0,0,0,4.65-18.18Z"
      />
      <g fill="#326de6">
        <circle cx="438" cy="553" r="39" />
        <circle cx="196" cy="553" r="39" />
        <circle cx="307" cy="73" r="39" />
        <circle cx="518" cy="165" r="39" />
        <circle cx="100" cy="165" r="39" />
        <circle cx="567" cy="384" r="39" />
        <circle cx="59" cy="384" r="39" />
        <path d="M195.77,367l-23-41.09-6.93,7.06v34h-18V277.1h18v29l26.32-29h24.26L185,312.28,217.21,367Zm99.89-89.87v18h-60v-18Zm-60,52.63v-18h49.68v18Zm0,37.37v-18h59.57v18Zm78.43-90h25.43a44.2,44.2,0,0,1,31.7,13.09,42.65,42.65,0,0,1,9.63,14.38,44.46,44.46,0,0,1,0,35.05,41,41,0,0,1-9.63,14.25,45.05,45.05,0,0,1-31.7,13.23H321.48V367h-7.34Zm18,72h7.45a27,27,0,0,0,0-54.05h-7.45Zm102.61-72H440l42.49,90H462.58L436.9,312.41,409.05,367.1H388.89Z" />
      </g>
      <polygon
        fill="#fff"
        points="446.72 363.34 451.59 354.62 432.75 354.62 438.38 315.55 438.1 315.03 408.31 368.99 408.32 368.99 407.42 370.59 426.54 370.44 421.46 408.86 421.58 409.36 444.66 367.09 444.65 367.09 444.65 367.09 446.72 363.34"
      />
      <path
        fill="#326de6"
        d="M444.66,367.09l6.88-12.45h-18.8l5.9-40.51-29.28,53h-6.45l34-63.7,33.95,63.7Z"
      />
    </svg>
  );
}
