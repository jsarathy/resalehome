import { useState } from 'react';

export default function RegisterForm({ onSuccess }) {
  const [form, setForm]     = useState({
    fullName: '', mobile: '', email: '', location: '',
    propertyType: '', area: '', price: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate async submission (real app would call Firestore / email API)
    await new Promise((r) => setTimeout(r, 600));
    const ref = 'RH-' + Math.floor(100000 + Math.random() * 900000);
    setSaving(false);
    onSuccess(ref);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="rf-name">Full name <span className="req">*</span></label>
        <input id="rf-name" name="fullName" type="text" value={form.fullName}
          onChange={set} placeholder="e.g. Ramesh Kumar" required autoComplete="name" />
      </div>

      <div className="form-row two-col">
        <div className="form-field">
          <label htmlFor="rf-mobile">Mobile number <span className="req">*</span></label>
          <input id="rf-mobile" name="mobile" type="tel" value={form.mobile}
            onChange={set} placeholder="+91 98765 43210" required autoComplete="tel" />
        </div>
        <div className="form-field">
          <label htmlFor="rf-email">Email address <span className="req">*</span></label>
          <input id="rf-email" name="email" type="email" value={form.email}
            onChange={set} placeholder="you@example.com" required autoComplete="email" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="rf-location">Property location <span className="req">*</span></label>
        <input id="rf-location" name="location" type="text" value={form.location}
          onChange={set} placeholder="e.g. Anna Nagar, Chennai" required />
      </div>

      <div className="form-row two-col">
        <div className="form-field">
          <label htmlFor="rf-type">Property type <span className="req">*</span></label>
          <select id="rf-type" name="propertyType" value={form.propertyType} onChange={set} required>
            <option value="" disabled>Select type</option>
            <option value="apartment">Apartment</option>
            <option value="house">Independent House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="rf-area">Approximate area <span className="req">*</span></label>
          <div className="input-wrap has-suffix">
            <input id="rf-area" name="area" type="number" value={form.area}
              onChange={set} placeholder="1200" min="1" required />
            <span className="suffix">sq ft</span>
          </div>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="rf-price">Approximate asking price <span className="req">*</span></label>
        <div className="input-wrap has-prefix has-suffix">
          <span className="prefix">₹</span>
          <input id="rf-price" name="price" type="number" value={form.price}
            onChange={set} placeholder="75" min="1" required />
          <span className="suffix">Lakhs</span>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="rf-notes">Additional notes</label>
        <textarea id="rf-notes" name="notes" value={form.notes} onChange={set}
          rows={3} placeholder="Any details you'd like to share about the property…" />
      </div>

      <button type="submit" className="form-submit-btn" disabled={saving}>
        {saving ? 'Submitting…' : 'Submit enquiry'}
      </button>

      <p className="form-privacy">
        By submitting you agree to our privacy policy. Your details will not be shared with third parties.
      </p>
    </form>
  );
}
