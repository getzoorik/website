"use client";

import { Fragment, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { LinuxMark, WindowsMark } from "@/components/brand/cloud-marks";
import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { coralInstall, type InstallLink, type InstallOsKey } from "@/content/coral-install";
import { CommandLines } from "@/features/documents/doc-command-well";
import {
  AppleMark,
  HelmMark,
  TerraformMark,
  ZoorikctlMark,
} from "@/features/product-page/install-marks";
import { useCopyCommand } from "@/hooks/use-copy-command";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * /coral's "Install your way", after How it works and before Read more: the h2 with "Open source" at the right, then
 * three equal cards (one row from 981px), each its mark and name, one line, its command in a terminal and its links
 * pinned to the foot so the three foot rows line up.
 *
 * Each terminal is the assessment page's (owner, 23 Oct 2026): a #121629 panel under a bar with three square dots, and
 * in the bar zoorikctl's system switch, each system with its mark, or what the terminal holds ("Terminal", "main.tf").
 * Corners 4px and the dots square: blocks are pointy.
 *
 * zoorikctl's card opens on the visitor's own system, as the guides' switch does (the user agent, read once in the
 * browser; macOS while prerendering). Nothing is stored. The switch is a radio group: Arrow keys move and wrap, Home and
 * End go to the ends; a system changes the command, its copy and the "Or:" line. A well's copy button is the white
 * square at the terminal's top right; it turns to a tick for 1.6s with the name "Copied", and with no clipboard the
 * command is selected instead (`useCopyCommand`).
 */

/** Each system's mark in zoorikctl's switch: Apple's, then the site's own Tux and Windows. */
const osMark: Record<InstallOsKey, () => React.JSX.Element> = {
  mac: () => <AppleMark className="iw-os-m" />,
  linux: () => <LinuxMark className="iw-os-m" />,
  windows: () => <WindowsMark className="iw-os-m" />,
};

