import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const emptyForm = {
  id: '',
  time: '',
  departure: '',
  arrival: ''
};

const AddFlightModal = ({ apiBase, refreshToken, onUnauthorized, onCreated }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const idRef = useRef(null);

  const openModal = () => {
    setError('');
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const closeModal = useCallback(() => {
    if (saving) return;
    setOpen(false);
  }, [saving]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeModal, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => idRef.current?.focus?.(), 0);
    return () => clearTimeout(t);
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      id: String(form.id || '').trim(),
      time: String(form.time || '').trim(),
      departure: String(form.departure || '').trim(),
      arrival: String(form.arrival || '').trim()
    };

    if (!payload.id || !payload.time || !payload.departure || !payload.arrival) {
      setError('All fields are required.');
      return;
    }

    setSaving(true);
    try {
      const base = String(apiBase || '').replace(/\/+$/, '');
      const url = `${base}/api/details`;

      const token = localStorage.getItem('accessToken');
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

   
      if (response.status === 401) {
        const refreshed = await refreshToken?.();
        if (refreshed) {

          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(payload)
          });
        } else {
          onUnauthorized?.();
          return;
        }
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to add flight');

      if (data?.result) onCreated?.(data.result);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }

    
  };

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        className="h-11 rounded-xl px-5 shadow-lg shadow-slate-900/15"
      >
        Add Flight
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full max-w-lg rounded-[1.75rem] border border-slate-800 bg-slate-950/98 shadow-2xl shadow-black/80 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Add Flight</h2>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-slate-400 hover:text-slate-200 disabled:opacity-50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="px-6 py-5">
              {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300">Flight ID</span>
                  <input
                    ref={idRef}
                    type="text"
                    required
                    value={form.id}
                    onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
                    className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
          
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300">Time</span>
                  <input
                    type="text"
                    required
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
            
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300">From</span>
                  <input
                    type="text"
                    required
                    value={form.departure}
                    onChange={(e) => setForm((p) => ({ ...p, departure: e.target.value }))}
                    className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
               
                  />
                </label>

                <label className="flex flex-col gap-1 sm:col-span-1">
                  <span className="text-sm text-slate-300">To</span>
                  <input
                    type="text"
                    required
                    value={form.arrival}
                    onChange={(e) => setForm((p) => ({ ...p, arrival: e.target.value }))}
                    className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
                
                  />
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  variant="outline"
                  className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl"
                >
                  {saving ? 'Saving...' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFlightModal;
