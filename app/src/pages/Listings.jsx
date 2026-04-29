import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListedProperties } from '../lib/firestore';

const TYPE_OPTIONS = ['', 'apartment', 'house', 'villa', 'plot'];
const TYPE_LABELS  = { '': 'All types', apartment: 'Apartment', house: 'Independent House', villa: 'Villa', plot: 'Plot' };

export default function Listings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [maxPrice, setMaxPrice]     = useState('');

  useEffect(() => {
    getListedProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q);
    const matchType  = !typeFilter || p.property_type === typeFilter;
    const matchPrice = !maxPrice   || (p.asking_price_lakhs ?? 0) <= Number(maxPrice);
    return matchSearch && matchType && matchPrice;
  });

  return (
    <div className="listings-page">
      <div className="listings-hero">
        <div className="container">
          <span className="section-label">Browse Properties</span>
          <h1 className="listings-title">Find your next home</h1>
          <p className="listings-sub">Verified resale properties across South India</p>
        </div>
      </div>

      <div className="container">
        <div className="listings-filters">
          <div className="filter-search">
            <svg className="filter-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder="Search by location or title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search properties"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by property type"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
          <div className="filter-price">
            <input
              type="number"
              placeholder="Max price (₹ L)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              aria-label="Maximum price in lakhs"
            />
          </div>
        </div>

        {loading ? (
          <div className="listings-loading">
            <div className="listings-loading-spinner" aria-label="Loading properties" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No properties match your search.</p>
          </div>
        ) : (
          <>
            <p className="listings-count">{filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found</p>
            <div className="listings-grid">
              {filtered.map((p) => (
                <PublicPropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PublicPropertyCard({ property: p }) {
  const typeLabel = TYPE_LABELS[p.property_type] ?? p.property_type;
  return (
    <Link to={`/listings/${p.id}`} className="pub-property-card">
      <div className="pub-card-photo" aria-hidden="true">
        <span className="pub-card-type-badge">{typeLabel}</span>
      </div>
      <div className="pub-card-body">
        <h3 className="pub-card-title">{p.title || 'Property'}</h3>
        <p className="pub-card-location">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.63 3.5 6.5 3.5 6.5s3.5-3.87 3.5-6.5C9.5 2.57 7.93 1 6 1z" stroke="currentColor" strokeWidth="1" fill="none"/>
            <circle cx="6" cy="4.5" r="1" fill="currentColor"/>
          </svg>
          {p.location}
        </p>
        <div className="pub-card-meta">
          {p.area_sqft && <span>{p.area_sqft.toLocaleString()} sq ft</span>}
          {p.bedrooms  && <span>{p.bedrooms} BHK</span>}
        </div>
        <div className="pub-card-footer">
          <span className="pub-card-price">₹ {p.asking_price_lakhs} L</span>
          <span className="pub-card-cta">View details →</span>
        </div>
      </div>
    </Link>
  );
}
