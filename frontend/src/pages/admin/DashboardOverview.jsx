import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Image, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function DashboardOverview() {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token');
  const apiBase = API_BASE;

  useEffect(() => {
    fetchWedding();
  }, []);

  const fetchWedding = async () => {
    try {
      const res = await fetch(`${apiBase}/weddings/admin/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWedding(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gold-300 font-cinzel">Loading dashboard overview...</div>;
  }

  const wishes = wedding?.guest_wishes || [];
  const publicWishes  = wishes.filter(w => w.is_approved && w.visibility !== 'private');
  const privateWishes = wishes.filter(w => w.visibility === 'private');
  const galleryCount  = wedding?.gallery_images?.length || 0;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-950 border border-gold-500/30 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
            Wedding Overview
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
            {wedding?.groom_name} & {wedding?.bride_name}
          </h2>
          <p className="font-sans text-xs text-gold-200/80 mt-1">
            Public link:{' '}
            <a
              href={`/invite/${wedding?.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-gold-400 underline underline-offset-2"
            >
              /invite/{wedding?.slug}
            </a>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={`/invite/${wedding?.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 font-cinzel font-bold text-xs tracking-wider uppercase shadow-gold-glow flex items-center space-x-2"
          >
            <span>Preview Card</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-cinzel tracking-wider text-gold-400 uppercase block">
              Total Blessings
            </span>
            <span className="font-serif text-3xl font-bold text-white mt-1 block">
              {wishes.length}
            </span>
            <span className="text-xs text-gold-300/70">Messages received</span>
          </div>
          <MessageSquare className="w-8 h-8 text-gold-400/40" />
        </div>

        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-cinzel tracking-wider text-gold-400 uppercase block">
              Public Blessings
            </span>
            <span className="font-serif text-3xl font-bold text-emerald-400 mt-1 block">
              {publicWishes.length}
            </span>
            <span className="text-xs text-gold-300/70">Shown on website</span>
          </div>
          <Heart className="w-8 h-8 text-emerald-400/40" />
        </div>

        <div className="p-5 rounded-xl bg-navy-950/80 border border-gold-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-cinzel tracking-wider text-gold-400 uppercase block">
              Gallery Photos
            </span>
            <span className="font-serif text-3xl font-bold text-white mt-1 block">
              {galleryCount}
            </span>
            <span className="text-xs text-gold-300/70">Editorial photos</span>
          </div>
          <Image className="w-8 h-8 text-gold-400/40" />
        </div>
      </div>

      {/* Quick Setup Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-navy-950/60 border border-gold-500/20 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gold-500/20 pb-3">
            <Calendar className="w-4 h-4 text-gold-400" />
            <h3 className="font-cinzel font-bold text-sm text-gold-200">Ceremony Details</h3>
          </div>
          <p className="text-xs text-gold-200/80 leading-relaxed font-sans">
            <strong>Marriage:</strong> {wedding?.marriage_details?.venue_name || 'Not configured'}
            <br />
            <strong>Muhurtham:</strong> {wedding?.marriage_details?.muhurtham_time || 'Not set'}
          </p>
          <Link
            to="/admin/marriage"
            className="inline-block text-xs font-cinzel text-gold-400 hover:text-gold-300 underline underline-offset-4"
          >
            Edit Marriage Details →
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-navy-950/60 border border-gold-500/20 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gold-500/20 pb-3">
            <MapPin className="w-4 h-4 text-gold-400" />
            <h3 className="font-cinzel font-bold text-sm text-gold-200">Reception Details</h3>
          </div>
          <p className="text-xs text-gold-200/80 leading-relaxed font-sans">
            <strong>Reception:</strong> {wedding?.reception_details?.venue_name || 'Not configured'}
            <br />
            <strong>Time:</strong> {wedding?.reception_details?.reception_time || 'Not set'}
          </p>
          <Link
            to="/admin/reception"
            className="inline-block text-xs font-cinzel text-gold-400 hover:text-gold-300 underline underline-offset-4"
          >
            Edit Reception Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
