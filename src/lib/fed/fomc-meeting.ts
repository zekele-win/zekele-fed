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

export function getMeetingTime(currentTime: number = Date.now()): number {
  for (const meetingDateStr of MEETING_CALENDAR) {
    const meetingTime = new Date(meetingDateStr).getTime();
    if (meetingTime > currentTime) {
      return meetingTime;
    }
  }
  throw new Error(
    "[fomc-meeting] getMeetingTime - No upcoming FOMC meeting date found."
  );
}
