export default function StepPropertyType({ data, update, onNext }) {
  function select(type) {
    update('propertyType', type);
    onNext();
  }

  return (
    <div>
      <p className="reg-step-label">Step 1 of 3</p>
      <h2 className="reg-step-heading">What type of property are you listing?</h2>

      <div className="reg-type-grid">
        <button
          type="button"
          className={`reg-type-card${data.propertyType === 'apartment' ? ' selected' : ''}`}
          onClick={() => select('apartment')}
        >
          <span className="reg-type-card-icon">🏢</span>
          <span className="reg-type-card-title">Apartment / Flat</span>
          <span className="reg-type-card-sub">
            Unit in a multi-storey building or gated community
          </span>
        </button>

        <button
          type="button"
          className={`reg-type-card${data.propertyType === 'independent' ? ' selected' : ''}`}
          onClick={() => select('independent')}
        >
          <span className="reg-type-card-icon">🏡</span>
          <span className="reg-type-card-title">Independent House / Villa</span>
          <span className="reg-type-card-sub">
            Standalone house or villa on its own plot
          </span>
        </button>
      </div>
    </div>
  );
}
