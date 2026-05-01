import { useState, useEffect } from 'react';
import { addDoc, updateDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import FormChipGroup from './register/FormChipGroup';

// ── Constants ─────────────────────────────────────────────────────────────────

const BHK_OPTIONS   = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];
const CARPARK_OPTIONS = ['None', 'Open', 'Covered', 'Both'];
const APT_FACILITIES = [
  'Clubhouse', 'Community Hall', 'Swimming Pool', 'Gym',
  "Children's Play Area", 'Power Backup', 'Lift', 'Security/CCTV', 'Other',
];
const IND_FACILITIES = APT_FACILITIES.filter((f) => f !== 'Lift');
const CONTACT_TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'];
const CITY_OPTIONS = ['Chennai', 'Bangalore', 'Hyderabad'];
const MAX_PHOTOS = 6;

// ── Helpers ───────────────────────────────────────────────────────────────────

const toSqft = (val, unit) => {
  const n = Number(val) || 0;
  return unit === 'sqm' ? Math.round(n * 10.764) : n;
};

const formatINR = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n));

function UnitToggle({ value, onChange }) {
  return (
    <div className="unit-toggle">
      <button type="button" className={value === 'sqft' ? 'active' : ''} onClick={() => onChange('sqft')}>
        sq ft
      </button>
      <button type="button" className={value === 'sqm' ? 'active' : ''} onClick={() => onChange('sqm')}>
        sq m
      </button>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="form-section-label">{children}</div>;
}

// ── Component ─────────────────────────────────────────────────────────────────

const INITIAL = {
  propertyType: '',
  bhk: '',
  // apartment
  saleableArea: '', saleableAreaUnit: 'sqft',
  udsArea: '',     udsAreaUnit: 'sqft',
  apartmentCount: '',
  // independent
  landArea: '',    landAreaUnit: 'sqft',
  builtUpArea: '', builtUpAreaUnit: 'sqft',
  // common
  ageYears: '',
  carPark: '',
  facilities: [],
  facilitiesOther: '',
  expectedPrice: '',
  // contact
  sellerName: '',
  mobile: '',
  preferredContactTime: [],
  locality: '',
  city: '',
  photos: [],
  declarationAgreed: false,
};

export default function RegisterForm({ onSuccess }) {
  const { user } = useAuth();
  const [form, setForm]         = useState(INITIAL);
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Pre-fill name from auth profile
  useEffect(() => {
    if (user?.displayName) {
      setForm((f) => ({ ...f, sellerName: f.sellerName || user.displayName }));
    }
  }, [user]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  // ── Live price-per-sqft ────────────────────────────────────────────────────

  const isApt      = form.propertyType === 'apartment';
  const refAreaSqft = isApt
    ? toSqft(form.saleableArea, form.saleableAreaUnit)
    : toSqft(form.builtUpArea, form.builtUpAreaUnit);
  const priceNum    = Number(form.expectedPrice) || 0;
  const pricePerSqft = refAreaSqft > 0 ? Math.round(priceNum / refAreaSqft) : 0;

  // ── Photo handling ─────────────────────────────────────────────────────────

  function handlePhotoChange(e) {
    const files     = Array.from(e.target.files);
    const remaining = MAX_PHOTOS - form.photos.length;
    const toAdd     = files.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm((f) => ({ ...f, photos: [...f.photos, ...toAdd] }));
    e.target.value = '';
  }

  function removePhoto(idx) {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate() {
    const e = {};

    if (!form.propertyType) e.propertyType = 'Select a property type';
    if (!form.bhk)          e.bhk = 'Select a BHK configuration';

    if (form.propertyType === 'apartment') {
      const sal = toSqft(form.saleableArea, form.saleableAreaUnit);
      const uds = toSqft(form.udsArea, form.udsAreaUnit);
      if (!form.saleableArea || sal <= 0)  e.saleableArea = 'Enter a valid area';
      if (!form.udsArea      || uds <= 0)  e.udsArea = 'Enter a valid UDS';
      if (uds > sal && sal > 0)            e.udsArea = 'UDS cannot exceed saleable area';
      if (!form.apartmentCount || Number(form.apartmentCount) <= 0)
        e.apartmentCount = 'Enter number of apartments';
    }

    if (form.propertyType === 'independent') {
      if (!form.landArea   || toSqft(form.landArea,   form.landAreaUnit)   <= 0)
        e.landArea   = 'Enter a valid land area';
      if (!form.builtUpArea || toSqft(form.builtUpArea, form.builtUpAreaUnit) <= 0)
        e.builtUpArea = 'Enter a valid built-up area';
    }

    if (form.ageYears === '' || Number(form.ageYears) < 0)
      e.ageYears = 'Enter property age (0 for new / under construction)';
    if (!form.carPark)      e.carPark = 'Select a car park option';
    if (!form.expectedPrice || priceNum <= 0) e.expectedPrice = 'Enter expected price';

    if (!form.sellerName.trim())                   e.sellerName = 'Enter your name';
    if (!/^\d{10}$/.test(form.mobile.trim()))      e.mobile = 'Enter a valid 10-digit number';
    if (!form.preferredContactTime.length)         e.contactTime = 'Select at least one time';
    if (!form.locality.trim())                     e.locality = 'Enter a locality or area';
    if (!form.city)                                e.city = 'Select a city';
    if (!form.declarationAgreed)                   e.declaration = 'Please confirm the declaration';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitError(null);

    try {
      const apt        = form.propertyType === 'apartment';
      const facilities = form.facilities.includes('Other') && form.facilitiesOther.trim()
        ? [...form.facilities.filter((f) => f !== 'Other'), `Other: ${form.facilitiesOther.trim()}`]
        : form.facilities;

      const docData = {
        uid: user?.uid ?? null,
        propertyType: form.propertyType,
        bhk: parseInt(form.bhk, 10),
        ...(apt
          ? {
              saleableAreaSqft: toSqft(form.saleableArea, form.saleableAreaUnit),
              udsSqft:          toSqft(form.udsArea, form.udsAreaUnit),
              apartmentCount:   Number(form.apartmentCount) || null,
            }
          : {
              landAreaSqft:    toSqft(form.landArea,    form.landAreaUnit),
              builtUpAreaSqft: toSqft(form.builtUpArea, form.builtUpAreaUnit),
            }),
        ageYears:    Number(form.ageYears),
        carPark:     form.carPark.toLowerCase(),
        facilities,
        expectedPriceLakh: priceNum / 100000,
        pricePerSqft,
        sellerName:  form.sellerName.trim(),
        mobile:      form.mobile.trim(),
        preferredContactTime: form.preferredContactTime,
        locality:    form.locality.trim(),
        city:        form.city,
        photoUrls:   [],
        declarationAgreed: true,
        status:      'pending',
        createdAt:   serverTimestamp(),
        updatedAt:   serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'propertyListings'), docData);

      // Upload photos only for authenticated users (Storage rules require auth)
      if (form.photos.length > 0 && user) {
        const photoUrls = await Promise.all(
          form.photos.map(async ({ file }) => {
            const path  = `propertyPhotos/${user.uid}/${docRef.id}/${file.name}`;
            const fRef  = storageRef(storage, path);
            await uploadBytes(fRef, file);
            return getDownloadURL(fRef);
          })
        );
        await updateDoc(doc(db, 'propertyListings', docRef.id), {
          photoUrls,
          updatedAt: serverTimestamp(),
        });
      }

      onSuccess(docRef.id);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>

      {/* ── Property type ── */}
      <div className="form-field">
        <label>Property type <span className="req">*</span></label>
        <div className="reg-type-grid">
          <button
            type="button"
            className={`reg-type-card${form.propertyType === 'apartment' ? ' selected' : ''}`}
            onClick={() => set('propertyType', 'apartment')}
          >
            <span className="reg-type-card-icon">🏢</span>
            <span className="reg-type-card-title">Apartment / Flat</span>
            <span className="reg-type-card-sub">Unit in a multi-storey building</span>
          </button>
          <button
            type="button"
            className={`reg-type-card${form.propertyType === 'independent' ? ' selected' : ''}`}
            onClick={() => set('propertyType', 'independent')}
          >
            <span className="reg-type-card-icon">🏡</span>
            <span className="reg-type-card-title">Independent House / Villa</span>
            <span className="reg-type-card-sub">Standalone house on its own plot</span>
          </button>
        </div>
        {errors.propertyType && <span className="form-error">{errors.propertyType}</span>}
      </div>

      {/* ── Apartment fields ── */}
      {form.propertyType === 'apartment' && (
        <>
          <SectionLabel>Property details</SectionLabel>

          <div className="form-field">
            <label>BHK Configuration <span className="req">*</span></label>
            <FormChipGroup options={BHK_OPTIONS} value={form.bhk} onChange={(v) => set('bhk', v)} />
            {errors.bhk && <span className="form-error">{errors.bhk}</span>}
          </div>

          <div className="form-field">
            <label>Total Saleable Area <span className="req">*</span></label>
            <div className="area-input-group">
              <input type="number" min="1" placeholder="e.g. 1200"
                value={form.saleableArea}
                onChange={(e) => set('saleableArea', e.target.value)} />
              <UnitToggle value={form.saleableAreaUnit} onChange={(v) => set('saleableAreaUnit', v)} />
            </div>
            {errors.saleableArea && <span className="form-error">{errors.saleableArea}</span>}
          </div>

          <div className="form-field">
            <label>
              <span className="tooltip-wrap">
                UDS — Undivided Share of Land <span className="req">*</span>
                <em className="tooltip-icon">?</em>
                <span className="tooltip-text">
                  The proportional share of the total land that belongs to your unit
                </span>
              </span>
            </label>
            <div className="area-input-group">
              <input type="number" min="1" placeholder="e.g. 180"
                value={form.udsArea}
                onChange={(e) => set('udsArea', e.target.value)} />
              <UnitToggle value={form.udsAreaUnit} onChange={(v) => set('udsAreaUnit', v)} />
            </div>
            {errors.udsArea && <span className="form-error">{errors.udsArea}</span>}
          </div>

          <div className="form-row two-col">
            <div className="form-field">
              <label>Age of Property (years) <span className="req">*</span></label>
              <input type="number" min="0" placeholder="0 = New"
                value={form.ageYears}
                onChange={(e) => set('ageYears', e.target.value)} />
              {errors.ageYears && <span className="form-error">{errors.ageYears}</span>}
            </div>
            <div className="form-field">
              <label>No. of Apartments in Project <span className="req">*</span></label>
              <input type="number" min="1" placeholder="e.g. 120"
                value={form.apartmentCount}
                onChange={(e) => set('apartmentCount', e.target.value)} />
              {errors.apartmentCount && <span className="form-error">{errors.apartmentCount}</span>}
            </div>
          </div>

          <div className="form-field">
            <label>Car Park <span className="req">*</span></label>
            <FormChipGroup options={CARPARK_OPTIONS} value={form.carPark} onChange={(v) => set('carPark', v)} />
            {errors.carPark && <span className="form-error">{errors.carPark}</span>}
          </div>

          <div className="form-field">
            <label>Common Facilities</label>
            <FormChipGroup options={APT_FACILITIES} value={form.facilities}
              onChange={(v) => set('facilities', v)} multiple />
            {form.facilities.includes('Other') && (
              <input type="text" style={{ marginTop: 8 }} placeholder="Describe other facilities…"
                value={form.facilitiesOther}
                onChange={(e) => set('facilitiesOther', e.target.value)} />
            )}
          </div>

          <div className="form-field">
            <label>Expected Price (₹) <span className="req">*</span></label>
            <div className="input-wrap has-prefix">
              <span className="prefix">₹</span>
              <input type="number" min="1" placeholder="e.g. 7500000"
                value={form.expectedPrice}
                onChange={(e) => set('expectedPrice', e.target.value)} />
            </div>
            {pricePerSqft > 0 && (
              <p className="price-psf">
                ≈ ₹{formatINR(pricePerSqft)} / sq ft · ₹{formatINR(priceNum / 100000)} lakh
              </p>
            )}
            {errors.expectedPrice && <span className="form-error">{errors.expectedPrice}</span>}
          </div>
        </>
      )}

      {/* ── Independent House fields ── */}
      {form.propertyType === 'independent' && (
        <>
          <SectionLabel>Property details</SectionLabel>

          <div className="form-field">
            <label>BHK Configuration <span className="req">*</span></label>
            <FormChipGroup options={BHK_OPTIONS} value={form.bhk} onChange={(v) => set('bhk', v)} />
            {errors.bhk && <span className="form-error">{errors.bhk}</span>}
          </div>

          <div className="form-field">
            <label>Total Land Area <span className="req">*</span></label>
            <div className="area-input-group">
              <input type="number" min="1" placeholder="e.g. 2400"
                value={form.landArea}
                onChange={(e) => set('landArea', e.target.value)} />
              <UnitToggle value={form.landAreaUnit} onChange={(v) => set('landAreaUnit', v)} />
            </div>
            {errors.landArea && <span className="form-error">{errors.landArea}</span>}
          </div>

          <div className="form-field">
            <label>Total Built-up Area <span className="req">*</span></label>
            <div className="area-input-group">
              <input type="number" min="1" placeholder="e.g. 1800"
                value={form.builtUpArea}
                onChange={(e) => set('builtUpArea', e.target.value)} />
              <UnitToggle value={form.builtUpAreaUnit} onChange={(v) => set('builtUpAreaUnit', v)} />
            </div>
            {errors.builtUpArea && <span className="form-error">{errors.builtUpArea}</span>}
          </div>

          <div className="form-field">
            <label>Age of Property (years) <span className="req">*</span></label>
            <input type="number" min="0" placeholder="0 = New"
              value={form.ageYears}
              onChange={(e) => set('ageYears', e.target.value)} />
            {errors.ageYears && <span className="form-error">{errors.ageYears}</span>}
          </div>

          <div className="form-field">
            <label>Car Park <span className="req">*</span></label>
            <FormChipGroup options={CARPARK_OPTIONS} value={form.carPark} onChange={(v) => set('carPark', v)} />
            {errors.carPark && <span className="form-error">{errors.carPark}</span>}
          </div>

          <div className="form-field">
            <label>Common Facilities</label>
            <FormChipGroup options={IND_FACILITIES} value={form.facilities}
              onChange={(v) => set('facilities', v)} multiple />
            {form.facilities.includes('Other') && (
              <input type="text" style={{ marginTop: 8 }} placeholder="Describe other facilities…"
                value={form.facilitiesOther}
                onChange={(e) => set('facilitiesOther', e.target.value)} />
            )}
          </div>

          <div className="form-field">
            <label>Expected Price (₹) <span className="req">*</span></label>
            <div className="input-wrap has-prefix">
              <span className="prefix">₹</span>
              <input type="number" min="1" placeholder="e.g. 12000000"
                value={form.expectedPrice}
                onChange={(e) => set('expectedPrice', e.target.value)} />
            </div>
            {pricePerSqft > 0 && (
              <p className="price-psf">
                ≈ ₹{formatINR(pricePerSqft)} / sq ft (built-up) · ₹{formatINR(priceNum / 100000)} lakh
              </p>
            )}
            {errors.expectedPrice && <span className="form-error">{errors.expectedPrice}</span>}
          </div>
        </>
      )}

      {/* ── Contact details — always shown ── */}
      <SectionLabel>Your contact details</SectionLabel>

      <div className="form-field">
        <label htmlFor="rf-name">Your name <span className="req">*</span></label>
        <input id="rf-name" type="text" placeholder="Full name" autoComplete="name"
          value={form.sellerName}
          onChange={(e) => set('sellerName', e.target.value)} />
        {errors.sellerName && <span className="form-error">{errors.sellerName}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="rf-mobile">Mobile number <span className="req">*</span></label>
        <div className="input-wrap has-prefix">
          <span className="prefix">+91</span>
          <input id="rf-mobile" type="tel" inputMode="numeric"
            placeholder="10-digit number" maxLength={10}
            value={form.mobile}
            onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
            style={{ paddingLeft: 44 }} />
        </div>
        {errors.mobile && <span className="form-error">{errors.mobile}</span>}
      </div>

      <div className="form-field">
        <label>Preferred contact time <span className="req">*</span></label>
        <FormChipGroup options={CONTACT_TIME_OPTIONS} value={form.preferredContactTime}
          onChange={(v) => set('preferredContactTime', v)} multiple />
        {errors.contactTime && <span className="form-error">{errors.contactTime}</span>}
      </div>

      <div className="form-row two-col">
        <div className="form-field">
          <label htmlFor="rf-locality">Locality / Area <span className="req">*</span></label>
          <input id="rf-locality" type="text" placeholder="e.g. Anna Nagar"
            value={form.locality}
            onChange={(e) => set('locality', e.target.value)} />
          {errors.locality && <span className="form-error">{errors.locality}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="rf-city">City <span className="req">*</span></label>
          <select id="rf-city" value={form.city} onChange={(e) => set('city', e.target.value)}>
            <option value="">Select city</option>
            {CITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <span className="form-error">{errors.city}</span>}
        </div>
      </div>

      <div className="form-field">
        <label>Property photos <span style={{ fontWeight: 400, color: 'var(--color-muted)' }}>(optional, up to {MAX_PHOTOS})</span></label>
        {form.photos.length < MAX_PHOTOS && (
          <>
            <input type="file" id="rf-photos" accept="image/*" multiple
              style={{ display: 'none' }} onChange={handlePhotoChange} />
            <label htmlFor="rf-photos" className="photo-upload-label">
              <span className="photo-upload-icon">📷</span>
              <span className="photo-upload-hint">
                Tap to add photos ({form.photos.length}/{MAX_PHOTOS})
              </span>
            </label>
          </>
        )}
        {form.photos.length > 0 && (
          <div className="photo-grid">
            {form.photos.map((p, i) => (
              <div key={i} className="photo-thumb">
                <img src={p.preview} alt={`Property photo ${i + 1}`} />
                <button type="button" className="photo-thumb-remove"
                  onClick={() => removePhoto(i)} aria-label="Remove photo">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="declaration-check">
        <input type="checkbox" id="rf-declaration" checked={form.declarationAgreed}
          onChange={(e) => set('declarationAgreed', e.target.checked)} />
        <label htmlFor="rf-declaration">
          I confirm I am the owner or authorised representative of this property and the
          information provided is accurate to the best of my knowledge.
        </label>
      </div>
      {errors.declaration && <span className="form-error">{errors.declaration}</span>}

      {submitError && (
        <div className="reg-error-banner">
          <span>{submitError}</span>
          <button type="button" className="btn btn-sm btn-danger"
            onClick={() => setSubmitError(null)}>
            Retry
          </button>
        </div>
      )}

      <button type="submit" className="form-submit-btn"
        disabled={saving || !form.declarationAgreed}>
        {saving ? 'Submitting…' : 'Submit listing enquiry'}
      </button>

      <p className="form-privacy">
        By submitting you agree to our privacy policy. We'll contact you within 24 hours.
      </p>
    </form>
  );
}
