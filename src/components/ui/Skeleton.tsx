export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-surface rounded-xl ${className}`}
    />
  );
}