/** The terminal's three dots, square. */
function Dots(): React.JSX.Element {
  return (
    <span className="iw-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/** A terminal whose bar names what it holds: decorative, so hidden from a screen reader. */
function NamedTerminal({
  file,
  children,
}: {
  readonly file: string;
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="iw-term">
      <div className="iw-bar" aria-hidden="true">
        <Dots />
        <span className="iw-file">{file}</span>
      </div>
      {children}
    </div>
  );
}

function systemOs(): InstallOsKey {
  const agent = navigator as Navigator & {
    readonly userAgentData?: { readonly platform?: string };
  };
  const ua = `${agent.userAgentData?.platform || agent.platform || ""} ${agent.userAgent}`;
  if (/win/i.test(ua)) return "windows";
  if (/linux|x11|cros/i.test(ua) && !/android/i.test(ua)) return "linux";
  return "mac";
}

const noChange = () => () => {};

/** The copy button's two faces: two sheets, then a tick. */
function CopyIcon(): React.JSX.Element {
  return (
    <svg
      className="c1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
    </svg>
  );
}

function TickIcon(): React.JSX.Element {
  return (
    <svg
      className="c2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function CardLinks({ links }: { readonly links: readonly InstallLink[] }): React.JSX.Element {
  return (
    <div className="iw-links">
      {links.map((link) => (
        <a className="alink" href={link.href} key={link.href} {...offSiteProps(link.href)}>
          <span>{link.label}</span>
          {isOffSite(link.href) ? (
            <>
              <ExternalArrow />
              <NewTabHint href={link.href} />
            </>
          ) : (
            <Arrow />
          )}
        </a>
      ))}
    </div>
  );
}

/** A soft break after a "/" (not inside "//"), an "=" or a "."; a hyphenated word (--set, coral-agent) never parts. */
const HANG_PIECE = /(-{1,2}[A-Za-z][\w-]*|[A-Za-z]\w*(?:-\w+)+|\/(?!\/)|=|\.(?=\w))/;

function HangText({ text }: { readonly text: string }): React.JSX.Element {
  /* The text up to each soft break is one text node, the break's "/", "=" or "." with it, as the mock writes
     "oci://<wbr>ghcr.<wbr>io/<wbr>…": the same runs, so the same glyph positions. */
  const parts: React.ReactNode[] = [];
  let run = "";
  text.split(HANG_PIECE).forEach((part, index) => {
    if (index % 2 === 0) {
      run += part;
      return;
    }
    if (part === "/" || part === "=" || part === ".") {
      parts.push(
        <Fragment key={index}>
          {run + part}
          <wbr />
        </Fragment>,
      );
    } else {
      if (run) parts.push(<Fragment key={`${index}-t`}>{run}</Fragment>);
      parts.push(
        <span className="nb" key={index}>
          {part}
        </span>,
      );
    }
    run = "";
  });
  if (run) parts.push(<Fragment key="end">{run}</Fragment>);
  return <>{parts}</>;
}

/**
 * The Helm well's lines: each line one block, so a line longer than the card wraps with a hanging
 * indent and its wrapped part never starts where a new flag does. The prompt only where a command starts.
 */
function HangLines({
  lines,
  prompt,
}: {
  readonly lines: readonly string[];
  readonly prompt: string;
}): React.JSX.Element {
  return (
    <>
      {lines.map((line, index) => {
        const continued = index > 0 && lines[index - 1]!.endsWith("\\");
        const lead = line.length - line.trimStart().length;
        return (
          <span className="iw-ln" key={index}>
            {continued ? null : <i aria-hidden="true">{prompt}</i>}
            {/* The indent in the same text as what follows it, as the mock writes "  oci://". */}
            <HangText text={"\u00a0".repeat(lead) + line.slice(lead)} />
          </span>
        );
      })}
    </>
  );
}

/** A command well with its copy column; `hang` lays its lines out as the Helm well does. */
function Well({
  lines,
  prompt,
  label,
  hang = false,
}: {
  readonly lines: readonly string[];
  readonly prompt: string;
  /** "Copy the macOS command". */
  readonly label: string;
  readonly hang?: boolean;
}): React.JSX.Element {
  const pre = useRef<HTMLPreElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const { state, copy } = useCopyCommand(lines.join("\n"), pre, button);
  const done = state === "done";
  return (
    <div className={hang ? "iw-well is-hang" : "iw-well"}>
      <pre ref={pre}>
        {hang ? (
          <HangLines lines={lines} prompt={prompt} />
        ) : (
          <CommandLines lines={lines} prompt={prompt} />
        )}
      </pre>
      <button
        ref={button}
        className="iw-copy"
        type="button"
        aria-label={done ? "Copied" : label}
        data-done={done ? "" : undefined}
        onClick={copy}
      >
        <CopyIcon />
        <TickIcon />
      </button>
    </div>
  );
}

function ZoorikctlCard(): React.JSX.Element {
  const card = coralInstall.zoorikctl;
  const system = useSyncExternalStore<InstallOsKey>(noChange, systemOs, () => "mac");
  const [choice, setChoice] = useState<InstallOsKey | null>(null);
  const current =
    card.systems.find((option) => option.os === (choice ?? system)) ?? card.systems[0];
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (index: number, focus: boolean) => {
    const option = card.systems[index];
    if (!option) return;
    setChoice(option.os);
    if (focus) buttons.current[index]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = card.systems.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    pick(next, true);
  };

  return (
    <article className="iw-card">
      <div className="iw-h">
        <ZoorikctlMark className="iw-logo zk" />
        <h3 translate="no">{card.name}</h3>
        <span className="iw-tag">{card.tag}</span>
      </div>
      <p className="iw-line">{card.line}</p>
      <div className="iw-term">
        <div className="iw-bar">
          <Dots />
          <div className="iw-os" role="radiogroup" aria-label="Operating system">
            {card.systems.map((option, index) => {
              const on = option.os === current.os;
              const Mark = osMark[option.os];
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={on ? "true" : "false"}
                  tabIndex={on ? 0 : -1}
                  data-os={option.os}
                  key={option.os}
                  ref={(node) => {
                    buttons.current[index] = node;
                  }}
                  onClick={() => pick(index, false)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <Mark />
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>
        {/* A new system is a new well: its copy state starts again. */}
        <Well
          key={current.os}
          lines={current.lines}
          prompt={current.prompt}
          label={`Copy the ${current.name} command`}
        />
      </div>
      {"alternative" in current && current.alternative ? (
        <p className="iw-alt">
          Or: <code>{current.alternative}</code>
        </p>
      ) : null}
      <CardLinks links={card.links} />
    </article>
  );
}

export function InstallYourWay(): React.JSX.Element {
  const { helm, terraform } = coralInstall;
  return (
    <section className="sec" id="install" aria-labelledby="install-h">
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id="install-h">{coralInstall.title}</h2>
          <a className="alink" href={coralInstall.openSource.href}>
            <span>{coralInstall.openSource.label}</span>
            <Arrow />
          </a>
        </div>
        <div className="iw-grid">
          <ZoorikctlCard />
          <article className="iw-card">
            <div className="iw-h">
              <HelmMark className="iw-logo helm" />
              <h3>{helm.name}</h3>
            </div>
            <p className="iw-line">{helm.line}</p>
            <NamedTerminal file={helm.file}>
              <Well lines={helm.lines} prompt="$ " label="Copy the Helm command" hang />
            </NamedTerminal>
            <p className="iw-alt">
              <span translate="no">{helm.earlyAccess.name}</span>
              {helm.earlyAccess.before}
              <a href={helm.earlyAccess.href} {...offSiteProps(helm.earlyAccess.href)}>
                {helm.earlyAccess.link}
                <ExternalArrow />
                <NewTabHint href={helm.earlyAccess.href} />
              </a>
              {helm.earlyAccess.after}
            </p>
            <CardLinks links={helm.links} />
          </article>
          <article className="iw-card">
            <div className="iw-h">
              <TerraformMark className="iw-logo tf" />
              <h3>{terraform.name}</h3>
            </div>
            <p className="iw-line">{terraform.line}</p>
            <NamedTerminal file={terraform.file}>
              {/* No prompt and no copy: the module's source lines, the comments muted; on a phone the panel scrolls
                  rather than breaking a path. */}
              <div className="iw-well">
                <pre>
                  {terraform.lines.map((line, index) => (
                    <span key={index}>
                      {index > 0 ? "\n" : null}
                      {line.startsWith("#") ? <i>{line}</i> : line}
                    </span>
                  ))}
                </pre>
              </div>
            </NamedTerminal>
            <p className="iw-alt">{terraform.note}</p>
            <CardLinks links={terraform.links} />
          </article>
        </div>
      </div>
    </section>
  );
}
