import { extractSessionData } from "@/utils/extractSessions";
import { format } from "date-fns";

export default async function Home() {
  const sessions = await extractSessionData(new Date());
 
  return (
    <div className="w-[90%] md:w-4/5 flex flex-col items-center justify-center m-auto tracking-wide">
      <div className="flex flex-col items-center justify-center w-[90%] mt-4 md:w-4/5 text-center bg-[#FFBA49] border-3 rounded-3xl shadow-[4px_4px_0px_#111] p-3 md:p-6">
        <h1 className="font-semibold text-2xl">Vindico Arena Ice Skating Sessions</h1>
        <p className="p-2 md:p-4">
          The Vindico website for figuring out session times is bad, so I made this instead. 
          Pulls data directly from their sources so you can trust it is up to date.
          Will only show the dates that Vindico has scheduled for.
        </p>
      </div>
      <hr className="mx-auto w-3/4 border-4 border-[#6C9A8B] shadow-[4px_4px_0px_#111] my-6" />
      <div className="sessions-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {Object.entries(sessions).length > 0 ? (
          Object.entries(sessions).map(([dateString, sessionTypes]) => {
            // Convert the date string to a Date object for formatting
            const date = new Date(dateString);
            
            return (
              <div key={format(date, 'MMMM d')} className="odd:bg-fuchsia-100 even:bg-purple-200 text-center p-1 border-[#111] border-2 md:border-3 rounded-3xl shadow-[4px_4px_0px_#111] md:shadow-[8px_8px_0px_#111]">
                <h2 className="font-semibold text-base sm:text-xl text-balance">{format(date, 'EEEE MMMM d')}</h2>
                <div className="session-types-container text-sm sm:text-base">
                  <div className="session-type">
                    <h3 className="underline">Public Sessions</h3>
                    {sessionTypes["Public Sessions"].length > 0 ? (
                      <ul>
                        {sessionTypes["Public Sessions"].map((session, index) => (
                          <li key={`public-${dateString}-${index}`}>
                            {session.start} - {session.end}
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
                            {session.start} - {session.end}
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
      <footer className="mt-2">
        <p className="font-light my-4">Made by Marc with ❤️</p>
      </footer>
    </div>
  );
}