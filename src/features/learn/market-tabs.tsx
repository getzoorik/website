"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * Tools in the market's four tabs, on /compare (the mock's `market()`, its `MK_JS` `<script id="learn-v2-mk">`, and the
 * site-wide "product tabs" script, which binds every `[role="tablist"]` on the page): one tab per kind of tool, its
 * name and how many tools it lists, then the open tab's panel (`panels`, drawn on the server). Click a tab, or move
 * along them with the left and right arrows, Home and End, to open it; the arrows wrap, and the first is open at first.
 * As in the mock, every tab is in the tab order until one is picked; from then on only the open one is, so Tab leaves
 * the tabs for its panel. Nothing is stored.
 */
export function MarketTabs({
  label,
  tabs,
  panels,
}: {
  readonly label: string;
  readonly tabs: readonly { readonly label: string; readonly count: string }[];
  readonly panels: readonly ReactNode[];
}): React.JSX.Element {
  const [open, setOpen] = useState(0);
  const [picked, setPicked] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (index: number) => {
    setOpen(index);
    setPicked(true);
  };
  const onKey = (event: KeyboardEvent, index: number) => {
    const to = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[
      event.key
    ];
    if (to === undefined) return;
    event.preventDefault();
    const next = (to + tabs.length) % tabs.length;
    buttons.current[next]?.focus();
    pick(next);
  };
  return (
    <>
      <div className="mk-tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            type="button"
            role="tab"
            id={`mk-t${index}`}
            aria-controls={`mk-p${index}`}
            aria-selected={open === index}
            tabIndex={picked ? (open === index ? 0 : -1) : undefined}
            onClick={() => pick(index)}
            onKeyDown={(event) => onKey(event, index)}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            key={tab.label}
          >
            <b>{tab.label}</b>
            <small>{tab.count}</small>
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div
          className="mk-panel"
          role="tabpanel"
          id={`mk-p${index}`}
          aria-labelledby={`mk-t${index}`}
          hidden={open !== index}
          key={index}
        >
          {panel}
        </div>
      ))}
    </>
  );
}
