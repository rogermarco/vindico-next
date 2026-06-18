import { extractSessionData, type Slot } from "@/utils/extractSessions";
import { format, parseISO } from "date-fns";

function SessionType({ label, slots }: { label: string; slots: Slot[] }) {
  return (
    <div className="session-type mb-1">
      <h3 className="underline underline-offset-4">{label}</h3>
      {slots.length > 0 ? (
        <ul>
          {slots.map((slot, index) => (
            <li key={index} className="text-sm sm:text-base">
              {slot.start} - {slot.end}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sessions available</p>
      )}
    </div>
  );
}

export default async function Home() {
  const sessions = await extractSessionData(new Date());

  return (
    <div className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2 md:gap-4">
      {Object.entries(sessions).length > 0 ? (
        Object.entries(sessions).map(([dateString, sessionTypes]) => {
          // Parse the date-only string in local time (avoids the UTC
          // off-by-one-day that `new Date(dateString)` causes).
          const date = parseISO(dateString);

          // A day is "empty" when neither session type has any slots.
          const hasSessions = Object.values(sessionTypes).some(
            (slots) => slots.length > 0,
          );

          return (
            <div
              key={dateString}
              className={`${
                hasSessions
                  ? "odd:bg-fuchsia-100 even:bg-purple-200"
                  : "bg-neutral-300"
              } text-center p-1 border-[#111] border-2 md:border-3 rounded-3xl shadow-[4px_4px_0px_#111] md:shadow-[8px_8px_0px_#111]`}
            >
              <h2 className="font-semibold text-lg sm:text-xl text-balance mb-2">
                {format(date, "EEEE MMMM d")}
              </h2>
              {Object.entries(sessionTypes).map(([label, slots]) => (
                <SessionType key={label} label={label} slots={slots} />
              ))}
            </div>
          );
        })
      ) : (
        <p>No sessions available</p>
      )}
    </div>
  );
}
