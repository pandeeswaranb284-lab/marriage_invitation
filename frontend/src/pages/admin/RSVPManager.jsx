import React, { useEffect, useState } from 'react';
import { Download, CheckCircle, XCircle, Search, Users, Check, X, Trash2, Clock, Phone, Mail } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function RSVPManager() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const token = localStorage.getItem('admin_token');
  const apiBase = API_BASE;

  useEffect(() => {
    fetchRsvps();
  }, []);

  const fetchRsvps = async () => {
    try {
      const res = await fetch(`${apiBase}/weddings/admin/current/rsvps`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRsvps(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open(`${apiBase}/weddings/admin/current/export-rsvps`, '_blank');
  };

  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch = r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.message && r.message.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filter === 'attending') return matchesSearch && r.attending;
    if (filter === 'declined') return matchesSearch && !r.attending;
    return matchesSearch;
  });

  const attendingCount = rsvps.filter((r) => r.attending).reduce((sum, r) => sum + (r.guest_count || 1), 0);
  const totalAttendingResponses = rsvps.filter((r) => r.attending).length;
  const totalDeclinedResponses = rsvps.filter((r) => !r.attending).length;

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading RSVPs...</div>;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-500/20 pb-4">
        <div>
          <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
            Guest List
          </span>
          <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
            RSVP RESPONSES
          </h2>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-wider uppercase hover:brightness-110 shadow-gold-glow flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Stats Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-navy-950/80 border border-gold-500/30">
          <span className="text-[10px] font-cinzel text-gold-400 uppercase">Total Headcount</span>
          <p className="font-serif text-2xl font-bold text-emerald-400 mt-1">
            {attendingCount} Guests
          </p>
          <span className="text-xs text-gold-200/70">Attending celebrations</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-950/80 border border-gold-500/30">
          <span className="text-[10px] font-cinzel text-gold-400 uppercase">Attending Responses</span>
          <p className="font-serif text-2xl font-bold text-white mt-1">
            {totalAttendingResponses}
          </p>
          <span className="text-xs text-gold-200/70">Confirmed RSVP cards</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-950/80 border border-gold-500/30">
          <span className="text-[10px] font-cinzel text-gold-400 uppercase">Declined Responses</span>
          <p className="font-serif text-2xl font-bold text-red-300 mt-1">
            {totalDeclinedResponses}
          </p>
          <span className="text-xs text-gold-200/70">Unable to attend</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by guest name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-navy-950 border border-gold-500/30 text-white placeholder-gold-500/30 text-xs focus:outline-none focus:border-gold-400 font-sans"
          />
          <Search className="w-4 h-4 text-gold-400/50 absolute left-3 top-2.5" />
        </div>

        <div className="flex space-x-2">
          {['all', 'attending', 'declined'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'bg-navy-950 text-gold-300/80 border border-gold-500/30 hover:border-gold-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="rounded-xl border border-gold-500/30 bg-navy-950/80 overflow-x-auto shadow-md">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-navy-900 border-b border-gold-500/20 font-cinzel text-gold-400 tracking-wider">
            <tr>
              <th className="p-3">Guest Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Message</th>
              <th className="p-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/10 text-gold-100/90">
            {filteredRsvps.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gold-300/60 font-serif italic">
                  No RSVP records found.
                </td>
              </tr>
            ) : (
              filteredRsvps.map((r) => (
                <tr key={r.id} className="hover:bg-navy-900/50 transition-colors">
                  <td className="p-3 font-semibold text-white">{r.guest_name}</td>
                  <td className="p-3">
                    {r.attending ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        <span>Attending</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                        <XCircle className="w-3 h-3" />
                        <span>Declined</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3">{r.attending ? `${r.guest_count} Person(s)` : '-'}</td>
                  <td className="p-3 text-[11px] text-gold-300/80 font-mono">
                    {r.phone || r.email || '-'}
                  </td>
                  <td className="p-3 max-w-xs truncate italic text-gold-200/80">
                    {r.message || '-'}
                  </td>
                  <td className="p-3 text-[11px] text-gold-400/60">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
