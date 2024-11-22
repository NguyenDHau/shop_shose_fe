import React from 'react';

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

export default TextArea;
