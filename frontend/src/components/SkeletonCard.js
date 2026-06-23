'use client';

export default function SkeletonCard({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="skeleton h-48 w-full" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-5 w-3/4 rounded-lg" />
            <div className="skeleton h-4 w-1/2 rounded-lg" />
            <div className="space-y-2">
              <div className="skeleton h-3 w-full rounded-lg" />
              <div className="skeleton h-3 w-5/6 rounded-lg" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="skeleton h-7 w-20 rounded-full" />
              <div className="skeleton h-7 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
