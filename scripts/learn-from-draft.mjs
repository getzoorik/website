#!/usr/bin/env node
// Writes a Learn article from its draft: src/content/learn/articles/<slug>.ts, and one module per diagram under
// src/features/learn/figures/<slug>/<n>.ts from its figure file. The words are the draft's own; nothing is retyped.
//
//   node scripts/learn-from-draft.mjs --drafts <dir> --figures <dir> --calendar <file> <slug>...
//   node scripts/learn-from-draft.mjs --drafts <dir> --figures <dir> --calendar <file> --all
//   node scripts/learn-from-draft.mjs --glossary --drafts <dir> --visual <dir> --day <iso day> (<slug>... | --all)
//
// Each flag but --glossary may instead come from the environment: LEARN_DRAFTS, LEARN_FIGURES, LEARN_CALENDAR,
// LEARN_VISUAL, LEARN_DAY.
//
//   --drafts    the folder of drafts, <slug>.md each, with the cloud cost pillar among them
//   --figures   the folder of figure files, <slug>-<n>.html each: one scoped <style>, then one <figure>
//   --calendar  a JSON file with `schedule` (each article's day and author key) and `authors`
//   --visual    (optional) the folder of drawn figures: <slug>/fig-<n>-*.svg and <slug>/captions.json. Where it has
//               an article's n-th figure, that drawing is used in place of the figure file
//   --day       (optional) the ISO day the articles go live, in place of the calendar's
//   --glossary  glossary terms in place of articles: src/content/learn/glossary/<slug>.ts, and the term's one drawn
//               figure under src/features/learn/figures/glossary/<slug>/1.ts. It reads the drafts, their drawings
//               (--visual) and the day they go live (--day), and needs no figure files or calendar
//
// A paragraph that opens with a bold label ("**Worked example.**", "**Rule of thumb.**", "**Watch out.**", "**For
// engineers.**", "**Note.**") is a callout. A drawn figure loses its "[ FIG n // … ]" line, and what is under it moves
// up into its place. An article's cover is public/learn-covers/zoorik-learn-<slug>-1200x630.webp when there is one.
//
// A draft is front matter (title, meta, h1, deck, card, product, hub_group, type), then the short answer, the
// sections ("## " headings, an id after a heading as {#id}), and the foot: the help box, the sources and the Related
// lines. A section holds paragraphs, "### " parts, lists (numbered ones may start past 1, and an item may hold a
// paragraph or a code block), pipe tables, fenced code and [DIAGRAM: …] lines, each drawn by its figure file in turn.
// Text may carry **bold**, `code`, [links](/path) and links to other sites; the article gets curly quotes and a
// no-break space between a figure and its unit, as the page prints them.
//
// The article's day and author come from the calendar, its topic from the pillar's list of every article, and a
// comparison's two sides from its h1; its share card is found by its address (`pageCards` in src/config/social.ts).
// The pillar's list itself is not copied: the page draws it from the index. The output is formatted with the repo's
// Prettier settings, and a second run writes the same files.
//
// A glossary draft is front matter (slug, route, group, product, term, title, h1, meta), the definition with what
// stands beside it before the first "## " heading, two to four sections in an article's blocks with one [DIAGRAM: …]
// among them, "## Related terms" (each line "- [Term](/learn/glossary/<slug>): its line"), "**Read next:**" and the
// sources. The title loses its " | Zoorik" (the site's template adds it); the hub's line under the term is the
// definition's first sentence. Every link to another term must lead to one of the drafts, and a link to the old
// /case-studies/<study> address is written to /value-lab/<study>, where the study lives now.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as prettier from "prettier";

import { curly } from "./curly-quotes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES = join(ROOT, "src", "content", "learn", "articles");
const FIGURES = join(ROOT, "src", "features", "learn", "figures");
const TERMS = join(ROOT, "src", "content", "learn", "glossary");
const TERM_FIGURES = join(FIGURES, "glossary");

/** The cloud cost pillar, whose last section lists every article: the page draws that list from the index. */
const PILLAR = "how-to-reduce-cloud-costs";
const EVERY_SECTION = "every-learn-article-by-subject";

/** Where a comparison's h1 reads badly as its two sides, or names no "vs", the sides its card shows. */
const VERSUS = {
  "kubernetes-allocatable-vs-capacity": ["Allocatable", "Capacity"],
  "aks-vs-eks-cost": ["AKS", "EKS"],
  "azure-disk-lrs-vs-zrs": ["LRS", "ZRS"],
  "combine-ebs-volumes": ["LVM · RAID 0", "btrfs pool"],
  "cordon-vs-drain": ["Cordon", "Drain"],
  "pod-affinity-vs-node-affinity": ["Pod affinity", "Node affinity"],
  "premium-ssd-vs-standard-ssd-azure": ["Premium SSD", "Standard SSD"],
};

