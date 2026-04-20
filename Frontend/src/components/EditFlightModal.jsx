import React, { useCallback, useEffect, useRef, useState } from 'react';

const emptyForm = {
  id: '',
  time: '',
  departure: '',
  arrival: ''
};

const EditFlightModal = ({ apiBase, refreshToken, onUnauthorized, onUpdated, flight, isOpen, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const idRef = useRef(null);

  useEffect(() => {
    if (flight && isOpen) {
      setForm({
        id: flight.id || '',
        time: flight.time || '',
        departure: flight.departure || '',
        arrival: flight.arrival || ''
      });
      setError('');
    }
  }, [flight, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => idRef.current?.focus?.(), 0);
    return () => clearTimeout(t);
  }, [isOpen]);

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
      const url = `${base}/api/details/${flight._id}`;

      const token = localStorage.getItem('accessToken');
      let response = await fetch(url, {
        method: 'PATCH',
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
            method: 'PATCH',
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
      if (!response.ok) throw new Error(data.message || 'Failed to update flight');

      if (data?.result) onUpdated?.(data.result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Edit Flight</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5">
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Flight ID</span>
              <input
                ref={idRef}
                type="text"
                required
                value={form.id}
                onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
             
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Time</span>
              <input
                type="text"
                required
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
   
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">From</span>
              <input
                type="text"
                required
                value={form.departure}
                onChange={(e) => setForm((p) => ({ ...p, departure: e.target.value }))}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
             
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-1">
              <span className="text-sm text-gray-700">To</span>
              <input
                type="text"
                required
                value={form.arrival}
                onChange={(e) => setForm((p) => ({ ...p, arrival: e.target.value }))}
                className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFlightModal;
