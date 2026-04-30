import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProperty, createEnquiry } from '../lib/firestore';
import { useAuth } from '../hooks/useAuth';

const TYPE_LABELS = { apartment: 'Apartment', house: 'Independent House', villa: 'Villa', plot: 'Plot' };

export default function ListingDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user, userProfile } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({ message: '' });
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [sendError, setSendError]     = useState('');

  useEffect(() => {
    getProperty(id)
      .then((p) => {
        if (!p || p.status !== 'listed') { setNotFound(true); }
        else { setProperty(p); }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/signup', { state: { from: { pathname: `/listings/${id}` } } });
      return;
    }
    setSending(true);
    setSendError('');
    try {
      await createEnquiry({
        property_id:    id,
        buyer_uid:      user.uid,
        seller_uid:     property.seller_uid,
        message:        enquiryForm.message,
        status:         'open',
        participantUids: [user.uid, property.seller_uid, ...(property.rm_uid ? [property.rm_uid] : [])],
      });
      setSent(true);
    } catch {
      setSendError('Could not send enquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="listing-detail-loading">
        <div className="listings-loading-spinner" aria-label="Loading" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="listing-detail-not-found container">
        <h2>Property not found</h2>
        <p>This listing may have been removed or is no longer available.</p>
        <Link to="/listings" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
          Back to listings
        </Link>
      </div>
    );
  }

  const p = property;
  const typeLabel = TYPE_LABELS[p.property_type] ?? p.property_type;

  return (
    <div className="listing-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="listing-breadcrumb" aria-label="Breadcrumb">
          <Link to="/listings">Browse Properties</Link>
          <span aria-hidden="true"> / </span>
          <span>{p.title || 'Property'}</span>
        </nav>

        <div className="listing-detail-grid">
          {/* Left: Photos + Details */}
          <div className="listing-detail-main">
            {/* Photo grid */}
            <div className="listing-photos" aria-label="Property photos">
              <div className="listing-photo-primary">
                <span className="listing-photo-badge">{typeLabel}</span>
              </div>
              <div className="listing-photo-secondary">
                <div className="listing-photo-thumb" />
                <div className="listing-photo-thumb" />
                <div className="listing-photo-thumb" />
              </div>
            </div>

            {/* Title & price */}
            <div className="listing-title-row">
              <div>
                <h1 className="listing-title">{p.title || 'Property'}</h1>
                <p className="listing-location">
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.63 3.5 6.5 3.5 6.5s3.5-3.87 3.5-6.5C9.5 2.57 7.93 1 6 1z" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <circle cx="6" cy="4.5" r="1" fill="currentColor"/>
                  </svg>
                  {p.location}
                </p>
              </div>
              <div className="listing-price">₹ {p.asking_price_lakhs} L</div>
            </div>

            {/* Key specs */}
            <div className="listing-specs">
              {p.area_sqft   && <div className="spec-item"><span className="spec-val">{p.area_sqft.toLocaleString()}</span><span className="spec-key">sq ft</span></div>}
              {p.bedrooms    && <div className="spec-item"><span className="spec-val">{p.bedrooms}</span><span className="spec-key">Bedrooms</span></div>}
              {p.bathrooms   && <div className="spec-item"><span className="spec-val">{p.bathrooms}</span><span className="spec-key">Bathrooms</span></div>}
              {p.year_built  && <div className="spec-item"><span className="spec-val">{p.year_built}</span><span className="spec-key">Year built</span></div>}
              {p.parking     && <div className="spec-item"><span className="spec-val">{p.parking}</span><span className="spec-key">Parking</span></div>}
            </div>

            {/* Description */}
            {p.description && (
              <div className="listing-description">
                <h2>About this property</h2>
                <p>{p.description}</p>
              </div>
            )}

            {/* Request Valuation CTA */}
            <div className="listing-valuation-cta">
              <div className="listing-val-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,14 8,9 12,12 17,5"/>
                  <polyline points="13,5 17,5 17,9"/>
                </svg>
              </div>
              <div>
                <p className="listing-val-title">Get a certified valuation</p>
                <p className="listing-val-sub">Our experts assess this property at fair market value — helping both sides transact with confidence.</p>
              </div>
            </div>
          </div>

          {/* Right: Enquiry panel */}
          <div className="listing-enquiry-panel">
            <div className="card">
              <h3 style={{ marginBottom: '4px', color: 'var(--color-ink)' }}>Enquire about this property</h3>
              <p style={{ fontSize: '13px', marginBottom: '20px' }}>
                {user ? "Send a message to the seller's advisor." : 'Sign in or register to contact the seller.'}
              </p>

              {sent ? (
                <div className="modal-success" style={{ padding: '24px 0' }}>
                  <div className="success-icon">✓</div>
                  <p className="success-title">Enquiry sent!</p>
                  <p className="success-sub">An advisor will be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="form-grid">
                  {sendError && <div className="alert alert-error">{sendError}</div>}
                  <div className="form-field">
                    <label htmlFor="enq-message">Your message</label>
                    <textarea
                      id="enq-message"
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ message: e.target.value })}
                      rows={4}
                      placeholder="I'm interested in this property and would like to schedule a visit…"
                      required
                    />
                  </div>
                  {user ? (
                    <button type="submit" className="form-submit-btn" disabled={sending}>
                      {sending ? 'Sending…' : 'Send enquiry'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link to={`/signup?redirect=/listings/${id}`} className="btn btn-primary btn-full">
                        Register to enquire
                      </Link>
                      <Link to={`/login?redirect=/listings/${id}`} className="btn btn-secondary btn-full">
                        Sign in
                      </Link>
                    </div>
                  )}
                  <p className="form-privacy">Your details are kept confidential and shared only with the seller's advisor.</p>
                </form>
              )}
            </div>

            {/* Trust signals */}
            <div className="listing-trust-signals">
              <div className="trust-signal">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 1L2 4v5c0 3.31 2.69 5.82 6 6 3.31-.18 6-2.69 6-6V4L8 1z" stroke="var(--color-teal)" strokeWidth="1.5" fill="none"/>
                  <path d="M5 8l2 2 4-4" stroke="var(--color-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>TNRERA Registered</span>
              </div>
              <div className="trust-signal">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="var(--color-copper)" strokeWidth="1.5"/>
                  <path d="M8 5v4l2 2" stroke="var(--color-copper)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Response within 24 hours</span>
              </div>
              <div className="trust-signal">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8l3 3 7-7" stroke="var(--color-copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Legal due diligence included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
