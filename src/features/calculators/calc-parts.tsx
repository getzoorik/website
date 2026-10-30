"use client";

import { Fragment, useRef, type KeyboardEvent, type ReactNode } from "react";

/**
 * The calculators' controls, as the mocks draw them: the Coral guide's segmented switch (a radio group, one tab stop,
 * the arrow keys move the choice), /events' select and its search field's frame holding a number with its unit, and
 * the field's message and help lines. Each is one `.calc-f` in the form.
 */

/** A segmented switch: `role="radiogroup"`, the chosen button `aria-checked` and the one tab stop. */
export function CalcSwitch<V extends string>({
  name,
  label,
  options,
  value,
  onChange,
}: {
  /** `cloud` or `type`: the label's id is `<name>-l`. */
  readonly name: string;
  readonly label: string;
  readonly options: readonly (readonly [V, string])[];
  readonly value: V;
  readonly onChange: (value: V) => void;
}): React.JSX.Element {
  const group = useRef<HTMLDivElement>(null);
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next]![0]);
    group.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus();
  };
  return (
    <div className="calc-f">
      <span className="calc-l" id={`${name}-l`}>
        {label}
      </span>
      <div
        className="os-sw"
        role="radiogroup"
        aria-labelledby={`${name}-l`}
        data-sw={name}
        ref={group}
      >
        {options.map(([option, text], index) => (
          <button
            type="button"
            role="radio"
            aria-checked={option === value}
            tabIndex={option === value ? 0 : -1}
            data-v={option}
            key={option}
            onClick={() => onChange(option)}
            onKeyDown={(event) => move(event, index)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A labelled select: plain options, or options in named groups. */
export function CalcSelect({
  id,
  label,
  value,
  groups,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly groups: readonly {
    readonly label?: string;
    readonly options: readonly (readonly [string, string])[];
  }[];
  readonly onChange: (value: string) => void;
}): React.JSX.Element {
  const options = (list: readonly (readonly [string, string])[]) =>
    list.map(([option, text]) => (
      <option value={option} key={option}>
        {text}
      </option>
    ));
  return (
    <div className="calc-f">
      <label className="calc-l" htmlFor={id}>
        {label}
      </label>
      <select
        className="calc-sel"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {groups.map((group, index) =>
          group.label ? (
            <optgroup label={group.label} key={group.label}>
              {options(group.options)}
            </optgroup>
          ) : (
            <Fragment key={index}>{options(group.options)}</Fragment>
          ),
        )}
      </select>
    </div>
  );
}

/**
 * A number field in /events' field frame, its unit inside on the right; then its message (shown, with the frame in
 * the critical colour, while the field holds a value the calculator can't use), then its help line.
 */
export function CalcNumber({
  id,
  label,
  unit,
  value,
  message,
  help,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly unit: string;
  readonly value: string;
  readonly message?: string | null;
  readonly help?: ReactNode;
  readonly onChange: (value: string) => void;
}): React.JSX.Element {
  return (
    <div className="calc-f">
      <label className="calc-l" htmlFor={id}>
        {label}
      </label>
      <span className={message ? "calc-in is-bad" : "calc-in"}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          aria-describedby={help ? `${id}-m ${id}-h` : `${id}-m`}
          aria-invalid={message ? true : false}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="calc-u" aria-hidden="true">
          {unit}
        </span>
      </span>
      <p className="calc-m" id={`${id}-m`} hidden={!message}>
        {message ?? ""}
      </p>
      {help ? (
        <p className="calc-h" id={`${id}-h`}>
          {help}
        </p>
      ) : null}
    </div>
  );
}

/** One row of a result's list: its name, then its figure (`dd#o-…`, as the mocks name each one). */
export function CalcRow({
  id,
  rowId,
  term,
  hidden,
  children,
}: {
  readonly id: string;
  /** A row that can give way (the pod memory on EKS, Azure's tier rows): `#<id>-row`. */
  readonly rowId?: boolean;
  readonly term: ReactNode;
  readonly hidden?: boolean;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <div id={rowId ? `${id}-row` : undefined} hidden={hidden}>
      <dt>{term}</dt>
      <dd id={id}>{children}</dd>
    </div>
  );
}
