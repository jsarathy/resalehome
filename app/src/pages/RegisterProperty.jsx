import React, { useReducer, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { createPropertyListing, updatePropertyListing } from '../lib/firestore';
import { useAuth } from '../hooks/useAuth';
import StepPropertyType       from '../components/register/StepPropertyType';
import StepApartmentDetails   from '../components/register/StepApartmentDetails';
import StepIndependentDetails from '../components/register/StepIndependentDetails';
import StepContact            from '../components/register/StepContact';

// ── Reducer ──────────────────────────────────────────────────────────────────

const initialState = {
  propertyType: '',
  bhk: '',
  saleableArea: '',    saleableAreaUnit: 'sqft',
  udsArea: '',         udsAreaUnit: 'sqft',
  landArea: '',        landAreaUnit: 'sqft',
  builtUpArea: '',     builtUpAreaUnit: 'sqft',
  ageYears: '',
  carPark: '',
  apartmentCount: '',
  facilities: [],
  facilitiesOther: '',
  expectedPrice: '',
  sellerName: '',
  mobile: '',
  preferredContactTime: [],
  locality: '',
  city: '',
  photos: [],
  declarationAgreed: false,
};

function reducer(state, { field, value }) {
  return { ...state, [field]: value };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSqft(val, unit) {
  const n = Number(val) || 0;
  return unit === 'sqm' ? Math.round(n * 10.764) : n;
}

function buildDocData(data, uid) {
  const isApt = data.propertyType === 'apartment';
  const saleableSqft = toSqft(data.saleableArea, data.saleableAreaUnit);
  const builtUpSqft  = toSqft(data.builtUpArea, data.builtUpAreaUnit);
  const refArea = isApt ? saleableSqft : builtUpSqft;
  const price   = Number(data.expectedPrice) || 0;

  const facilities = data.facilities.includes('Other') && data.facilitiesOther.trim()
    ? [...data.facilities.filter((f) => f !== 'Other'), `Other: ${data.facilitiesOther.trim()}`]
    : data.facilities;

  return {
    uid,
    propertyType: data.propertyType,
    bhk: parseInt(data.bhk, 10),
    ...(isApt
      ? {
          saleableAreaSqft: saleableSqft,
          udsSqft: toSqft(data.udsArea, data.udsAreaUnit),
          apartmentCount: data.apartmentCount ? Number(data.apartmentCount) : null,
        }
      : {
          landAreaSqft:    toSqft(data.landArea, data.landAreaUnit),
          builtUpAreaSqft: builtUpSqft,
        }),
    ageYears:    Number(data.ageYears),
    carPark:     data.carPark.toLowerCase(),
    facilities,
    expectedPriceLakh: price / 100000,
    pricePerSqft:      refArea > 0 ? Math.round(price / refArea) : 0,
    sellerName:  data.sellerName.trim(),
    mobile:      data.mobile.trim(),
    preferredContactTime: data.preferredContactTime,
    locality:    data.locality.trim(),
    city:        data.city,
    declarationAgreed: true,
  };
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ step }) {
  const labels = ['Property Type', 'Details', 'Contact'];
  return (
    <div className="reg-progress">
      {labels.map((label, i) => {
        const s = i + 1;
        const cls = step === s ? 'active' : step > s ? 'done' : '';
        return (
          <React.Fragment key={s}>
            <div className={`reg-progress-step${cls ? ` ${cls}` : ''}`}>
              <div className="reg-progress-dot" />
              <span>{label}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`reg-progress-line${step > s ? ' done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RegisterProperty() {
  const { user } = useAuth();
  const [step, setStep]         = useState(1);
  const [state, dispatch]       = useReducer(reducer, initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [listingId, setListingId]   = useState(null);

  useEffect(() => {
    if (user?.displayName) {
      dispatch({ field: 'sellerName', value: user.displayName });
    }
  }, [user]);

  function update(field, value) {
    dispatch({ field, value });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const docData = buildDocData(state, user.uid);

      // Create the Firestore document first to obtain a listing ID
      const id = await createPropertyListing({ ...docData, photoUrls: [] });

      // Upload photos using the listing ID as the storage path prefix
      if (state.photos.length > 0) {
        const photoUrls = await Promise.all(
          state.photos.map(async ({ file }) => {
            const path = `propertyPhotos/${user.uid}/${id}/${file.name}`;
            const fileRef = storageRef(storage, path);
            await uploadBytes(fileRef, file);
            return getDownloadURL(fileRef);
          })
        );
        await updatePropertyListing(id, { photoUrls });
      }

      setListingId(id);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────

  if (listingId) {
    return (
      <div className="reg-page">
        <div className="reg-card">
          <div className="reg-success">
            <span className="reg-success-icon">✅</span>
            <h2 className="reg-success-title">Listing submitted!</h2>
            <p className="reg-success-sub">
              We'll review your listing and get in touch within 24 hours.
              Our relationship manager will verify the details and activate your listing.
            </p>
            <span className="reg-success-id">Ref: {listingId}</span>
            <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Steps ──────────────────────────────────────────────────────────────────

  return (
    <div className="reg-page">
      <div className="reg-card">
        <ProgressBar step={step} />

        {step === 1 && (
          <StepPropertyType
            data={state}
            update={update}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && state.propertyType === 'apartment' && (
          <StepApartmentDetails
            data={state}
            update={update}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 2 && state.propertyType === 'independent' && (
          <StepIndependentDetails
            data={state}
            update={update}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepContact
            data={state}
            update={update}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitError={submitError}
            onRetry={() => setSubmitError(null)}
          />
        )}
      </div>
    </div>
  );
}
