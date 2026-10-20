/**
 * The three actions zoorik.com names to Microsoft Clarity, as privacy policy
 * §4.6 (version 1.1) discloses them: the action's name and nothing else, so
 * that each can be counted, and on which pages.
 *
 * A demo is booked on Cal.com, which the page cannot see: what it names is
 * the click on a link to the calendar.
 */
export const clarityEvents = {
  commandCopied: "assessment_command_copied",
  bookDemoClicked: "book_demo_clicked",
  emailClicked: "email_clicked",
} as const;

export type ClarityEvent = (typeof clarityEvents)[keyof typeof clarityEvents];

/**
 * Names one action to Clarity where Clarity runs: on zoorik.com, once the page
 * has loaded (`claritySnippet` defines `window.clarity` then). Anywhere else,
 * or earlier, it does nothing.
 */
export function clarityEvent(name: ClarityEvent): void {
  const clarity = (window as { clarity?: unknown }).clarity;
  if (typeof clarity === "function") clarity("event", name);
}
