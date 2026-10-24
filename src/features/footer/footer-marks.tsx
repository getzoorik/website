import type { JSX } from "react";

import type { AskAssistant, FooterSocialPlatform } from "@/content/footer";

/** LinkedIn's "in": the footer's tile, and the white "in" of /careers's LinkedIn lockup. */
export const LINKEDIN_PATH =
  "M4.98 3.5a2.5 2.5 0 1 1-.02 5.001A2.5 2.5 0 0 1 4.98 3.5zM3.06 9.75h3.84V21H3.06V9.75zm6.24 0h3.68v1.54h.05c.51-.94 1.77-1.93 3.64-1.93 3.89 0 4.61 2.5 4.61 5.74V21h-3.84v-5.13c0-1.22-.02-2.8-1.74-2.8-1.75 0-2.01 1.33-2.01 2.71V21H9.3V9.75z";

/**
 * The social glyphs, inline and verbatim from the mock: LinkedIn, YouTube, X,
 * Reddit, Medium and GitHub.
 *
 * The marks in the "Built for" badge are NOT here: Azure and AWS are drawn on
 * other surfaces too, so they live in `@/components/brand/cloud-marks` where
 * every surface reads one copy.
 *
 * Inline SVG rather than <img>, for the mock's two reasons: each glyph paints
 * in `currentColor`, so it follows the ink `.soc` gives its tile (muted, then
 * `--text` on hover), and none of them costs a request. Drawn in the page's own
 * ink rather than as brand-coloured logos: no platform's colour is a Zoorik
 * palette entry. Every one is `aria-hidden`; the link around it carries the
 * name.
 *
 * Keyed by platform, a Record rather than a switch, so a new
 * `FooterSocialPlatform` is a compile error here instead of a tile that
 * silently renders empty.
 */
const socialMarks: Record<FooterSocialPlatform, JSX.Element> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={LINKEDIN_PATH} />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.39.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12C4.5 20.5 12 20.5 12 20.5s7.5 0 9.39-.58a3 3 0 0 0 2.11-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.53 3h2.94l-6.42 7.34L21.6 21h-5.9l-4.63-6.05L5.77 21H2.83l6.87-7.85L2.4 3h6.05l4.18 5.53L17.53 3zm-1.03 16.24h1.63L7.6 4.68H5.85l10.65 14.56z" />
    </svg>
  ),
  /* 🔴 THE EYES AND THE MOUTH ARE CUT OUT BY PAINT, NOT BY A HOLE. They are
     drawn over the head in `--surface`, the tile's own ground, through an
     inline style as the mock writes it: a `fill` attribute cannot take a
     custom property, so `fill="var(--surface)"` would paint them black. */
  reddit: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 8.4l1.2-4.8 4.4 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18.2" cy="4.8" r="1.7" fill="currentColor" />
      <circle cx="4.3" cy="11.6" r="2.2" fill="currentColor" />
      <circle cx="19.7" cy="11.6" r="2.2" fill="currentColor" />
      <ellipse cx="12" cy="14.6" rx="8.4" ry="6" fill="currentColor" />
      <circle cx="8.9" cy="13.6" r="1.3" style={{ fill: "var(--surface)" }} />
      <circle cx="15.1" cy="13.6" r="1.3" style={{ fill: "var(--surface)" }} />
      <path
        d="M8.8 16.9c1.9 1.3 4.5 1.3 6.4 0"
        fill="none"
        style={{ stroke: "var(--surface)" }}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  medium: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="6.8" cy="12" rx="6.8" ry="6.9" />
      <ellipse cx="17.4" cy="12" rx="3.4" ry="6.5" />
      <ellipse cx="22.4" cy="12" rx="1.2" ry="5.8" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
};

export function SocialMark({ platform }: { platform: FooterSocialPlatform }): JSX.Element {
  return socialMarks[platform];
}

/**
 * The AI assistants' marks for "Ask about Zoorik on" (owner, 23 Oct 2026): ChatGPT, Claude, Perplexity and Grok, each
 * one path in `currentColor`. From LobeHub Icons (`@lobehub/icons-static-svg` 1.98.0, MIT, Copyright (c) LobeHub,
 * https://github.com/lobehub/lobe-icons); the marks themselves are their owners' trademarks, used only to link to each
 * assistant. Keyed by assistant, as the social marks are.
 */
const askMarks: Record<AskAssistant, JSX.Element> = {
  chatgpt: (
    <svg className="mkt-mk mkt-ai" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  ),
  claude: (
    <svg className="mkt-mk mkt-ai" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  ),
  perplexity: (
    <svg className="mkt-mk mkt-ai" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z" />
    </svg>
  ),
  grok: (
    <svg className="mkt-mk mkt-ai" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
    </svg>
  ),
};

export function AskMark({ assistant }: { readonly assistant: AskAssistant }): JSX.Element {
  return askMarks[assistant];
}
