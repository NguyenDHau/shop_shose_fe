import React from 'react';

function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

export default TextInput;
