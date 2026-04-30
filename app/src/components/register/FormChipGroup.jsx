export default function FormChipGroup({ options, value, onChange, multiple = false }) {
  function toggle(opt) {
    if (multiple) {
      onChange(
        value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
      );
    } else {
      onChange(value === opt ? '' : opt);
    }
  }

  return (
    <div className="chip-group">
      {options.map((opt) => {
        const active = multiple ? value.includes(opt) : value === opt;
        return (
          <button
            key={opt}
            type="button"
            className={`chip${active ? ' chip-active' : ''}`}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
