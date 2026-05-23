import { Search } from 'lucide-react';

interface Props {
  filter: string;
  search: string;
  onFilterChange: (f: string) => void;
  onSearchChange: (s: string) => void;
}

const FILTERS = [
  { value: 'alle', label: 'Alle' },
  { value: 'eingereicht', label: 'Eingereicht' },
  { value: 'bestaetigt', label: 'Bestätigt' },
  { value: 'abgelehnt', label: 'Abgelehnt' },
];

export default function AdminFilters({ filter, search, onFilterChange, onSearchChange }: Props) {
  return (
    <div className="sf-card ad-filters">
      <div className="ad-filter-chips">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`ad-chip${filter === f.value ? ' ad-chip--active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="ad-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Suche nach Name, Firma oder Thema..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
