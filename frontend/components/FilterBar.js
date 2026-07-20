'use client';

const FILTERS = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

export default function FilterBar({ value, onChange, counts }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          id={`filter-${f.value || 'all'}`}
          className={`filter-btn ${value === f.value ? 'active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
          {counts && (
            <span className="filter-count">
              {f.value === ''
                ? counts.all
                : f.value === 'pending'
                ? counts.pending
                : counts.completed}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
