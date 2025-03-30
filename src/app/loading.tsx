export default async function Loading() {
 
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
      {/* Fetch call loading in here */}
      <p>Fetching calendar data</p>
      <img className="w-10 h-10 animate-spin" src="https://www.svgrepo.com/show/491270/loading-spinner.svg" alt="Loading icon" />
      <footer>
        <p className="font-light">Made by Marc with ❤️</p>
      </footer>
    </div>
  );
}