// ─── the command line ────────────────────────────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const glossary = argv.includes("--glossary");
const flag = (name, env) => {
  const at = argv.indexOf(`--${name}`);
  if (at >= 0) {
    const value = argv[at + 1];
    argv.splice(at, 2);
    return value;
  }
  return process.env[env];
};
const draftsDir = flag("drafts", "LEARN_DRAFTS");
const figuresDir = flag("figures", "LEARN_FIGURES");
const calendarFile = flag("calendar", "LEARN_CALENDAR");
const visualDir = flag("visual", "LEARN_VISUAL");
const goLive = flag("day", "LEARN_DAY");
if (goLive && !/^\d{4}-\d{2}-\d{2}$/.test(goLive)) {
  console.error(`--day is an ISO day: "${goLive}"`);
  process.exit(1);
}
const named = argv.filter((arg) => !arg.startsWith("--"));
const all = argv.includes("--all");
if (
  !draftsDir ||
  (glossary ? !visualDir || !goLive : !figuresDir || !calendarFile) ||
  (!all && named.length === 0)
) {
  console.error(
    glossary
      ? "usage: node scripts/learn-from-draft.mjs --glossary --drafts <dir> --visual <dir> --day <iso day> (<slug>... | --all)"
      : "usage: node scripts/learn-from-draft.mjs --drafts <dir> --figures <dir> --calendar <file> (<slug>... | --all)",
  );
  process.exit(1);
}
const slugs = all
  ? readdirSync(draftsDir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.slice(0, -3))
      .sort()
  : named;
const calendar = glossary ? null : JSON.parse(readFileSync(calendarFile, "utf8"));

// ─── text ────────────────────────────────────────────────────────────────────────────────────────────────────────

const UNITS =
  "seconds?|minutes?|hours?|days?|weeks?|months?|ms|GiB|GB|TiB|TB|MiB|MB|KiB|KB|MB/s|MiB/s|IOPS|CPUs?|vCPUs?|cores?|" +
  "nodes?|pods?|replicas?|disks?|volumes?|snapshots?|copies|millicores";
const UNIT = new RegExp(`(\\d) (${UNITS})\\b`, "g");

/** A plain string as the page prints it: curly quotes, and a figure held to its unit. */
const typo = (s) => curly(s).replace(UNIT, "$1\u00a0$2");

