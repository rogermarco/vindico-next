import { extractSessionData } from "@/utils/extractSessions";
import { format } from "date-fns";

export default async function Home() {
  const sessions = await extractSessionData(new Date());
 
  return (
    <div className="w-[90%] md:w-4/5 flex flex-col items-center justify-center m-auto tracking-wide">
      <div className="flex flex-col items-center justify-center w-[90%] md:w-4/5 text-center my-3">
        <h1 className="font-semibold text-2xl">Vindico Arena Ice Skating Sessions</h1>
        <p>
          The Vindico website for figuring out session times is bad, so I made this instead. 
          Pulls data directly from their sources so you can trust it is up to date.
          Will only show the dates that Vindico has scheduled for.
        </p>
      </div>
      <hr className="mx-auto w-3/4 border-b-3 border-neutral-300 mb-3" />
      <div className="sessions-container grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(sessions).length > 0 ? (
          Object.entries(sessions).map(([dateString, sessionTypes]) => {
            // Convert the date string to a Date object for formatting
            const date = new Date(dateString);
            
            return (
              <div key={format(date, 'MMMM d')} className="date-section bg-fuchsia-200 text-center">
                <h2 className="font-semibold">{format(date, 'EEEE MMMM d')}</h2>
                <div className="session-types-container">
                  <div className="session-type">
                    <h3 className="underline">Public Sessions</h3>
                    {sessionTypes["Public Sessions"].length > 0 ? (
                      <ul>
                        {sessionTypes["Public Sessions"].map((session, index) => (
                          <li key={`public-${dateString}-${index}`}>
                            Time: {session.start} - {session.end}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No public sessions available</p>
                    )}
                  </div>
                  <div className="session-type">
                    <h3 className="underline">Training Sessions</h3>
                    {sessionTypes["Training Sessions"].length > 0 ? (
                      <ul>
                        {sessionTypes["Training Sessions"].map((session, index) => (
                          <li key={`training-${dateString}-${index}`}>
                            Time: {session.start} - {session.end}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No training sessions available</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No sessions available</p>
        )}
      </div>
      <hr className="mx-auto w-3/4 border-b-3 border-neutral-300 my-3" />
      <footer>
        <p className="font-light">Made by Marc with ❤️</p>
      </footer>
    </div>
  );
}