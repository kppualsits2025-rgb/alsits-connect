import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Check, X } from 'lucide-react';

/**
 * Dropdown dengan:
 * - Opsi "Lainnya" → input untuk tambah pilihan baru
 * - Tombol edit (✏️) → panel kelola daftar (rename / hapus per item)
 *
 * Props:
 *   options      — string[]  daftar opsi awal (statis, tidak diubah)
 *   value        — string    nilai terpilih saat ini
 *   onChange     — fn(value) callback saat nilai berubah
 *   placeholder  — string    teks placeholder
 */
export default function SelectWithCustom({ options, value, onChange, placeholder = '-- Pilih --', isAdmin = false }) {
  const LAINNYA = 'Lainnya';
  const baseOptions = options.filter(o => o !== LAINNYA);

  // Opsi yang bisa dikelola (awal + extra). "Lainnya" selalu di akhir, tidak masuk sini.
  const [managedOptions, setManagedOptions] = useState([...baseOptions]);

  // State tambah baru
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // State edit daftar
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null); // index item yang sedang di-rename
  const [editingVal, setEditingVal] = useState('');

  const allOptions = [...managedOptions, LAINNYA];

  // ── Pilih dari dropdown ──────────────────────────────────────
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === LAINNYA) {
      setShowCustomInput(true);
      setCustomValue('');
    } else {
      setShowCustomInput(false);
      onChange(val);
    }
  };

  // ── Tambah opsi baru ─────────────────────────────────────────
  const handleCustomConfirm = () => {
    const trimmed = customValue.trim();
    if (!trimmed) return;
    if (!managedOptions.includes(trimmed)) {
      setManagedOptions(prev => [...prev, trimmed]);
    }
    onChange(trimmed);
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleCustomConfirm(); }
    if (e.key === 'Escape') setShowCustomInput(false);
  };

  // ── Edit panel: hapus item ───────────────────────────────────
  const handleDelete = (idx) => {
    const deleted = managedOptions[idx];
    const next = managedOptions.filter((_, i) => i !== idx);
    setManagedOptions(next);
    // Jika nilai terpilih dihapus, reset
    if (value === deleted) onChange('');
  };

  // ── Edit panel: rename item ──────────────────────────────────
  const startRename = (idx) => {
    setEditingIdx(idx);
    setEditingVal(managedOptions[idx]);
  };

  const confirmRename = () => {
    const trimmed = editingVal.trim();
    if (!trimmed || managedOptions.indexOf(trimmed) !== -1 && managedOptions.indexOf(trimmed) !== editingIdx) {
      setEditingIdx(null);
      return;
    }
    const oldVal = managedOptions[editingIdx];
    const next = [...managedOptions];
    next[editingIdx] = trimmed;
    setManagedOptions(next);
    if (value === oldVal) onChange(trimmed);
    setEditingIdx(null);
  };

  const handleRenameKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmRename(); }
    if (e.key === 'Escape') setEditingIdx(null);
  };

  return (
    <div className="space-y-2">
      {/* ── Baris dropdown + tombol edit ── */}
      <div className="flex gap-1.5 items-center">
        <select
          value={showCustomInput ? LAINNYA : (value || '')}
          onChange={handleChange}
          className="flex-1 h-9 px-3 rounded-md border text-sm bg-background border-input"
        >
          <option value="">{placeholder}</option>
          {allOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        {isAdmin && (
          <button
            type="button"
            title="Kelola daftar pilihan (Admin)"
            onClick={() => { setShowEditPanel(p => !p); setEditingIdx(null); }}
            className={`h-9 w-9 flex items-center justify-center rounded-md border text-xs transition-colors shrink-0
              ${showEditPanel
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-input bg-background text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Input tambah pilihan baru ── */}
      {showCustomInput && (
        <div className="flex gap-2 items-center">
          <Input
            autoFocus
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="Ketik pilihan baru, lalu Enter..."
            className="flex-1 h-9 text-sm"
          />
          <button
            type="button"
            onClick={handleCustomConfirm}
            disabled={!customValue.trim()}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground disabled:opacity-40 shrink-0"
          >
            Tambah
          </button>
        </div>
      )}

      {/* ── Panel kelola daftar ── */}
      {showEditPanel && (
        <div className="rounded-lg border border-border bg-secondary/40 p-3 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Kelola daftar pilihan — rename atau hapus
          </p>
          {managedOptions.length === 0 && (
            <p className="text-xs text-muted-foreground italic">Belum ada pilihan tersimpan.</p>
          )}
          {managedOptions.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-1.5 group">
              {editingIdx === idx ? (
                <>
                  <Input
                    autoFocus
                    value={editingVal}
                    onChange={e => setEditingVal(e.target.value)}
                    onKeyDown={handleRenameKey}
                    className="flex-1 h-7 text-xs px-2"
                  />
                  <button type="button" onClick={confirmRename}
                    className="h-7 w-7 flex items-center justify-center rounded text-emerald-400 hover:bg-emerald-500/10">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setEditingIdx(null)}
                    className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:bg-secondary">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <span className={`flex-1 text-xs px-2 py-1 rounded truncate ${value === opt ? 'text-primary font-semibold' : 'text-foreground'}`}>
                    {opt}
                    {value === opt && <span className="ml-1 text-[10px] opacity-60">(terpilih)</span>}
                  </span>
                  <button type="button" onClick={() => startRename(idx)}
                    className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button type="button" onClick={() => handleDelete(idx)}
                    className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground pt-1 border-t border-border mt-2">
            Hover item untuk muncul tombol rename / hapus
          </p>
        </div>
      )}
    </div>
  );
}