"use client";

import {
  createContext,
  useContext,
  useReducer,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import type { LearnSubject } from "@/content/learn";

/**
 * /learn's search, subject filter and fix picker (the mock's `JS`, `<script id="learn-v2-js">`): one state for the
 * page, held here and read by the small islands that draw what it changes. Every card and section is drawn on the
 * server (`children`); these draw only the element around it, so they can hide it. Nothing is stored (the privacy
 * policy: the site's code uses no browser storage): a reload starts on All, with an empty search.
 *
 * ─── WHAT A FILTER DOES, AS THE MOCK'S SCRIPT ───────────────────────────────
 * A card is findable: it shows when the chosen subject is its own (or All) and the search, trimmed and
 * in lower case, is part of its words (its title, line and subject, lower case: the mock's `data-s`). A section of
 * findable things hides when none of them shows. A question of Find the right fix hides when a subject is chosen and
 * the question is another's; the question chosen moves to the first one left when its own hides. The chips press
 * themselves (`aria-pressed`). "Nothing matches." shows when the search and the subject leave nothing.
 *
 * One change from the mock's script, so the search can say it found nothing: the mock hides Start here when none of
 * its cards shows, and "Nothing matches." is inside it, so the line could never be seen. Here Start here stays when
 * nothing at all matches, its cards hidden and the line under its head.
 */

/** A thing the search and the subject can hide: its subject and its words (lower case). */
export interface Findable {
  readonly subject: LearnSubject;
  readonly search: string;
}

interface FilterState {
  /** The chosen subject; "" is All, as the mock's `data-pick=""`. */
  readonly pick: LearnSubject | "";
  /** The search field, as typed. */
  readonly text: string;
  /** The question of Find the right fix that is open. */
  readonly fix: number;
}

type FilterAction =
  | { readonly type: "pick"; readonly pick: LearnSubject | "" }
  | { readonly type: "text"; readonly text: string }
  | { readonly type: "fix"; readonly fix: number }
  | { readonly type: "reset" };

interface FilterValue {
  readonly state: FilterState;
  readonly dispatch: (action: FilterAction) => void;
  /** Whether a findable thing shows. */
  readonly shows: (item: Findable) => boolean;
  /** Whether a question of Find the right fix shows. */
  readonly asks: (subject: LearnSubject) => boolean;
  /** The search and the subject leave nothing: "Nothing matches." shows. */
  readonly nothing: boolean;
}

const FilterContext = createContext<FilterValue | null>(null);

function useFilters(): FilterValue {
  const value = useContext(FilterContext);
  if (!value) throw new Error("A /learn filter island is drawn outside <LearnFilters>.");
  return value;
}

/**
 * The page's filter state, around the hero and the sections. `items` is every findable thing on the page (the empty
 * line counts them) and `fixes` the subject of each question of Find the right fix, in order.
 */
export function LearnFilters({
  items,
  fixes,
  children,
}: {
  readonly items: readonly Findable[];
  readonly fixes: readonly LearnSubject[];
  readonly children: ReactNode;
}): React.JSX.Element {
  const [state, dispatch] = useReducer(
    (current: FilterState, action: FilterAction): FilterState => {
      switch (action.type) {
        case "pick": {
          /* The open question hides with its subject: the first question left opens (the mock clicks it). */
          const open =
            action.pick && fixes[current.fix] !== action.pick
              ? Math.max(0, fixes.indexOf(action.pick))
              : current.fix;
          return { ...current, pick: action.pick, fix: open };
        }
        case "text":
          return { ...current, text: action.text };
        case "fix":
          return { ...current, fix: action.fix };
        case "reset":
          return { ...current, pick: "", text: "" };
      }
    },
    { pick: "", text: "", fix: 0 },
  );
  const query = state.text.trim().toLowerCase();
  const shows = (item: Findable) =>
    (!state.pick || item.subject === state.pick) && (!query || item.search.includes(query));
  const filtering = Boolean(state.pick || query);
  const value: FilterValue = {
    state,
    dispatch,
    shows,
    asks: (subject) => !state.pick || subject === state.pick,
    nothing: filtering && !items.some(shows),
  };
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

/** The search in the hero (the mock's `.lv-search`): its glass, its name for a screen reader and the field. */
export function LearnSearch({
  label,
  placeholder,
}: {
  readonly label: string;
  readonly placeholder: string;
}): React.JSX.Element {
  const { state, dispatch } = useFilters();
  return (
    <label className="lv-search">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="sr-only">{label}</span>
      <input
        type="search"
        placeholder={placeholder}
        data-search=""
        value={state.text}
        onChange={(event) => dispatch({ type: "text", text: event.target.value })}
      />
    </label>
  );
}

/** The subject chips: All, then each subject; one pressed at a time. */
export function SubjectChips({
  label,
  all,
  subjects,
}: {
  readonly label: string;
  readonly all: string;
  readonly subjects: readonly { readonly id: LearnSubject; readonly label: string }[];
}): React.JSX.Element {
  const { state, dispatch } = useFilters();
  return (
    <div className="lv-chips" role="group" aria-label={label}>
      {[{ id: "" as const, label: all }, ...subjects].map((subject) => (
        <button
          type="button"
          data-pick={subject.id}
          aria-pressed={state.pick === subject.id}
          onClick={() => dispatch({ type: "pick", pick: subject.id })}
          key={subject.id}
        >
          {subject.label}
        </button>
      ))}
    </div>
  );
}

/** A card the filters can hide: the link around its cover and body (the mock's `a.lv-card`). */
export function FindableCard({
  href,
  item,
  children,
}: {
  readonly href: string;
  readonly item: Findable;
  readonly children: ReactNode;
}): React.JSX.Element {
  const { shows } = useFilters();
  return (
    <a
      className="lv-card"
      href={href}
      data-p={item.subject}
      data-s={item.search}
      hidden={!shows(item)}
    >
      {children}
    </a>
  );
}

/**
 * A section of findable things, hidden when none of them shows. Start here (`keep`) stays while nothing at all
 * matches, so its "Nothing matches." can be seen.
 */
export function FindableSection({
  id,
  className,
  items,
  keep = false,
  children,
}: {
  readonly id: string;
  readonly className: string;
  readonly items: readonly Findable[];
  readonly keep?: boolean;
  readonly children: ReactNode;
}): React.JSX.Element {
  const { shows, nothing } = useFilters();
  const empty = !items.some(shows) && !(keep && nothing);
  return (
    <section className={className} id={id} aria-labelledby={`${id}-h`} hidden={empty}>
      {children}
    </section>
  );
}

/** "Nothing matches." and its button, which clears the search and the subject. */
export function NothingMatches({
  text,
  reset,
}: {
  readonly text: string;
  readonly reset: string;
}): React.JSX.Element {
  const { nothing, dispatch } = useFilters();
  return (
    <p className="lv-empty" hidden={!nothing}>
      {text}{" "}
      <button type="button" className="lv-reset" onClick={() => dispatch({ type: "reset" })}>
        {reset}
      </button>
    </p>
  );
}

/** One question of Find the right fix: its subject's dot and its words. */
export interface FixQuestion {
  readonly subject: LearnSubject;
  readonly question: string;
}

/**
 * Find the right fix's questions and answers (the mock's `fixer()` and `tabs(".fx-q button")`): a tab list, its
 * heading and one tab per question, then the navy panel with the open question's answer (`panels`, drawn on the
 * server). Click a question, or move along them with the arrow keys, to open it; a chosen subject hides the others'
 * questions.
 */
export function FixPicker({
  label,
  questions,
  panels,
}: {
  readonly label: string;
  readonly questions: readonly FixQuestion[];
  readonly panels: readonly ReactNode[];
}): React.JSX.Element {
  const { state, dispatch, asks } = useFilters();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const open = (index: number) => dispatch({ type: "fix", fix: index });
  /* The arrows move along the questions that show (the mock's walk also lands on hidden ones). */
  const onKey = (event: KeyboardEvent, index: number) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const shown = questions.flatMap((entry, i) => (asks(entry.subject) ? [i] : []));
    const at = shown.indexOf(index);
    const next = shown[(at + step + shown.length) % shown.length]!;
    tabs.current[next]?.focus();
    open(next);
  };
  return (
    <>
      <div className="fx-q" role="tablist" aria-label={label}>
        <p className="fx-qh">{label}</p>
        {questions.map((entry, index) => (
          <button
            type="button"
            role="tab"
            id={`fx-t${index}`}
            aria-controls={`fx-p${index}`}
            aria-selected={state.fix === index}
            data-p={entry.subject}
            hidden={!asks(entry.subject)}
            onClick={() => open(index)}
            onKeyDown={(event) => onKey(event, index)}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            key={entry.question}
          >
            <span className={`lv-dot lv-d-${entry.subject}`} aria-hidden="true" />
            {entry.question}
          </button>
        ))}
      </div>
      <div className="fx-a">
        {panels.map((panel, index) => (
          <div
            className="fx-panel"
            role="tabpanel"
            id={`fx-p${index}`}
            aria-labelledby={`fx-t${index}`}
            hidden={state.fix !== index}
            key={index}
          >
            {panel}
          </div>
        ))}
      </div>
    </>
  );
}