/** A heading or a tile's title: words only, no code, bold or link. */
const words = (s) => {
  if (/`|\*\*|\]\(/.test(s)) throw new Error(`words only, no code, bold or link: ${s}`);
  return typo(s);
};

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** A link's address as the site serves it: the case studies moved from /case-studies to Value Lab. */
const moved = (href) => href.replace(/^\/case-studies(?=$|[/?#])/, "/value-lab");
const CODE = /`([^`]+)`/g;

/** Joins neighbouring strings, and returns one string where the run is only words. */
function compact(pieces) {
  const out = [];
  for (const piece of pieces) {
    if (piece === "") continue;
    if (typeof piece === "string" && typeof out.at(-1) === "string") out[out.length - 1] += piece;
    else out.push(piece);
  }
  if (out.length === 0) return "";
  return out.length === 1 && typeof out[0] === "string" ? out[0] : out;
}

/**
 * A run of text: links and code are held out first (their words are not touched by the quotes or the units), then
 * the quotes and units are set across the whole run, then bold is split out.
 */
function inline(source, links = true) {
  const keep = [];
  const hold = (piece) => {
    keep.push(piece);
    return `\u0003${keep.length - 1}\u0003`;
  };
  let s = source;
  if (links) {
    s = s.replace(LINK, (_, words, href) => {
      const run = inline(words, false);
      const a = typeof run === "string" ? run : run.length === 1 && run[0].code ? run[0] : null;
      if (a === null) throw new Error(`a link's words are words or one piece of code: ${words}`);
      return hold({ a, href: moved(href) });
    });
  }
  s = s.replace(CODE, (_, code) => hold({ code }));
  s = typo(s);
  const pieces = [];
  let last = 0;
  for (const match of s.matchAll(/\*\*(.+?)\*\*/g)) {
    pieces.push(s.slice(last, match.index));
    /* Bold may hold a link or code: its words, then, are pieces, as any run's are. */
    pieces.push({
      b: compact(
        match[1].split(/\u0003(\d+)\u0003/).map((part, i) => (i % 2 ? keep[Number(part)] : part)),
      ),
    });
    last = match.index + match[0].length;
  }
  pieces.push(s.slice(last));
  return compact(
    pieces.flatMap((piece) =>
      typeof piece === "string"
        ? piece.split(/\u0003(\d+)\u0003/).map((part, i) => (i % 2 ? keep[Number(part)] : part))
        : [piece],
    ),
  );
}

/** An anchor id from a heading: its first seven words, in lower case, joined by hyphens. */
function slugOf(text, count = 7) {
  const t = text
    .replace(/`|\*\*|\{#[^}]*\}/g, "")
    .toLowerCase()
    .replace(/\u2019/g, "")
    .replace(/'/g, "");
  return (t.match(/[a-z0-9]+/g) ?? []).slice(0, count).join("-");
}

// ─── blocks ──────────────────────────────────────────────────────────────────────────────────────────────────────

const ITEM = /^(-|\d+\.) (.*)$/;
const blank = (line) => line.trim() === "";
const indent = (line) => line.length - line.trimStart().length;

function dedent(lines) {
  const widths = lines.filter((line) => !blank(line)).map(indent);
  const ind = widths.length ? Math.min(...widths) : 0;
  return lines.map((line) => (blank(line) ? "" : line.slice(ind)));
}

/** The draft's blocks, in order: p, h3, code, table, diagram, ol and ul (each item its lines). */
function parse(lines) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (blank(l)) {
      i += 1;
      continue;
    }
    if (l.trimStart().startsWith("```")) {
      const ind = indent(l);
      const lang = l.trim().slice(3).trim();
      let j = i + 1;
      const code = [];
      while (j < lines.length && lines[j].trim() !== "```") {
        code.push(blank(lines[j].slice(0, ind)) ? lines[j].slice(ind) : lines[j]);
        j += 1;
      }
      out.push({ kind: "code", lang, code: code.join("\n") });
      i = j + 1;
      continue;
    }
    if (l.startsWith("|")) {
      let j = i;
      while (j < lines.length && lines[j].startsWith("|")) j += 1;
      out.push({ kind: "table", rows: lines.slice(i, j) });
      i = j;
      continue;
    }
    if (l.startsWith("### ")) {
      out.push({ kind: "h3", text: l.slice(4).trim() });
      i += 1;
      continue;
    }
    if (l.startsWith("[DIAGRAM:")) {
      out.push({ kind: "diagram", text: l.trim() });
      i += 1;
      continue;
    }
    let m = ITEM.exec(l);
    if (m) {
      const ordered = m[1] !== "-";
      const start = ordered ? Number(m[1].slice(0, -1)) : 1;
      const items = [];
      while (i < lines.length) {
        m = ITEM.exec(lines[i]);
        if (!m || (m[1] !== "-") !== ordered) break;
        const item = [m[2]];
        i += 1;
        while (i < lines.length) {
          if (blank(lines[i])) {
            let k = i;
            while (k < lines.length && blank(lines[k])) k += 1;
            if (k < lines.length && /^\s{2,}\S/.test(lines[k])) {
              for (let n = i; n < k; n++) item.push("");
              i = k;
              continue;
            }
            break;
          }
          if (/^\s{2,}\S/.test(lines[i])) {
            item.push(lines[i]);
            i += 1;
            continue;
          }
          if (
            !ITEM.test(lines[i]) &&
            !/^(\||#|```|\[DIAGRAM)/.test(lines[i]) &&
            item.at(-1) !== ""
          ) {
            item.push(lines[i]);
            i += 1;
            continue;
          }
          break;
        }
        items.push(item);
        let k = i;
        while (k < lines.length && blank(lines[k])) k += 1;
        const next = k < lines.length ? ITEM.exec(lines[k]) : null;
        if (next && (next[1] !== "-") === ordered) {
          i = k;
          continue;
        }
        break;
      }
      out.push({ kind: ordered ? "ol" : "ul", items, start });
      continue;
    }
    let j = i;
    const para = [];
    while (
      j < lines.length &&
      !blank(lines[j]) &&
      !/^(\||### |\[DIAGRAM)/.test(lines[j]) &&
      !lines[j].trimStart().startsWith("```") &&
      !ITEM.test(lines[j])
    ) {
      para.push(lines[j].trim());
      j += 1;
    }
    out.push({ kind: "p", text: para.join(" ") });
    i = j;
  }
  return out;
}

/** Rounds to a whole percent, a half to the even neighbour: the rule every table's widths are set by. */
function roundHalfEven(x) {
  const floor = Math.floor(x);
  const rest = x - floor;
  if (rest > 0.5) return floor + 1;
  if (rest < 0.5) return floor;
  return floor % 2 === 0 ? floor : floor + 1;
}

const length = (s) => [...s].length;

/** A table row's cells: a pipe inside code, or written `\|`, stays in its cell. */
function cells(row) {
  const held = [];
  const r = row
    .trim()
    .replace(/^\|+|\|+$/g, "")
    .replace(/\\\|/g, "\u0006")
    .replace(/`[^`]*`/g, (code) => {
      held.push(code);
      return `\u0005${held.length - 1}\u0005`;
    });
  return r.split("|").map((cell) =>
    cell
      .replace(/\u0005(\d+)\u0005/g, (_, n) => held[Number(n)])
      .replace(/\u0006/g, "|")
      .trim(),
  );
}

/** A pipe table: each column's width from the average length of its cells, at least 14% (the last at least 10%). */
function table(rows) {
  const head = cells(rows[0]);
  const body = rows.slice(2).map(cells);
  const n = head.length;
  const weight = head.map((_, k) => {
    let sum = 0;
    for (const r of body) if (k < r.length) sum += length(r[k]);
    return Math.max(6, sum / Math.max(1, body.length));
  });
  const total = weight.reduce((a, b) => a + b, 0);
  const pct = weight.map((w) => Math.max(14, roundHalfEven((100 * w) / total)));
  pct[n - 1] = Math.max(10, 100 - pct.slice(0, -1).reduce((a, b) => a + b, 0));
  return {
    kind: "table",
    columns: head.map((label, k) => ({ label: inline(label), width: `${pct[k]}%` })),
    rows: body.map((r) => r.slice(0, n).map((cell) => (cell ? inline(cell) : ""))),
  };
}

/** A list item: its words (with any lines that run on), then the blocks indented under it. */
function item(lines, ctx) {
  const [first, ...more] = lines;
  const cont = [];
  while (more.length && !blank(more[0]) && !/^\s{2,}/.test(more[0])) cont.push(more.shift().trim());
  const text = inline([first, ...cont].join(" "));
  if (!more.some((line) => !blank(line))) return text;
  return { text, blocks: render(parse(dedent(more)), ctx) };
}

const CALLOUT =
  /^\*\*(Worked example|Rule of thumb|Watch out|For engineers|Note)\.\*\*\s*([\s\S]*)$/;

/** The drawing of an article's n-th figure, or null where there is none. */
function drawing(slug, n) {
  if (!visualDir) return null;
  const dir = join(visualDir, slug);
  if (!existsSync(dir)) return null;
  const file = readdirSync(dir)
    .sort()
    .find((name) => new RegExp(`^fig-${n}-.*\\.svg$`).test(name));
  return file ? join(dir, file) : null;
}

function render(blocks, ctx) {
  return blocks.map((b) => {
    switch (b.kind) {
      case "p": {
        const callout = CALLOUT.exec(b.text);
        return callout
          ? { kind: "callout", label: callout[1], text: inline(callout[2]) }
          : { kind: "p", text: inline(b.text) };
      }
      case "h3":
        return {
          kind: "h3",
          id: /\{#([^}]+)\}\s*$/.exec(b.text)?.[1] ?? slugOf(b.text),
          title: words(b.text.replace(/\s*\{#[^}]*\}/g, "")),
        };
      case "code":
        return { kind: "code", lang: b.lang, code: b.code };
      case "table":
        return table(b.rows);
      case "diagram":
        ctx.figures += 1;
        if (drawing(ctx.slug, ctx.figures)) {
          ctx.drawn.add(ctx.figures);
          return { kind: "svg", figure: `\u0007${ctx.figures}` };
        }
        return { kind: "diagram", figure: `\u0007${ctx.figures}` };
      case "ol":
        return {
          kind: "ol",
          ...(b.start !== 1 ? { start: b.start } : {}),
          items: b.items.map((lines) => item(lines, ctx)),
        };
      case "ul":
        return { kind: "ul", items: b.items.map((lines) => item(lines, ctx)) };
    }
    throw new Error(`unknown block ${b.kind}`);
  });
}

// ─── the draft ───────────────────────────────────────────────────────────────────────────────────────────────────

function front(text) {
  if (!text.startsWith("---\n")) throw new Error("a draft opens on its front matter");
  const end = text.indexOf("\n---\n", 4);
  const meta = {};
  for (const line of text.slice(4, end).split("\n")) {
    const m = /^(\w+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const v = m[2].trim();
    try {
      meta[m[1]] = JSON.parse(v);
    } catch {
      meta[m[1]] = v;
    }
  }
  return { meta, body: text.slice(end + 5) };
}

/** Where a Related tile's page lives, as its tile says under its title. */
function where(href) {
  const path = href.split("#")[0].split("?")[0];
  if (path.startsWith("/learn/")) return "Learn";
  if (path.startsWith("/case-studies") || path.startsWith("/value-lab/")) return "Case study";
  if (path.startsWith("/docs/")) return "Docs";
  const m = /^\/(coral|amoeba)(\/(guide|faq))?$/.exec(path);
  if (m) {
    const name = m[1][0].toUpperCase() + m[1].slice(1);
    if (m[3] === "guide") return `${name} product guide`;
    if (m[3] === "faq") return `${name} FAQ`;
    return name;
  }
  return (
    {
      "/assessment": "Assessment",
      "/compare": "Cloud cost optimization tools",
      "/cloud-cost-optimization-library": "Cloud cost optimization tools",
      "/about": "About",
    }[path] ?? "Zoorik"
  );
}

function source(line) {
  let m = /^- (.+?), "(.+?)"(.*?): (https?:\/\/\S+)\s*$/.exec(line);
  if (m) {
    const [, publisher, title, note, url] = m;
    return {
      publisher: typo(publisher),
      title: curly(`"${title}"`),
      url,
      ...(note.trimEnd() ? { note: curly(note.trimEnd()) } : {}),
    };
  }
  m = /^- (.+?):? (https?:\/\/\S+)\s*$/.exec(line);
  if (!m) throw new Error(`a source is "- Publisher, "Title": address": ${line}`);
  return { title: curly(m[1]), url: m[2] };
}

/** The pillar's list of every article: each article's slug, by the heading it is listed under. */
function topics() {
  const { body } = front(readFileSync(join(draftsDir, `${PILLAR}.md`), "utf8"));
  const section = body.split(/\n## /).find((part) => slugOf(part.split("\n")[0]) === EVERY_SECTION);
  if (!section) throw new Error(`${PILLAR}: no "${EVERY_SECTION}" section`);
  const map = new Map([[PILLAR, "Cloud cost"]]);
  let heading = null;
  for (const line of section.split("\n")) {
    if (line.startsWith("### ")) heading = line.slice(4).trim();
    const link = /^- \[[^\]]+\]\(\/learn\/([^)#?]+)\)/.exec(line);
    if (link && heading) map.set(link[1], heading);
  }
  return map;
}

/** A comparison's two sides: its h1 before the colon, split at "vs" (the sides before the last joined by " · "). */
function versusOf(slug, h1) {
  if (VERSUS[slug]) return VERSUS[slug];
  const parts = h1
    .split(":")[0]
    .split(/\s+vs\.?\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) throw new Error(`${slug}: a comparison whose h1 names no two sides`);
  return [parts.slice(0, -1).join(" · "), parts.at(-1)];
}

const TOPICS = glossary ? null : topics();

function convert(slug) {
  const { meta, body } = front(readFileSync(join(draftsDir, `${slug}.md`), "utf8"));
  if (meta.slug !== slug) throw new Error(`${slug}: its front matter names ${meta.slug}`);
  const at = body.indexOf("\n**Help box:");
  if (at < 0) throw new Error(`${slug}: no help box`);
  const mainLines = body.slice(0, at).trimEnd().split("\n");
  while (mainLines.length && ["", "---"].includes(mainLines.at(-1).trim())) mainLines.pop();
  const foot = body.slice(at + 1).split("\n");

  const first = mainLines.findIndex((line) => line.startsWith("## "));
  const short = mainLines
    .slice(0, first)
    .filter((line) => !blank(line))
    .map((line) => line.trim())
    .join(" ")
    .replace("**Short answer.**", "")
    .trim();

  const ctx = { slug, figures: 0, drawn: new Set() };
  const sections = [];
  let current = null;
  for (const line of mainLines.slice(first)) {
    if (line.startsWith("## ")) {
      current = { heading: line.slice(3).trim(), lines: [] };
      sections.push(current);
    } else current.lines.push(line);
  }
  const drawn = sections.map(({ heading, lines }) => {
    const explicit = /\s*\{#([^}]+)\}\s*$/.exec(heading);
    const id = explicit ? explicit[1] : slugOf(heading);
    let blocks = render(parse(lines), ctx);
    if (slug === PILLAR && id === EVERY_SECTION) {
      const lead = blocks.findIndex((block) => block.kind === "h3");
      blocks = [...blocks.slice(0, lead < 0 ? blocks.length : lead), { kind: "every" }];
    }
    return { id, title: words(heading.replace(/\s*\{#[^}]*\}\s*$/, "")), blocks };
  });

  const helpProduct = /How (Coral|Amoeba) helps/.exec(foot[0])?.[1];
  if (!helpProduct) throw new Error(`${slug}: the help box names no product`);
  let i = 1;
  while (blank(foot[i])) i += 1;
  const helpText = foot[i].trim();
  const linksLine = foot.find((line) => line.startsWith("- Links:"));
  const links = [...linksLine.matchAll(/"([^"]+)" → (\S+?)(?:;|$)/g)].map(([, label, href]) => ({
    label: words(label),
    href,
  }));
  const s0 = foot.indexOf("**Sources:**");
  const r0 = foot.indexOf("**Related:**");
  if (s0 < 0 || r0 < 0) throw new Error(`${slug}: no Sources or Related`);
  const sources = foot
    .slice(s0 + 1, r0)
    .filter((line) => line.startsWith("- "))
    .map(source);
  const related = foot
    .slice(r0 + 1)
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const m = /^- "(.+)" → (\S+)\s*$/.exec(line);
      if (!m) throw new Error(`${slug}: a Related line is "- "Title" → /path": ${line}`);
      return { title: words(m[1]), where: where(m[2]), href: m[2] };
    });

  const day = calendar.schedule.find((entry) => entry.slug === slug);
  if (!day) throw new Error(`${slug}: not on the calendar`);
  if (!calendar.authors[day.author]) throw new Error(`${slug}: no author "${day.author}"`);
  const topic = TOPICS.get(slug);
  if (!topic) throw new Error(`${slug}: not in the pillar's list of every article`);
  const product = { Coral: "coral", Amoeba: "amoeba", Both: "both" }[meta.product];
  if (!product) throw new Error(`${slug}: product "${meta.product}"`);
  const cover = `/learn-covers/zoorik-learn-${slug}-1200x630.webp`;
  const h1 = typo(meta.h1);

  const article = {
    slug,
    title: curly(meta.title),
    meta: curly(meta.meta),
    h1,
    deck: typo(meta.deck),
    /* The hub card's line takes curly quotes only: no card line holds a figure and its unit, and the unit rule would
       hold the "2" of "gp2" to the word after it. */
    card: curly(meta.card),
    product,
    hub: meta.hub_group,
    topic,
    ...(meta.type === "versus" ? { versus: versusOf(slug, meta.h1) } : {}),
    published: goLive ?? day.date,
    updated: goLive ?? day.date,
    author: day.author,
    ...(existsSync(join(ROOT, "public", cover)) ? { cover } : {}),
    short: inline(short),
    sections: drawn,
    help: { product: helpProduct.toLowerCase(), text: inline(helpText), links },
    sources,
    related,
  };
  return { article, figures: ctx.figures, drawn: ctx.drawn };
}

// ─── a glossary term ─────────────────────────────────────────────────────────────────────────────────────────────

const GROUPS = ["kubernetes", "block-storage", "finops-pricing"];

/** The drafts' slugs: every link to a term must lead to one of them. */
const DRAFTED = glossary
  ? new Set(
      readdirSync(draftsDir)
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.slice(0, -3)),
    )
  : null;

/** Every link in a run of text, bold's own included. */
const linksIn = (run) =>
  typeof run === "string"
    ? []
    : run.flatMap((piece) =>
        typeof piece === "string"
          ? []
          : "a" in piece
            ? [piece]
            : "b" in piece
              ? linksIn(piece.b)
              : [],
      );

/** Every link in some blocks, a list item's own blocks included. */
const linksOf = (blocks) =>
  blocks.flatMap((block) => {
    if (block.kind === "p" || block.kind === "callout") return linksIn(block.text);
    if (block.kind === "ul" || block.kind === "ol")
      return block.items.flatMap((item) =>
        typeof item === "string" || Array.isArray(item)
          ? linksIn(item)
          : [...linksIn(item.text), ...linksOf(item.blocks)],
      );
    if (block.kind === "table")
      return [...block.columns.map((c) => c.label), ...block.rows.flat()].flatMap(linksIn);
    return [];
  });

/** A run of text as plain words: links and code as their words. */
const plain = (run) =>
  typeof run === "string"
    ? run
    : run
        .map((piece) =>
          typeof piece === "string"
            ? piece
            : "b" in piece
              ? plain(piece.b)
              : "code" in piece
                ? piece.code
                : typeof piece.a === "string"
                  ? piece.a
                  : piece.a.code,
        )
        .join("");

function convertTerm(slug) {
  const { meta, body } = front(readFileSync(join(draftsDir, `${slug}.md`), "utf8"));
  if (meta.slug !== slug) throw new Error(`${slug}: its front matter names ${meta.slug}`);
  if (meta.type !== "glossary") throw new Error(`${slug}: not a glossary draft`);
  if (meta.route !== `/learn/glossary/${slug}`)
    throw new Error(`${slug}: its route is ${meta.route}`);
  if (!GROUPS.includes(meta.group)) throw new Error(`${slug}: group "${meta.group}"`);
  if (!meta.title.endsWith(" | Zoorik")) throw new Error(`${slug}: its title ends " | Zoorik"`);
  const title = meta.title.slice(0, -" | Zoorik".length);
  if (title !== meta.h1) throw new Error(`${slug}: its title is its h1 and " | Zoorik"`);
  const product = { Coral: "coral", Amoeba: "amoeba", Both: "both" }[meta.product];
  if (!product) throw new Error(`${slug}: product "${meta.product}"`);
  if (Array.isArray(meta.owner_flags) && meta.owner_flags.length > 0)
    throw new Error(`${slug}: owner flags are open: ${meta.owner_flags.join("; ")}`);

  const lines = body.split("\n");
  const at = lines.findIndex((line) => line.startsWith("**Read next:**"));
  if (at < 0) throw new Error(`${slug}: no Read next`);
  const main = lines.slice(0, at);
  const foot = lines.slice(at);

  const first = main.findIndex((line) => line.startsWith("## "));
  const ctx = { slug, figures: 0, drawn: new Set() };
  const definition = render(parse(main.slice(0, first)), ctx);
  if (definition[0]?.kind !== "p") throw new Error(`${slug}: it opens on its definition`);

  const parts = [];
  for (const line of main.slice(first)) {
    if (line.startsWith("## ")) parts.push({ heading: line.slice(3).trim(), lines: [] });
    else parts.at(-1).lines.push(line);
  }
  const relatedPart = parts.find((part) => part.heading === "Related terms");
  if (!relatedPart) throw new Error(`${slug}: no Related terms`);
  const sections = parts
    .filter((part) => part !== relatedPart)
    .map(({ heading, lines: own }) => ({
      id: slugOf(heading),
      title: words(heading),
      blocks: render(parse(own), ctx),
    }));
  if (ctx.figures !== 1 || !ctx.drawn.has(1))
    throw new Error(`${slug}: a term has one figure, drawn in ${visualDir}/${slug}`);

  const related = relatedPart.lines
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const m = /^- \[([^\]]+)\]\(\/learn\/glossary\/([a-z0-9-]+)\): (.+?)\s*$/.exec(line);
      if (!m)
        throw new Error(
          `${slug}: a Related terms line is "- [Term](/learn/glossary/<slug>): line": ${line}`,
        );
      const [, title, target, rest] = m;
      /* Its line, a sentence of its own under the tile's title: its first letter in capitals, and a full stop where
         the draft leaves it off, as most drafts write it. */
      const text = words(rest);
      return {
        title: words(title),
        line: `${text[0].toUpperCase()}${text.slice(1)}${/[.?!]$/.test(text) ? "" : "."}`,
        href: `/learn/glossary/${target}`,
      };
    });

  const next = /^\*\*Read next:\*\* \[([^\]]+)\]\((\/learn\/[a-z0-9-]+)\)\s*$/.exec(foot[0]);
  if (!next) throw new Error(`${slug}: "**Read next:** [Title](/learn/<slug>)": ${foot[0]}`);
  const s0 = foot.indexOf("**Sources:**");
  if (s0 < 0) throw new Error(`${slug}: no Sources`);
  const sources = foot
    .slice(s0 + 1)
    .filter((line) => line.startsWith("- "))
    .map(source);

  /* A link to another term leads to one of the drafts: a term not drafted would be a dead link once published. */
  const links = [
    ...linksOf(definition),
    ...sections.flatMap((section) => linksOf(section.blocks)),
    ...related.map((tile) => ({ href: tile.href })),
  ];
  for (const { href } of links) {
    const term = /^\/learn\/glossary\/([^/?#]+)/.exec(href)?.[1];
    if (term && !DRAFTED.has(term))
      throw new Error(`${slug}: a link to a term not drafted: ${href}`);
    if (term === slug) throw new Error(`${slug}: a link to its own page`);
  }

  /* The hub's line: the definition's first sentence, in plain words. */
  const opening = plain(definition[0].text);
  const card = /^(.+?[.?!])(?=\s|$)/.exec(opening)?.[1];
  if (!card) throw new Error(`${slug}: its definition's first sentence ends on no full stop`);

  const term = {
    slug,
    term: curly(meta.term),
    title: typo(title),
    meta: curly(meta.meta),
    h1: typo(meta.h1),
    card,
    group: meta.group,
    product,
    published: goLive,
    updated: goLive,
    definition,
    sections,
    related,
    next: { title: words(next[1]), href: next[2] },
    sources,
  };
  return { term, figures: ctx.figures };
}

// ─── the files ───────────────────────────────────────────────────────────────────────────────────────────────────

/** A string as a template literal, for markup and style that read better on their own lines. */
const template = (s) =>
  `\`${s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\``;

/** A value as source: JSON, with the no-break space written as its escape so it can be seen. */
const literal = (value) => JSON.stringify(value).replace(/\u00a0/g, "\\u00a0");

/** The named character references a figure file's label may use, beside numeric ones; any other fails the run. */
const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  times: "\u00d7",
  ndash: "\u2013",
  mdash: "\u2014",
  hellip: "\u2026",
  rarr: "\u2192",
};

/**
 * An attribute's text as its characters: the label is set as a React attribute, which escapes what it is given, so
 * a character reference left in it would be read out as written. One pass, so "&amp;lt;" reads "&lt;".
 */
const decode = (s, name) =>
  s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);/gi, (_, ref) => {
    if (ref[0] === "#")
      return String.fromCodePoint(
        ref[1] === "x" || ref[1] === "X" ? parseInt(ref.slice(2), 16) : Number(ref.slice(1)),
      );
    if (!Object.hasOwn(ENTITIES, ref))
      throw new Error(`${name}: the label's &${ref}; is not one this script reads`);
    return ENTITIES[ref];
  });

