import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

/**
 * Reusable inline editable field for document pages.
 * Shows content normally; when editMode=true, clicking makes it editable.
 */
export default function EditableField({ value, onChange, multiline = false, style = {}, editMode, placeholder = '—klik untuk isi—' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  if (!editMode) return <span style={style}>{value}</span>;

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 3, width: '100%' }}>
        {multiline
          ? <textarea value={draft} onChange={e => setDraft(e.target.value)} autoFocus
              style={{ flex: 1, fontSize: 'inherit', fontFamily: 'inherit', lineHeight: 1.5, border: '1.5px solid #3b82f6', borderRadius: 4, padding: '2px 6px', resize: 'vertical', minHeight: 52, background: '#eff6ff', ...style }} />
          : <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
              style={{ flex: 1, fontSize: 'inherit', fontFamily: 'inherit', border: '1.5px solid #3b82f6', borderRadius: 4, padding: '2px 6px', background: '#eff6ff', ...style }} />
        }
        <button onClick={save} style={{ background: '#22c55e', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer', color: '#fff', flexShrink: 0, marginTop: 2 }}><Check size={11} /></button>
        <button onClick={cancel} style={{ background: '#ef4444', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer', color: '#fff', flexShrink: 0, marginTop: 2 }}><X size={11} /></button>
      </span>
    );
  }

  return (
    <span onClick={() => { setDraft(value); setEditing(true); }} title="Klik untuk edit"
      style={{ cursor: 'pointer', borderBottom: '1px dashed #93c5fd', display: 'inline-block', minWidth: 30, ...style }}>
      {value || <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: '0.9em' }}>{placeholder}</span>}
    </span>
  );
}