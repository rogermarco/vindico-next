export function Header() {
  return (
    <header className="container">
      <div className=" text-center my-4 bg-[#FFBA49] border-3 rounded-3xl shadow-[4px_4px_0px_#111]">
        <h1 className="font-semibold text-2xl pt-4">
          Vindico Arena Ice Skating Sessions
        </h1>
        <p className="p-4">
          The Vindico website for figuring out session times is bad, so I made
          this instead. Pulls data directly from their sources so you can trust
          it is up to date. Will only show the dates that Vindico has scheduled
          for.
        </p>
      </div>
    </header>
  );
}
