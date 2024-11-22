import React from 'react';

function FileInput({ label, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <input
        type="file"
        onChange={(e) => onChange(e.target.files[0])}
        required
      />
    </div>
  );
}

export default FileInput;
