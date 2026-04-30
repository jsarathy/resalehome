import { useState } from 'react';
import FormChipGroup from './FormChipGroup';

const BHK_OPTIONS    = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];
const CARPARK_OPTIONS = ['None', 'Open', 'Covered', 'Both'];
const FACILITY_OPTIONS = [
  'Clubhouse', 'Community Hall', 'Swimming Pool', 'Gym',
  "Children's Play Area", 'Power Backup', 'Security / CCTV', 'Other',
];

function UnitToggle({ value, onChange }) {
  return (
    <div className="unit-toggle">
      <button
        type="button"
        className={value === 'sqft' ? 'active' : ''}
        onClick={() => onChange('sqft')}
      >
        sq ft
      </button>
      <button
        type="button"
        className={value === 'sqm' ? 'active' : ''}
        onClick={() => onChange('sqm')}
      >
        sq m
      </button>
    </div>
  );
}

function formatINR(n) {
  return new Intl.NumberFormat('en-IN').format(Math.round(n));
}

export default function StepIndependentDetails({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const builtUpNum  = Number(data.builtUpArea) || 0;
  const builtUpSqft = data.builtUpAreaUnit === 'sqm' ? builtUpNum * 10.764 : builtUpNum;
  const priceNum    = Number(data.expectedPrice) || 0;
  const pricePerSqft = builtUpSqft > 0 ? Math.round(priceNum / builtUpSqft) : 0;

  function validate() {
    const e = {};
    if (!data.bhk)                       e.bhk = 'Select a BHK configuration';
    if (!data.landArea || Number(data.landArea) <= 0) e.landArea = 'Enter a valid land area';
    if (!data.builtUpArea || builtUpNum <= 0)         e.builtUpArea = 'Enter a valid built-up area';
    if (data.ageYears === '' || Number(data.ageYears) < 0) e.ageYears = 'Enter property age (0 for new)';
    if (!data.carPark)                   e.carPark = 'Select a car park option';
    if (!data.expectedPrice || priceNum <= 0) e.expectedPrice = 'Enter expected price';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div>
      <p className="reg-step-label">Step 2 of 3</p>
      <h2 className="reg-step-heading">House / Villa details</h2>

      <div className="form-grid">
        {/* BHK */}
        <div className="form-field">
          <label>BHK Configuration <span className="req">*</span></label>
          <FormChipGroup
            options={BHK_OPTIONS}
            value={data.bhk}
            onChange={(v) => update('bhk', v)}
          />
          {errors.bhk && <span className="form-error">{errors.bhk}</span>}
        </div>

        {/* Land Area */}
        <div className="form-field">
          <label>Total Land Area <span className="req">*</span></label>
          <div className="area-input-group">
            <input
              type="number"
              min="1"
              placeholder="e.g. 2400"
              value={data.landArea}
              onChange={(e) => update('landArea', e.target.value)}
            />
            <UnitToggle value={data.landAreaUnit} onChange={(v) => update('landAreaUnit', v)} />
          </div>
          {errors.landArea && <span className="form-error">{errors.landArea}</span>}
        </div>

        {/* Built-up Area */}
        <div className="form-field">
          <label>Total Built-up Area <span className="req">*</span></label>
          <div className="area-input-group">
            <input
              type="number"
              min="1"
              placeholder="e.g. 1800"
              value={data.builtUpArea}
              onChange={(e) => update('builtUpArea', e.target.value)}
            />
            <UnitToggle value={data.builtUpAreaUnit} onChange={(v) => update('builtUpAreaUnit', v)} />
          </div>
          {errors.builtUpArea && <span className="form-error">{errors.builtUpArea}</span>}
        </div>

        {/* Age */}
        <div className="form-field">
          <label>Age of Property (years) <span className="req">*</span></label>
          <input
            type="number"
            min="0"
            placeholder="0 = New / Under construction"
            value={data.ageYears}
            onChange={(e) => update('ageYears', e.target.value)}
          />
          {errors.ageYears && <span className="form-error">{errors.ageYears}</span>}
        </div>

        {/* Car Park */}
        <div className="form-field">
          <label>Car Park <span className="req">*</span></label>
          <FormChipGroup
            options={CARPARK_OPTIONS}
            value={data.carPark}
            onChange={(v) => update('carPark', v)}
          />
          {errors.carPark && <span className="form-error">{errors.carPark}</span>}
        </div>

        {/* Facilities */}
        <div className="form-field">
          <label>Common Facilities</label>
          <FormChipGroup
            options={FACILITY_OPTIONS}
            value={data.facilities}
            onChange={(v) => update('facilities', v)}
            multiple
          />
          {data.facilities.includes('Other') && (
            <input
              type="text"
              style={{ marginTop: 8 }}
              placeholder="Describe other facilities…"
              value={data.facilitiesOther}
              onChange={(e) => update('facilitiesOther', e.target.value)}
            />
          )}
        </div>

        {/* Expected Price */}
        <div className="form-field">
          <label>Expected Price (₹) <span className="req">*</span></label>
          <div className="input-wrap has-prefix">
            <span className="prefix">₹</span>
            <input
              type="number"
              min="1"
              placeholder="e.g. 12000000"
              value={data.expectedPrice}
              onChange={(e) => update('expectedPrice', e.target.value)}
            />
          </div>
          {pricePerSqft > 0 && (
            <p className="price-psf">
              ≈ ₹{formatINR(pricePerSqft)} per sq ft (built-up) · ₹{formatINR(priceNum / 100000)} lakh
            </p>
          )}
          {errors.expectedPrice && <span className="form-error">{errors.expectedPrice}</span>}
        </div>
      </div>

      <div className="reg-nav">
        <button type="button" className="reg-nav-back" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext}>
          Continue →
        </button>
      </div>
    </div>
  );
}
