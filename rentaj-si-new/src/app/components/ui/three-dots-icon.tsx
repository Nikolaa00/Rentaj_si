export function ThreeDotsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      className={className}
    >
      <circle cx="25" cy="25" r="25" fill="#2C2C2C" />
      <circle cx="25" cy="15" r="2" fill="#EBF4F4" />
      <circle cx="25" cy="25" r="2" fill="#EBF4F4" />
      <circle cx="25" cy="35" r="2" fill="#EBF4F4" />
    </svg>
  );
}