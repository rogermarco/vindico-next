function removeLastSeven(obj: Sessions) {
  const keys = Object.keys(obj);
  const keysToKeep = keys.slice(0, -7);

  const newObj: Sessions = {};

  for (const key of keysToKeep) {
    newObj[key] = obj[key];
  }
  return newObj;
}

type Sessions = Record<string, Record<string, { start: string; end: string }[]>>;

export async function extractSessionData(startDate: Date): Promise<Sessions> {
  const sessions: Sessions = {};
 
  const start = new Date(startDate);
 
  let emptyDaysCount = 0;
  const maxEmptyDays = 7;

  while (emptyDaysCount < maxEmptyDays) {
    const formattedDate = start.toISOString().split('T')[0];
   
    const data = await fetch(`https://embed.futureticketing.ie/v13.0.0/inc/api/calendar/?k=ft60df3e10d02ed&d=${formattedDate}`, {
      next: {
        revalidate: 3600 // 1 hour
      }
    })
    .then(response => response.json());

    // Normalise the response. Covers weird edge case of data having a different structure
    const sessionArray = Array.isArray(data.d) ? data.d : Object.values(data.d);

    // Filter for what we need
    const publicSessions = sessionArray.filter((entry: { ename: string }) =>
      entry.ename === "Public Session"
    );
    const trainingSessions = sessionArray.filter((entry: { ename: string }) =>
      entry.ename === "Figure Skating Training Session"
    );
    
    // Check if we have any sessions for this date. This is what ends the loop
    if (publicSessions.length === 0 && trainingSessions.length === 0) {
      emptyDaysCount++;
    } else {
      // Reset the empty days count
      emptyDaysCount = 0;
    }
    
    // Initialize the date entry if it doesn't exist
    if (!sessions[formattedDate]) {
      sessions[formattedDate] = {
        "Public Sessions": [],
        "Training Sessions": []
      };
    }
    
    // Process public sessions
    publicSessions.forEach((session: { slot: { st: string; et: string; }[] }) => {
      session.slot.forEach(slot => {
        sessions[formattedDate]["Public Sessions"].push({
          start: slot.st,
          end: slot.et
        });
      });
    });
    
    // Process training sessions
    trainingSessions.forEach((session: { slot: { st: string; et: string; }[] }) => {
      session.slot.forEach(slot => {
        sessions[formattedDate]["Training Sessions"].push({
          start: slot.st,
          end: slot.et
        });
      });
    });
    
    start.setDate(start.getDate() + 1);
  }
  const finalData = removeLastSeven(sessions);
  console.log(finalData);
  return finalData;
}