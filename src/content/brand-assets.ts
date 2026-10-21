import { contactEmail } from "@/config/site";

/**
 * `/brand-assets`: every string the page prints, verbatim from the approved mock.
 *
 * Every rule and figure is the brand guidelines' own (brand 2.0): the two colours and their RGB, the
 * two contrast ratios (proved from the hex values in `brand-assets-page.test.tsx`), the 33 px / 32 px / 69 px sizes,
 * the clear space, the tagline and the company line. The files are `public/brand-kit/`, a copy of the brand's logo
 * files with one ZIP; the ZIP's size is read from the file at build, never typed here.
 *
 * Product names are written plainly here; the page keeps the ones the mock marks out of a translator's hands
 * (`named()`): "Zoorik" in the hero's line and in the line under the words. The words themselves are printed plainly,
 * as the mock prints them.
 *
 * ─── THE IDS ARE ADDRESSES ──────────────────────────────────────────────────
 * The sections (`#logo`, `#mark`, `#colours`, `#rules`, `#dont`, `#words`) are the mock's; the hero's second button
 * links `#rules`. Keep an id when its heading changes.
 */

/**
 * The day /brand-assets's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /brand-assets's content moves this to that day in the same PR; never the build's date.
 */
export const brandAssetsLastUpdated = "21 October 2026";

/** Where the kit's files are served (`public/brand-kit/`, a month in the browser: `public/_headers`). */
export const brandKitDir = "/brand-kit";

/** The kit's one ZIP: every logo file, the README, the tagline and the fonts. */
export const brandKitZip = "zoorik-brand-kit.zip";

/** The tagline, word for word. */
export const brandTagline = "Reduce cloud cost, autonomously.";

/** The company line, for search and directories. */
export const brandCompanyLine = "Zoorik is a cloud cost optimization company.";

/** The ground a tile's preview is drawn on: the brand navy, white, or the site's light surface. */
export type BrandGround = "navy" | "white" | "light";

/** One downloadable file under a tile: its button's label and its name in the kit. */
export interface BrandFile {
  readonly label: string;
  readonly file: string;
}

/** One tile: the file it previews (`<stem>.svg`), its name and line, its ground, and its PNG downloads. */
export interface BrandTile {
  readonly name: string;
  readonly line: string;
  readonly stem: string;
  readonly ground: BrandGround;
  /** The PNGs after the SVG: `<stem>@2x.png` as "PNG" unless the tile lists its own. */
  readonly pngs?: readonly BrandFile[];
}

/** One of the Don'ts: its caption and the picture that breaks the rule. */
export interface BrandDont {
  readonly caption: string;
  readonly art: "stretch" | "rotate" | "recolour" | "glow" | "photo" | "retype";
}

/** One row of Names and words: its label, the words a Copy button copies, and an optional note under them. */
export interface BrandWords {
  readonly label: string;
  readonly text: string;
  readonly note?: string;
}

/** One of the two colours: its name, hex, RGB, line, and its Copy button's name. */
export interface BrandColour {
  readonly id: "navy" | "bone";
  readonly name: string;
  readonly hex: string;
  readonly rgb: string;
  readonly line: string;
}

const smallMarks = (ink: "bone" | "navy"): readonly BrandFile[] =>
  (["16", "32", "64"] as const).map((size) => ({
    label: `PNG ${size}`,
    file: `zoorik-mark-small-${ink}-transparent-${size}.png`,
  }));

const tagged = `The logo over “${brandTagline}”`;