function figureModule(slug, n) {
  const file = join(figuresDir, `${slug}-${n}.html`);
  if (!existsSync(file)) throw new Error(`${slug}: no figure file for diagram ${n}`);
  const text = readFileSync(file, "utf8");
  const m =
    /^\s*<style>\n([\s\S]*?)\n<\/style>\n<figure class="(ln-d fg-[a-z0-9-]+)" role="img" aria-label="([^"]*)">([\s\S]*)<\/figure>\s*$/.exec(
      text,
    );
  if (!m) throw new Error(`${slug}-${n}: a figure file is one <style>, then one <figure>`);
  const [, style, className, label, html] = m;
  if (className !== `ln-d fg-${slug}-${n}`)
    throw new Error(`${slug}-${n}: its class is ${className}`);
  return `import type { LearnFigure } from "@/content/learn/article";

export const figure: LearnFigure = {
  className: ${JSON.stringify(className)},
  label: ${literal(decode(label, `${slug}-${n}`))},
  style: ${template(style)},
  html: ${template(html)},
};
`;
}

/** A coordinate as the SVG writes it: at most two decimals, no trailing zeros. */
const num = (v) => String(Number(v.toFixed(2)));

/**
 * A drawing without its "[ FIG n // … ]" line: the line goes from the picture and from its title, and everything under
 * it moves up into its place, the canvas and its frame shortening by as much.
 */
