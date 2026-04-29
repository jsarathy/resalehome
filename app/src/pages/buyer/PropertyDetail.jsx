import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProperty } from '../../hooks/useProperty';
import { createEnquiry } from '../../lib/firestore';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function BuyerPropertyDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const { property, loading } = useProperty(id);
  const [message, setMessage]   = useState('');
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  if (loading) return <LoadingSpinner fullPage />;
  if (!property) return <p>Property not found.</p>;

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await createEnquiry({
        propertyId:     id,
        buyerUid:       user.uid,
        sellerUid:      property.sellerUid,
        assignedRMUid:  property.assignedRMUid ?? null,
        participantUids: [
          user.uid,
          property.sellerUid,
          ...(property.assignedRMUid ? [property.assignedRMUid] : []),
        ].filter(Boolean),
        message,
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{property.title}</h1>
        <StatusBadge status={property.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <span className="section-label" style={{ marginBottom: '16px', display: 'block' }}>Details</span>
          <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Location</dt><dd>{property.location}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Type</dt><dd style={{ textTransform: 'capitalize' }}>{property.property_type}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Area</dt><dd>{property.area_sqft?.toLocaleString()} sq ft</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Age</dt><dd>{property.age_years ? `${property.age_years} yrs` : '—'}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Bedrooms</dt><dd>{property.bedrooms ?? '—'}</dd></div>
            <div><dt style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Bathrooms</dt><dd>{property.bathrooms ?? '—'}</dd></div>
          </dl>
          {property.description && (
            <p style={{ marginTop: '16px', fontSize: '14px' }}>{property.description}</p>
          )}
        </div>

        <div className="card">
          <span className="section-label" style={{ marginBottom: '8px', display: 'block' }}>Asking price</span>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600, color: 'var(--color-copper)', marginBottom: '24px' }}>
            ₹ {property.asking_price_lakhs} Lakhs
          </p>

          {sent ? (
            <div className="alert alert-success">
              Enquiry sent! The seller will be in touch soon.
            </div>
          ) : (
            <form onSubmit={submitEnquiry}>
              <div className="form-field">
                <label>Send an enquiry</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="I'm interested in this property…"
                  required
                />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
