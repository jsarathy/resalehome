import { useState } from 'react';
import { useListedProperties } from '../../hooks/useProperty';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from './Browse.module.css';

const TYPES = ['all', 'apartment', 'house', 'villa', 'plot'];

export default function BuyerBrowse() {
  const { properties, loading, error } = useListedProperties();
  const [typeFilter, setTypeFilter]   = useState('all');
  const [search, setSearch]           = useState('');

  const filtered = properties.filter((p) => {
    const matchType   = typeFilter === 'all' || p.property_type === typeFilter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.location.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>Browse properties</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Search by name or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.typePills}>
          {TYPES.map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter(t)}
              style={{ textTransform: 'capitalize' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state"><p>No properties match your search.</p></div>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}
