import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

/**
 * Inline signature upload area for document pages.
 * editMode: shows upload button.
 * value: base64 or URL of signature image.
 * onChange: (base64OrNull) => void
 */
export default function SignatureUpload({ value, onChange, editMode }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!value) {
    // No signature yet
    return (
      <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {editMode ? (
          <>
            <button onClick={() => fileRef.current.click()}
              style={{ background: '#eff6ff', border: '1.5px dashed #93c5fd', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: '#2563eb', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Upload size={13} /> Upload Tanda Tangan
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </>
        ) : (
          <div style={{ height: 60 }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <img src={value} alt="Tanda Tangan" style={{ maxHeight: 58, maxWidth: '100%', objectFit: 'contain' }} />
      {editMode && (
        <button onClick={() => onChange(null)} title="Hapus tanda tangan"
          style={{ position: 'absolute', top: 0, right: 0, background: '#fee2e2', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <X size={11} />
        </button>
      )}
    </div>
  );
}