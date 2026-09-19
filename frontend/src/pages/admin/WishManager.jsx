import React, { useEffect, useState } from 'react';
import { Check, X, Trash2, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function WishManager() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const token = localStorage.getItem('admin_token');
  const apiBase = API_BASE;

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const res = await fetch(`${apiBase}/weddings/admin/current/wishes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWishes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (wishId, newStatus) => {
    try {
      const res = await fetch(`${apiBase}/weddings/admin/wishes/${wishId}/status?status_val=${newStatus}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotice(`Wish marked as ${newStatus}`);
        fetchWishes();
      }
    } catch (err) {
      setNotice('Failed to update status');
    }
  };

  const handleDelete = async (wishId) => {
    if (!confirm('Are you sure you want to delete this wish?')) return;
    try {
      const res = await fetch(`${apiBase}/weddings/admin/wishes/${wishId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotice('Wish deleted');
        fetchWishes();
      }
    } catch (err) {
      setNotice('Failed to delete wish');
    }
  };

  const filteredWishes = wishes.filter((w) => {
    if (filter === 'pending') return w.status === 'pending';
    if (filter === 'approved') return w.status === 'approved';
    if (filter === 'rejected') return w.status === 'rejected';
    return true;
  });

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading wishes...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gold-500/20 pb-4">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Moderation
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
          BLESSINGS & WISHES MANAGER
        </h2>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-cinzel uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-gold-500 text-navy-950 font-bold'
                : 'bg-navy-950 text-gold-300/80 border border-gold-500/30 hover:border-gold-400'
            }`}
          >
            {f} ({wishes.filter(w => f === 'all' ? true : w.status === f).length})
          </button>
        ))}
      </div>

      {/* Wishes Cards */}
      <div className="space-y-4 font-sans">
        {filteredWishes.length === 0 ? (
          <div className="p-8 rounded-xl bg-navy-950/80 border border-gold-500/20 text-center text-gold-300/60 font-serif italic">
            No wishes found in this category.
          </div>
        ) : (
          filteredWishes.map((w) => (
            <div
              key={w.id}
              className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="font-cinzel font-bold text-xs text-gold-300">
                    {w.guest_name}
                  </span>
                  <span className={`text-[9px] font-cinzel uppercase px-2 py-0.5 rounded-full border ${
                    w.status === 'approved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : w.status === 'rejected'
                      ? 'bg-red-950 text-red-300 border-red-500/40'
                      : 'bg-amber-950 text-amber-300 border-amber-500/40'
                  }`}>
                    {w.status || 'approved'}
                  </span>
                </div>
                <p className="font-serif italic text-sm text-white leading-relaxed">
                  "{w.message}"
                </p>
                <span className="text-[10px] text-gold-400/60 block">
                  {new Date(w.created_at).toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {w.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(w.id, 'approved')}
                    className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs flex items-center space-x-1"
                    title="Approve Wish"
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Approve</span>
                  </button>
                )}

                {w.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(w.id, 'rejected')}
                    className="p-2 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 hover:bg-amber-900 text-xs flex items-center space-x-1"
                    title="Reject Wish"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Reject</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(w.id)}
                  className="p-2 rounded-lg bg-red-950 border border-red-500/40 text-red-300 hover:bg-red-900 text-xs"
                  title="Delete Wish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
