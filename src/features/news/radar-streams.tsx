"use client";

import { useState, type ReactNode } from "react";

/**
 * Zoorik Radar's stream chips and the streams they show: All, then one chip per stream. A chip presses itself
 * (`aria-pressed`) and shows its own stream alone; All shows every stream. Each stream's tiles are drawn on the
 * server (`body`); this island draws only the chips and the element round each stream, so it can hide it. Without
 * scripting every stream shows and the chips do nothing. Nothing is stored: a reload starts on All.
 */

/** One stream: its id (the chip's and the group's `data-st`), its name, and its tiles. */
export interface RadarStreamGroup {
  readonly id: string;
  readonly label: string;
  readonly body: ReactNode;
}

export function RadarStreams({
  label,
  all,
  streams,
}: {
  /** The chips' name for a screen reader. */
  readonly label: string;
  /** The first chip's words. */
  readonly all: string;
  readonly streams: readonly RadarStreamGroup[];
}): React.JSX.Element {
  /* The chosen stream; "" is All. */
  const [pick, setPick] = useState("");
  return (
    <>
      <div className="nw-chips" role="group" aria-label={label}>
        {[{ id: "", label: all }, ...streams].map((chip) => (
          <button
            type="button"
            data-st={chip.id}
            aria-pressed={pick === chip.id}
            onClick={() => setPick(chip.id)}
            key={chip.id}
          >
            {chip.label}
          </button>
        ))}
      </div>
      {streams.map((stream) => (
        <div
          className="nw-g"
          data-st={stream.id}
          hidden={pick !== "" && pick !== stream.id}
          key={stream.id}
        >
          <h3 className="nw-sl">{stream.label}</h3>
          {stream.body}
        </div>
      ))}
    </>
  );
}
