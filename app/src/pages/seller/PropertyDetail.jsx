import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../../hooks/useProperty';
import { usePropertyEnquiries } from '../../hooks/useEnquiry';
import { createValuation } from '../../lib/firestore';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useState } from 'react';

export default function SellerPropertyDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const { property, loading } = useProperty(id);
  const { enquiries, loading: eLoading } = usePropertyEnquiries(id);
  const [requesting, setRequesting] = useState(false);
  const [reqDone, setReqDone]       = useState(false);

  if (loading) return <LoadingSpinner fullPage />;
  if (!property) return <p>Property not found.</p>;

  const requestValuation = async () => {
    setRequesting(true);
    await createValuation({
      propertyId:     id,
      sellerUid:      user.uid,
      participantUids: [user.uid],
      requestedAt:    new Date().toISOString(),
    });
    setReqDone(true);
    setRequesting(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>{property.title}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/seller/properties/${id}/edit`} className="btn btn-secondary">Edit</Link>
          {!reqDone && (
            <button className="btn btn-primary" onClick={requestValuation} disabled={requesting}>
              {requesting ? 'Requesting…' : 'Request valuation'}
            </button>
          )}
          {reqDone && <span className="alert alert-success" style={{ margin: 0 }}>Valuation requested ✓</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <span className="section-label" style={{ marginBottom: '16px', display: 'block' }}>Property details</span>
          <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Location</dt><dd>{property.location}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Type</dt><dd style={{ textTransform: 'capitalize' }}>{property.property_type}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Area</dt><dd>{property.area_sqft?.toLocaleString()} sq ft</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Age</dt><dd>{property.age_years ? `${property.age_years} yrs` : '—'}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Bedrooms</dt><dd>{property.bedrooms ?? '—'}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Bathrooms</dt><dd>{property.bathrooms ?? '—'}</dd></div>
          </dl>
        </div>
        <div className="card">
          <span className="section-label" style={{ marginBottom: '16px', display: 'block' }}>Pricing &amp; status</span>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--color-copper)' }}>
            ₹ {property.asking_price_lakhs} L
          </p>
          <div style={{ marginTop: '12px' }}><StatusBadge status={property.status} /></div>
          {property.description && (
            <p style={{ marginTop: '16px', fontSize: '14px' }}>{property.description}</p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Enquiries ({enquiries.length})</h2>
        {eLoading ? <LoadingSpinner /> : enquiries.length === 0 ? (
          <div className="empty-state"><p>No enquiries yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Message</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.message}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                      {e.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