function unkick(svg, name) {
  const kicker = /<text[^>]*>\s*\[\s*FIG \d+ \/\/[^<]*\]\s*<\/text>/.exec(svg);
  if (!kicker) return svg;
  const next = /<text[^>]*\by="([\d.]+)"/.exec(svg.slice(kicker.index + kicker[0].length));
  const up = Number(next[1]) - Number(/\by="([\d.]+)"/.exec(kicker[0])[1]);
  let out = svg.slice(0, kicker.index) + svg.slice(kicker.index + kicker[0].length);
  out = out.replace(/(<title[^>]*>)\s*\[\s*FIG \d+ \/\/[^\]]*\]\s*/, "$1");
  out = out.replace(
    /viewBox="0 0 ([\d.]+) ([\d.]+)"/,
    (_, w, h) => `viewBox="0 0 ${w} ${num(h - up)}"`,
  );
  out = out.replace(/(<svg[^>]*\bheight=")([\d.]+)"/, (_, head, h) => `${head}${num(h - up)}"`);
  const frame = /<\/desc>\s*(<rect[^>]*>)/.exec(out);
  if (!frame) throw new Error(`${name}: a drawing's frame follows its description`);
  const at = frame.index + frame[0].length - frame[1].length;
  const rect = frame[1].replace(/\bheight="([\d.]+)"/, (_, h) => `height="${num(h - up)}"`);
  out = `${out.slice(0, at)}${rect}<g transform="translate(0 -${num(up)})">${out.slice(at + frame[1].length)}`;
  return `${out.slice(0, out.lastIndexOf("</svg>"))}</g></svg>`;
}

