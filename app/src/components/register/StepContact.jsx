import { useState } from 'react';
import FormChipGroup from './FormChipGroup';

const CONTACT_TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'];
const CITY_OPTIONS = ['Chennai', 'Bangalore', 'Hyderabad'];
const MAX_PHOTOS = 6;

export default function StepContact({ data, update, onBack, onSubmit, submitting, submitError, onRetry }) {
  const [errors, setErrors] = useState({});

  function handlePhotoChange(e) {
    const files = Array.from(e.target.files);
    const remaining = MAX_PHOTOS - data.photos.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    update('photos', [...data.photos, ...toAdd]);
    e.target.value = '';
  }

  function removePhoto(idx) {
    const updated = data.photos.filter((_, i) => i !== idx);
    update('photos', updated);
  }

  function validate() {
    const e = {};
    if (!data.sellerName.trim())  e.sellerName = 'Enter your name';
    if (!/^\d{10}$/.test(data.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!data.preferredContactTime.length) e.preferredContactTime = 'Select at least one time';
    if (!data.locality.trim())    e.locality = 'Enter a locality or area';
    if (!data.city)               e.city = 'Select a city';
    if (!data.declarationAgreed) e.declaration = 'Please confirm the declaration to proceed';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) onSubmit();
  }

  return (
    <div>
      <p className="reg-step-label">Step 3 of 3</p>
      <h2 className="reg-step-heading">Contact & confirmation</h2>

      <div className="form-grid">
        {/* Name */}
        <div className="form-field">
          <label>Your Name <span className="req">*</span></label>
          <input
            type="text"
            placeholder="Full name"
            value={data.sellerName}
            onChange={(e) => update('sellerName', e.target.value)}
          />
          {errors.sellerName && <span className="form-error">{errors.sellerName}</span>}
        </div>

        {/* Mobile */}
        <div className="form-field">
          <label>Mobile Number <span className="req">*</span></label>
          <div className="input-wrap has-prefix">
            <span className="prefix">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit number"
              maxLength={10}
              value={data.mobile}
              onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              style={{ paddingLeft: 44 }}
            />
          </div>
          {errors.mobile && <span className="form-error">{errors.mobile}</span>}
        </div>

        {/* Contact time */}
        <div className="form-field">
          <label>Preferred Contact Time <span className="req">*</span></label>
          <FormChipGroup
            options={CONTACT_TIME_OPTIONS}
            value={data.preferredContactTime}
            onChange={(v) => update('preferredContactTime', v)}
            multiple
          />
          {errors.preferredContactTime && (
            <span className="form-error">{errors.preferredContactTime}</span>
          )}
        </div>

        {/* Location */}
        <div className="form-row two-col">
          <div className="form-field">
            <label>Locality / Area <span className="req">*</span></label>
            <input
              type="text"
              placeholder="e.g. Anna Nagar, Koramangala"
              value={data.locality}
              onChange={(e) => update('locality', e.target.value)}
            />
            {errors.locality && <span className="form-error">{errors.locality}</span>}
          </div>
          <div className="form-field">
            <label>City <span className="req">*</span></label>
            <select
              value={data.city}
              onChange={(e) => update('city', e.target.value)}
            >
              <option value="">Select city</option>
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.city && <span className="form-error">{errors.city}</span>}
          </div>
        </div>

        {/* Photos */}
        <div className="form-field">
          <label>Property Photos (optional, up to {MAX_PHOTOS})</label>
          {data.photos.length < MAX_PHOTOS && (
            <>
              <input
                type="file"
                id="reg-photo-input"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <label htmlFor="reg-photo-input" className="photo-upload-label">
                <span className="photo-upload-icon">📷</span>
                <span className="photo-upload-hint">
                  Tap to add photos ({data.photos.length}/{MAX_PHOTOS})
                </span>
              </label>
            </>
          )}
          {data.photos.length > 0 && (
            <div className="photo-grid">
              {data.photos.map((p, i) => (
                <div key={i} className="photo-thumb">
                  <img src={p.preview} alt={`Property photo ${i + 1}`} />
                  <button
                    type="button"
                    className="photo-thumb-remove"
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Declaration */}
        <div className="declaration-check">
          <input
            type="checkbox"
            id="declaration"
            checked={data.declarationAgreed}
            onChange={(e) => update('declarationAgreed', e.target.checked)}
          />
          <label htmlFor="declaration">
            I confirm I am the owner or authorised representative of this property and the
            information provided is accurate to the best of my knowledge.
          </label>
        </div>
        {errors.declaration && <span className="form-error">{errors.declaration}</span>}
      </div>

      {submitError && (
        <div className="reg-error-banner">
          <span>{submitError}</span>
          <button type="button" className="btn btn-sm btn-danger" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      <div className="reg-nav">
        <button type="button" className="reg-nav-back" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting || !data.declarationAgreed}
        >
          {submitting ? 'Submitting…' : 'Submit Listing'}
        </button>
      </div>
    </div>
  );
}
