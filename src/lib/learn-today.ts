/**
 * "Today" for the checks on Learn's dates: `LEARN_TODAY` (an ISO day) when it is set, so articles dated ahead of the
 * real day can be checked as of the day they go live; else the latest calendar day anywhere on Earth (UTC+14), so a
 * date set to today in any time zone is not "the future". Read by tests only; the site never reads the clock.
 */
export function learnToday(): string {
  const set = process.env.LEARN_TODAY?.trim();
  if (set) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(set) ||
      new Date(`${set}T00:00:00Z`).toISOString().slice(0, 10) !== set
    )
      throw new Error(`LEARN_TODAY is not an ISO day: "${set}"`);
    return set;
  }
  return new Date(Date.now() + 14 * 3_600_000).toISOString().slice(0, 10);
}
