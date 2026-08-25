import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

/**
 * Reusable signature block for document pages.
 * editMode: shows upload button + editable name/jabatan fields.
 * signatories: [{ role, sub, name, jabatan, signatureUrl }]
 * onChange: (index, field, value) => void
 */
export default function SignatureBlock({ signatories, onChange, editMode, style = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${signatories.length}, 1fr)`, gap: 32, fontSize: 11, ...style }}>
      {signatories.map((s, i) => (
        <SignatureSlot key={i} data={s} editMode={editMode} onChange={(field, val) => onChange(i, field, val)} />
      ))}
    </div>
  );
}

function SignatureSlot({ data, editMode, onChange }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange('signatureUrl', ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Role label */}
      <p style={{ fontWeight: 600, marginBottom: 2, fontSize: 11 }}>{data.role}</p>
      {data.sub && <p style={{ color: '#888', fontSize: 10, marginBottom: 4 }}>{data.sub}</p>}

      {/* Signature area */}
      <div style={{ position: 'relative', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {data.signatureUrl
          ? <>
              <img src={data.signatureUrl} alt="TTD" style={{ maxHeight: 68, maxWidth: '100%', objectFit: 'contain' }} />
              {editMode && (
                <button onClick={() => onChange('signatureUrl', null)} title="Hapus tanda tangan"
                  style={{ position: 'absolute', top: 0, right: 0, background: '#fee2e2', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <X size={11} />
                </button>
              )}
            </>
          : editMode
            ? <button onClick={() => fileRef.current.click()}
                style={{ background: '#eff6ff', border: '1.5px dashed #93c5fd', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#2563eb', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Upload size={13} /> Upload TTD
              </button>
            : <div style={{ height: 48 }} />
        }
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      {/* Name & Jabatan */}
      <div style={{ borderTop: '1px solid #888', paddingTop: 4, marginTop: 2 }}>
        {editMode
          ? <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
              <input value={data.name} onChange={e => onChange('name', e.target.value)} placeholder="Nama"
                style={{ border: '1px solid #93c5fd', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700, textAlign: 'center', width: '90%' }} />
              <input value={data.jabatan} onChange={e => onChange('jabatan', e.target.value)} placeholder="Jabatan"
                style={{ border: '1px solid #93c5fd', borderRadius: 4, padding: '2px 8px', fontSize: 10, textAlign: 'center', width: '90%', color: '#555' }} />
            </div>
          : <>
              <p style={{ fontWeight: 700, marginBottom: 2, fontSize: 11 }}>{data.name}</p>
              <p style={{ fontSize: 10, color: '#666' }}>{data.jabatan}</p>
            </>
        }
      </div>
    </div>
  );
}