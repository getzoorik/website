import type { ReactNode } from "react";

import { TurningMark } from "@/components/brand/turning-mark";
import { SiteNav } from "@/components/layout/site-nav";
import {
  brandAssetsPage,
  brandKitDir,
  brandKitZip,
  type BrandDont,
  type BrandTile,
} from "@/content/brand-assets";
import {
  CrossGlyph,
  DownloadGlyph,
  RecolouredMark,
  TickGlyph,
} from "@/features/brand-assets/brand-assets-glyphs";
import { BrandCopyButton } from "@/features/brand-assets/brand-copy-button";
import { brandKitSize } from "@/features/brand-assets/brand-kit-facts";
import racks from "@/features/brand-assets/hero-racks.webp";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";

/**
 * `/brand-assets`, on /about's frame: the utility hero, six sections, the footer.
 *
 *   hero                  Brand assets, the line, "Download all files" (the kit's ZIP, its size read from the file)
 *                         and "How to use them" (#rules)
 *   The logo              six tiles, each its file drawn on its ground, then its SVG and PNG downloads
 *   The mark              four tiles (band); the small marks with their 16, 32 and 64 px PNGs
 *   Colours and type      navy and bone, each with its hex, RGB and Copy, then three facts
 *   Clear space and size  the logo in its clear space; the size ladder and its three rules (band)
 *   Don't                 six pictures of the logo broken, and the line under them
 *   Names and words       six rows to copy, then where to write
 *
 * Every file is served from `public/brand-kit/` and downloads with the mock's `download` attribute. No closing
 * assessment row: the mock ends on the words. Nothing on the page moves but the hero's turning mark, which every
 * utility hero draws (still under reduced motion); the Copy buttons are the one client island.
 */

const kit = (file: string) => `${brandKitDir}/${file}`;

/**
 * A file of the kit, drawn as the file the reader downloads: a plain `<img>` of `/brand-kit/<file>`, not
 * next/image. The SVGs need no resizing, the sheet sizes every one (`.bk-prev img`, `.bk-cbox img`, the ladder's
 * own sizes), and next/image would wrap them and reinterpret boxes the mock sets exactly.
 */
function KitImage({
  file,
  alt = "",
  className,
  lazy,
  size,
}: {
  readonly file: string;
  /** Empty for a picture beside its own words, as the mock's. */
  readonly alt?: string;
  readonly className?: string;
  /** The tiles' previews, below the hero, load as the reader nears them (the mock's `loading="lazy"`). */
  readonly lazy?: boolean;
  /** The ladder's rungs: the size the rung shows, set on the image as the mock sets it. */
  readonly size?: number;
}): React.JSX.Element {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- see above: the sheet owns these boxes.
    <img
      className={className}
      src={kit(file)}
      alt={alt}
      loading={lazy ? "lazy" : undefined}
      style={size === undefined ? undefined : { width: size, height: size }}
    />
  );
}

