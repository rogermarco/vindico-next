export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>Fetching calendar data</p>
      <svg
        className="w-10 h-10 animate-spin text-[#6C9A8B] my-3"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}
