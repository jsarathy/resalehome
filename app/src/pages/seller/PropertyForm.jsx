import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, updateProperty, getProperty } from '../../lib/firestore';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';

const EMPTY = {
  title: '', location: '', area_sqft: '', asking_price_lakhs: '',
  property_type: 'apartment', bedrooms: '', bathrooms: '',
  age_years: '', description: '', status: 'draft',
};

export default function PropertyForm() {
  const { id }     = useParams();
  const isEdit     = Boolean(id);
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getProperty(id).then((data) => {
      if (data) setForm({ ...EMPTY, ...data });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        area_sqft:            Number(form.area_sqft),
        asking_price_lakhs:   Number(form.asking_price_lakhs),
        bedrooms:             Number(form.bedrooms) || null,
        bathrooms:            Number(form.bathrooms) || null,
        age_years:            Number(form.age_years) || null,
      };
      if (isEdit) {
        await updateProperty(id, payload);
      } else {
        payload.sellerUid      = user.uid;
        payload.participantUids = [user.uid];
        await createProperty(payload);
      }
      navigate('/seller/properties');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit property' : 'List a new property'}</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Property title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 3BHK Flat in Anna Nagar" required />
          </div>
          <div className="form-field">
            <label>Location *</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Anna Nagar, Chennai" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-field">
              <label>Property type *</label>
              <select name="property_type" value={form.property_type} onChange={handleChange}>
                <option value="apartment">Apartment</option>
                <option value="house">Independent House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
              </select>
            </div>
            <div className="form-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="listed">Listed</option>
                <option value="under_offer">Under Offer</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-field">
              <label>Area (sq ft) *</label>
              <input name="area_sqft" type="number" value={form.area_sqft} onChange={handleChange} min="1" required />
            </div>
            <div className="form-field">
              <label>Bedrooms</label>
              <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} min="0" />
            </div>
            <div className="form-field">
              <label>Bathrooms</label>
              <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} min="0" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-field">
              <label>Asking price (₹ Lakhs) *</label>
              <input name="asking_price_lakhs" type="number" value={form.asking_price_lakhs} onChange={handleChange} min="1" required />
            </div>
            <div className="form-field">
              <label>Age (years)</label>
              <input name="age_years" type="number" value={form.age_years} onChange={handleChange} min="0" />
            </div>
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create property'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/seller/properties')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
