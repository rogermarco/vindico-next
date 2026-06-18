"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <hr className="mx-auto w-3/4 border-b-3 border-neutral-300 mb-3" />
      <div className="flex flex-col items-center justify-center text-center my-3">
        <p className="font-semibold">Could not load the session calendar.</p>
        <p className="font-light my-2">
          The data source may be temporarily unavailable. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-2 px-4 py-2 bg-[#FFBA49] border-2 border-[#111] rounded-2xl shadow-[4px_4px_0px_#111] font-semibold active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Try again
        </button>
      </div>
    </>
  );
}
