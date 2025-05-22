export async function extractSessionData(startDate: Date): Promise<Record<string, Record<string, { start: string; end: string }[]>>> {
  const sessions: Record<string, Record<string, { start: string; end: string }[]>> = {};
 
  const start = new Date(startDate);
 
  let emptyDaysCount = 0;
  const maxEmptyDays = 7;

  while (emptyDaysCount < maxEmptyDays) {
    const formattedDate = start.toISOString().split('T')[0];
    console.log(`Fetching data for ${formattedDate}`);
    
   
    const data = await fetch(`https://embed.futureticketing.ie/v13.0.0/inc/api/calendar/?k=ft60df3e10d02ed&d=${formattedDate}`, {
      next: {
        revalidate: 3600 // 1 hour
      }
    })
      .then(response => response.json());
    
    const publicSessions = data.d.filter((entry: { ename: string }) =>
      entry.ename === "Public Session"
    );
    const trainingSessions = data.d.filter((entry: { ename: string }) =>
      entry.ename === "Figure Skating Training Session"
    );
    
    // Check if we have any sessions for this date
    if (publicSessions.length === 0 && trainingSessions.length === 0) {
      emptyDaysCount++;
      console.log(`No sessions found for ${formattedDate} 
                 (${emptyDaysCount} / ${maxEmptyDays} empty days)`);
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
  
  return sessions;
}