function drawingModule(slug, n) {
  const name = `${slug}-${n}`;
  const svg = readFileSync(drawing(slug, n), "utf8")
    .replace(/<\?xml[^>]*>\s*/, "")
    .trim();
  const captions = join(visualDir, slug, "captions.json");
  const caption = existsSync(captions)
    ? JSON.parse(readFileSync(captions, "utf8"))[String(n)]
    : null;
  if (!caption) throw new Error(`${name}: a drawing has no caption`);
  return `import type { LearnSvgFigure } from "@/content/learn/article";

export const figure: LearnSvgFigure = {
  markup: ${template(unkick(svg, name))},
  caption: ${literal(inline(caption))},
};
`;
}

async function write(file, body) {
  const options = { ...(await prettier.resolveConfig(file)), filepath: file };
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, await prettier.format(body, options));
}

async function writeTerm(slug) {
  const { term, figures } = convertTerm(slug);
  const dir = join(TERM_FIGURES, slug);
  rmSync(dir, { recursive: true, force: true });
  for (let n = 1; n <= figures; n++) await write(join(dir, `${n}.ts`), drawingModule(slug, n));
  const imports = Array.from(
    { length: figures },
    (_, k) =>
      `import { figure as figure${k + 1} } from "@/features/learn/figures/glossary/${slug}/${k + 1}";`,
  );
  const body = `import type { GlossaryTerm } from "@/content/learn/glossary-term";
${imports.join("\n")}

export const term: GlossaryTerm = ${literal(term).replace(/"\\u0007(\d+)"/g, "figure$1")};
`;
  await write(join(TERMS, `${slug}.ts`), body);
  console.log(`glossary: ${slug}`);
}

if (glossary) for (const slug of slugs) await writeTerm(slug);

for (const slug of glossary ? [] : slugs) {
  const { article, figures, drawn } = convert(slug);
  const dir = join(FIGURES, slug);
  rmSync(dir, { recursive: true, force: true });
  for (let n = 1; n <= figures; n++)
    await write(
      join(dir, `${n}.ts`),
      drawn.has(n) ? drawingModule(slug, n) : figureModule(slug, n),
    );
  const imports = Array.from(
    { length: figures },
    (_, k) =>
      `import { figure as figure${k + 1} } from "@/features/learn/figures/${slug}/${k + 1}";`,
  );
  const body = `import type { Article } from "@/content/learn/article";
${imports.join("\n")}

export const article: Article = ${literal(article).replace(/"\\u0007(\d+)"/g, "figure$1")};
`;
  await write(join(ARTICLES, `${slug}.ts`), body);
  console.log(`learn: ${slug} (${figures} figure${figures === 1 ? "" : "s"})`);
}
