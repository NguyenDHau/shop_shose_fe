import React from 'react';

function NumberInput({ label, value, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

export default NumberInput;