export const brandAssetsPage = {
  /** The page's `<title>` (through the site's "Zoorik | %s" template) and description. */
  meta: {
    title: "Brand assets",
    description:
      "Download the Zoorik logo, mark and brand kit, with the colours, the tagline and the rules for using them.",
  },
  hero: {
    title: "Brand assets",
    deck: "The Zoorik logo, colours and words, ready to use. Use the files as they are: never redraw or retype the logo.",
    /** The kit's button: its label, then "ZIP · <size>", the size read from the file. */
    download: { label: "Download all files", kind: "ZIP" },
    rules: { label: "How to use them", href: "#rules" },
  },
  logo: {
    id: "logo",
    title: "The logo",
    lede: "One colour, always. Pick the file for your background: SVG for screens and print, PNG where SVG isn’t accepted.",
    tiles: [
      {
        name: "Logo on navy",
        line: "The primary logo: bone on navy.",
        stem: "zoorik-logo-on-navy",
        ground: "navy",
      },
      {
        name: "Logo on white",
        line: "Navy on white.",
        stem: "zoorik-logo-on-white",
        ground: "white",
      },
      {
        name: "Bone, transparent",
        line: "For navy or other dark grounds.",
        stem: "zoorik-logo-bone-transparent",
        ground: "navy",
      },
      {
        name: "Navy, transparent",
        line: "For white or other light grounds.",
        stem: "zoorik-logo-navy-transparent",
        ground: "light",
      },
      {
        name: "With the tagline, bone",
        line: tagged,
        stem: "zoorik-logo-tagline-bone-transparent",
        ground: "navy",
      },
      {
        name: "With the tagline, navy",
        line: tagged,
        stem: "zoorik-logo-tagline-navy-transparent",
        ground: "light",
      },
    ] satisfies readonly BrandTile[],
  },
  mark: {
    id: "mark",
    title: "The mark",
    lede: "Two rings of squares round a solid core. The small mark has one ring, for 32 px and below.",
    tiles: [
      {
        name: "Mark, bone",
        line: "The mark alone, for avatars and icons above 32 px.",
        stem: "zoorik-mark-bone-transparent",
        ground: "navy",
      },
      {
        name: "Mark, navy",
        line: "The mark alone on light grounds.",
        stem: "zoorik-mark-navy-transparent",
        ground: "light",
      },
      {
        name: "Small mark, bone",
        line: "Only at 32 px and below: favicons and tabs.",
        stem: "zoorik-mark-small-bone-transparent",
        ground: "navy",
        pngs: smallMarks("bone"),
      },
      {
        name: "Small mark, navy",
        line: "Only at 32 px and below, on light grounds.",
        stem: "zoorik-mark-small-navy-transparent",
        ground: "light",
        pngs: smallMarks("navy"),
      },
    ] satisfies readonly BrandTile[],
  },
  colours: {
    id: "colours",
    title: "Colours and type",
    swatches: [
      {
        id: "navy",
        name: "Navy",
        hex: "#050B3D",
        rgb: "RGB 5, 11, 61",
        line: "The ground of every brand file, and the ink on white.",
      },
      {
        id: "bone",
        name: "Bone",
        hex: "#FAF7F3",
        rgb: "RGB 250, 247, 243",
        line: "The ink of the logo and the tagline on navy.",
      },
    ] satisfies readonly BrandColour[],
    /** The three facts under the swatches: a bold lead, then its sentence. */
    facts: [
      {
        lead: "Two colours, one at a time.",
        body: "The logo is always one colour: bone on navy, or navy on white. White is not a brand colour; it is only the page the navy logo sits on.",
      },
      { lead: "Contrast.", body: "Bone on navy 17.5 : 1. Navy on white 18.7 : 1." },
      {
        lead: "Type.",
        body: "The word is Fira Sans Medium and the tagline Fira Sans Regular, both in the ZIP under the SIL Open Font License.",
      },
    ],
  },
  rules: {
    id: "rules",
    title: "Clear space and size",
    clearAlt: "The Zoorik logo inside its clear space",
    clearCaption:
      "Clear space: one core diameter on every side. No text, edge or picture enters it.",
    /** The ladder: the full mark at 64 and 33 px, the small mark at 32 and 16 px. */
    ladder: [
      { size: 64, small: false },
      { size: 33, small: false },
      { size: 32, small: true },
      { size: 16, small: true },
    ],
    list: [
      "The full mark from 33 px up.",
      "The small mark at 32 px and below, and never above.",
      "The whole logo at least 69 px wide.",
    ],
  },
  dont: {
    id: "dont",
    title: "Don’t",
    lede: "The logo only works as it is drawn.",
    items: [
      { caption: "Don’t stretch or squash it", art: "stretch" },
      { caption: "Don’t rotate it", art: "rotate" },
      { caption: "Don’t recolour any part of it", art: "recolour" },
      { caption: "Don’t add shadows, glows or outlines", art: "glow" },
      { caption: "Don’t place it on photographs", art: "photo" },
      { caption: "Don’t retype the word", art: "retype" },
    ] satisfies readonly BrandDont[],
    /** The retyped word in the last picture: the name, set in a serif it must never be set in. */
    retyped: "Zoorik",
    also: "Also: don’t change the gap between the mark and the word, resize one against the other, or move the mark off the word’s centre line.",
  },
  words: {
    id: "words",
    title: "Names and words",
    lede: "Copy them exactly. Coral rebalances Kubernetes; Amoeba rightsizes block storage.",
    rows: [
      {
        label: "Name",
        text: "Zoorik",
        note: "In text, Zoorik starts with a capital Z. The lowercase zoorik is the logo’s alone.",
      },
      {
        label: "Tagline",
        text: brandTagline,
        note: "Always these exact words, in sentence case, with the comma and the full stop.",
      },
      { label: "Company line", text: brandCompanyLine },
      { label: "Coral", text: "Coral: Kubernetes cost optimization on AKS and EKS." },
      { label: "Amoeba", text: "Amoeba: block storage cost optimization on Azure and AWS." },
      {
        label: "About Zoorik",
        text: `${brandCompanyLine} Coral rebalances Kubernetes on AKS and EKS. Amoeba rightsizes block storage: Azure managed disks and Amazon EBS. Both work autonomously, without any downtime, and show what you spend and what you save. Start with the free assessment at zoorik.com/assessment. Zoorik Private Limited, Bangalore, India.`,
        note: "For press and partner pages.",
      },
    ] satisfies readonly BrandWords[],
  },
  /** The line under the words: "Need a format…? Write to <address>." */
  ask: {
    before: "Need a format that isn’t here, or writing about Zoorik? Write to ",
    after: ".",
    email: contactEmail,
    href: `mailto:${contactEmail}?subject=Brand%20assets`,
  },
  /** The Copy buttons: their label at rest and for 1.6 s after a copy, and what a screen reader hears then. */
  copy: { idle: "Copy", done: "Copied", announcement: "Copied" },
} as const;