function Section({
  id,
  title,
  lede,
  band,
  children,
}: {
  readonly id: string;
  readonly title: string;
  /** The line under the heading; Colours and type and Clear space and size have none, as the mock draws them. */
  readonly lede?: string;
  readonly band?: boolean;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <section className={band ? "sec sec-band" : "sec"} id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${id}-h`}>{title}</h2>
          {lede === undefined ? null : <p>{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Hero(): React.JSX.Element {
  const { hero } = brandAssetsPage;
  return (
    <header className="hero doc-hero" id="top">
      <TurningMark />
      <div className="wrap hero-in">
        <h1>{hero.title}</h1>
        <p className="doc-deck">{named(hero.deck)}</p>
        <div className="hero-cta">
          <a className="btn btn-light" href={kit(brandKitZip)} download>
            <DownloadGlyph />
            {` ${hero.download.label} `}
            <span className="bk-sz">{`${hero.download.kind} · ${brandKitSize()}`}</span>
          </a>
          <a className="btn btn-wire" href={hero.rules.href}>
            {hero.rules.label}
          </a>
        </div>
      </div>
    </header>
  );
}

function Tile({ tile }: { readonly tile: BrandTile }): React.JSX.Element {
  const pngs = tile.pngs ?? [{ label: "PNG", file: `${tile.stem}@2x.png` }];
  const files = [{ label: "SVG", file: `${tile.stem}.svg` }, ...pngs];
  return (
    <article className="bk-tile">
      <div className={`bk-prev bk-${tile.ground}`}>
        <KitImage file={`${tile.stem}.svg`} alt={tile.name} lazy />
      </div>
      <div className="bk-tb">
        <h3>{tile.name}</h3>
        <p>{tile.line}</p>
        <div className="bk-dls">
          {files.map(({ label, file }) => (
            <a className="bk-dl" href={kit(file)} download key={file}>
              <DownloadGlyph />
              {` ${label}`}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function Colours(): React.JSX.Element {
  const { colours } = brandAssetsPage;
  return (
    <Section id={colours.id} title={colours.title}>
      <div className="bk-sw-grid">
        {colours.swatches.map((swatch) => (
          <article className={`bk-sw bk-sw-${swatch.id}`} key={swatch.id}>
            <div className="bk-chip" />
            <div className="bk-swb">
              <h3>{swatch.name}</h3>
              <p className="bk-hex">{swatch.hex}</p>
              <p className="bk-rgb">{swatch.rgb}</p>
              <p>{swatch.line}</p>
              <BrandCopyButton text={swatch.hex} name={swatch.id} />
            </div>
          </article>
        ))}
      </div>
      <div className="bk-facts">
        {colours.facts.map((fact) => (
          <p key={fact.lead}>
            <b>{fact.lead}</b>
            {` ${fact.body}`}
          </p>
        ))}
      </div>
    </Section>
  );
}

function Rules(): React.JSX.Element {
  const { rules } = brandAssetsPage;
  return (
    <Section id={rules.id} title={rules.title} band>
      <div className="bk-space">
        <figure className="bk-clear">
          <div className="bk-cbox">
            <KitImage file="zoorik-logo-navy-transparent.svg" alt={rules.clearAlt} />
          </div>
          <figcaption>{rules.clearCaption}</figcaption>
        </figure>
        <div className="bk-sizes">
          <div className="bk-ladder">
            {rules.ladder.map(({ size, small }) => (
              <span className={small ? "bk-sm" : undefined} key={size}>
                <KitImage
                  file={
                    small
                      ? "zoorik-mark-small-navy-transparent.svg"
                      : "zoorik-mark-navy-transparent.svg"
                  }
                  size={size}
                />
                <small>{`${size} px`}</small>
              </span>
            ))}
          </div>
          <ul className="bk-list">
            {rules.list.map((rule) => (
              <li key={rule}>
                <span className="bk-ok">
                  <TickGlyph />
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/** The picture each Don't breaks the logo in, as the mock draws it. */
function DontArt({ art }: { readonly art: BrandDont["art"] }): React.JSX.Element {
  const navyLogo = "zoorik-logo-navy-transparent.svg";
  switch (art) {
    case "stretch":
      return <KitImage className="bk-x-stretch" file={navyLogo} />;
    case "rotate":
      return <KitImage className="bk-x-rot" file={navyLogo} />;
    case "recolour":
      return (
        <span className="bk-x-mark">
          <RecolouredMark />
        </span>
      );
    case "glow":
      return <KitImage className="bk-x-glow" file={navyLogo} />;
    case "photo":
      /* The mock's own photograph (the racks before the hero's brand grade, red LEDs and all) at its
         1200 px, as WebP. Not the hero's graded frame: that is a different picture. */
      return (
        <span className="bk-x-photo" style={{ backgroundImage: `url(${racks.src})` }}>
          <KitImage file="zoorik-logo-bone-transparent.svg" />
        </span>
      );
    case "retype":
      return (
        <span className="bk-x-type">
          <KitImage file="zoorik-mark-navy-transparent.svg" />
          <span>{brandAssetsPage.dont.retyped}</span>
        </span>
      );
  }
}

function Donts(): React.JSX.Element {
  const { dont } = brandAssetsPage;
  return (
    <Section id={dont.id} title={dont.title} lede={dont.lede}>
      <div className="bk-donts">
        {dont.items.map((item) => (
          <figure className="bk-dont" key={item.art}>
            <div className="bk-dprev" aria-hidden="true">
              <DontArt art={item.art} />
            </div>
            <figcaption>
              <span className="bk-no">
                <CrossGlyph />
              </span>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="bk-also">{dont.also}</p>
    </Section>
  );
}

function Words(): React.JSX.Element {
  const { words, ask } = brandAssetsPage;
  return (
    <Section id={words.id} title={words.title} lede={words.lede}>
      <div className="bk-rows">
        {words.rows.map((row) => (
          <div className="bk-row" key={row.label}>
            <div className="bk-rk">{row.label}</div>
            <div className="bk-rv">
              <p className="bk-text">{row.text}</p>
              {"note" in row ? <p className="bk-note">{row.note}</p> : null}
            </div>
            <BrandCopyButton text={row.text} name={row.label.toLowerCase()} />
          </div>
        ))}
      </div>
      <div className="bk-ask">
        <p>
          {named(ask.before)}
          <a href={ask.href}>{ask.email}</a>
          {ask.after}
        </p>
      </div>
    </Section>
  );
}

export function BrandAssetsPage(): React.JSX.Element {
  const { logo, mark } = brandAssetsPage;
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="bk-main">
        <Hero />
        <Section id={logo.id} title={logo.title} lede={logo.lede}>
          <div className="bk-grid bk-g3">
            {logo.tiles.map((tile) => (
              <Tile tile={tile} key={tile.stem} />
            ))}
          </div>
        </Section>
        <Section id={mark.id} title={mark.title} lede={mark.lede} band>
          <div className="bk-grid bk-g4">
            {mark.tiles.map((tile) => (
              <Tile tile={tile} key={tile.stem} />
            ))}
          </div>
        </Section>
        <Colours />
        <Rules />
        <Donts />
        <Words />
      </main>
      <FooterSection />
    </>
  );
}
