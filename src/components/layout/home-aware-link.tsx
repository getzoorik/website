"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * A link that means one thing at home and another everywhere else.
 *
 * The footer's wordmark goes back to the top on `/` and to `/` from any other
 * page, where it is named "Zoorik home". The footer is a server component
 * shared by every page, so this one leaf reads the pathname instead of each
 * page having to say where it is. The pathname is known at build, so every page
 * still prerenders with the right href.
 *
 * `usePathname` is null outside the app router (a unit test rendering the
 * footer on its own), which reads as the home page.
 */
export function HomeAwareLink({
  home,
  away,
  awayLabel,
  className,
  children,
}: {
  readonly home: string;
  readonly away: string;
  /** An accessible name for the away link, when its text alone is not enough. */
  readonly awayLabel?: string;
  readonly className?: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  const onHome = (usePathname() ?? "/") === "/";
  return (
    <a
      className={className}
      href={onHome ? home : away}
      aria-label={onHome ? undefined : awayLabel}
    >
      {children}
    </a>
  );
}
