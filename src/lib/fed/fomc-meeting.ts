/**
 * Static FOMC meeting calendar and helper to resolve
 *   the next upcoming meeting time based on current timestamp.
 *
 * All times are in UTC.
 */

/**
 * Known scheduled FOMC meeting times (UTC).
 * Source: Federal Reserve official meeting calendar.
 */
const MEETING_CALENDAR = [
  "2026-01-28T19:00Z",
  "2026-03-18T18:00Z",
  "2026-05-06T18:00Z",
  "2026-06-17T18:00Z",
  "2026-07-29T18:00Z",
  "2026-09-16T18:00Z",
  "2026-11-04T19:00Z",
  "2026-12-16T19:00Z",
];

/**
 * Returns the timestamp of the next upcoming FOMC meeting.
 *
 * @param currentTime - Current time in milliseconds (defaults to Date.now())
 * @returns Meeting time in milliseconds
 * @throws If no future meeting date is found
 */
export function getMeetingTime(currentTime: number = Date.now()): number {
  for (const meetingDateStr of MEETING_CALENDAR) {
    const meetingTime = new Date(meetingDateStr).getTime();

    // First meeting strictly after current time
    if (meetingTime > currentTime) {
      return meetingTime;
    }
  }

  throw new Error(
    "[fomc-meeting] getMeetingTime - No upcoming FOMC meeting date found."
  );
}
