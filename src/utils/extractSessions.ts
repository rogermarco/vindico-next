import { addDays, format } from "date-fns";

export type Slot = { start: string; end: string };
export type DaySessions = Record<string, Slot[]>;
export type Sessions = Record<string, DaySessions>;

// How many days ahead to fetch. The upstream calendar only schedules a few
// weeks out, so this is a generous window; trailing empty days are trimmed.
const DAYS_TO_FETCH = 60;

const API_BASE = "https://embed.futureticketing.ie/v13.0.0/inc/api/calendar/";
const API_KEY = process.env.FT_API_KEY ?? "ft60df3e10d02ed";

// The session types we care about, mapped from the upstream `ename` value to
// the label we render. Add a new entry here to surface another session type.
const SESSION_TYPES = {
  "Public Session": "Public Sessions",
  "Figure Skating Training Session": "Training Sessions",
} as const;

const LABELS = Object.values(SESSION_TYPES);

// Shape of the upstream calendar response (only the fields we use).
type ApiSlot = { st: string; et: string };
type ApiEntry = { ename: string; slot: ApiSlot[] };
type ApiResponse = { d?: ApiEntry[] | Record<string, ApiEntry> };

function emptyDay(): DaySessions {
  return Object.fromEntries(LABELS.map((label) => [label, []]));
}

/** Fetch and normalise a single day's sessions. Returns an empty day on error. */
async function fetchDay(date: Date): Promise<DaySessions> {
  const formattedDate = format(date, "yyyy-MM-dd");
  const day = emptyDay();

  try {
    const response = await fetch(
      `${API_BASE}?k=${API_KEY}&d=${formattedDate}`,
      {
        next: { revalidate: 3600 }, // 1 hour
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${formattedDate}`);
    }

    const data = (await response.json()) as ApiResponse;

    // The `d` field is usually an array but occasionally an object keyed by id.
    const entries: ApiEntry[] = Array.isArray(data.d)
      ? data.d
      : data.d
        ? Object.values(data.d)
        : [];

    for (const entry of entries) {
      const label = SESSION_TYPES[entry.ename as keyof typeof SESSION_TYPES];
      if (!label || !Array.isArray(entry.slot)) continue;

      for (const slot of entry.slot) {
        day[label].push({ start: slot.st, end: slot.et });
      }
    }
  } catch (error) {
    console.error(`Failed to fetch sessions for ${formattedDate}:`, error);
  }

  return day;
}

function isEmptyDay(day: DaySessions): boolean {
  return LABELS.every((label) => day[label].length === 0);
}

export async function extractSessionData(startDate: Date): Promise<Sessions> {
  // Fetch the whole window in parallel rather than walking day-by-day.
  const dates = Array.from({ length: DAYS_TO_FETCH }, (_, i) =>
    addDays(startDate, i),
  );

  const days = await Promise.all(dates.map(fetchDay));

  // Drop trailing empty days so we end on the last scheduled session.
  let lastWithSessions = -1;
  for (let i = days.length - 1; i >= 0; i--) {
    if (!isEmptyDay(days[i])) {
      lastWithSessions = i;
      break;
    }
  }

  const sessions: Sessions = {};
  for (let i = 0; i <= lastWithSessions; i++) {
    sessions[format(dates[i], "yyyy-MM-dd")] = days[i];
  }

  return sessions;
}
