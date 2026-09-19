import React, { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { API_BASE } from '../../services/api';

export default function GalleryManager() {
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newImage, setNewImage] = useState({
    image_url: '',
    caption: '',
    category: 'celebration',
    is_hero: false,
  });
  const [notice, setNotice] = useState('');
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

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImage.image_url.trim()) return;
    setAdding(true);
    setNotice('');

    try {
      const res = await fetch(`${apiBase}/weddings/admin/${wedding.slug}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newImage),
      });

      if (res.ok) {
        setNotice('Photo added to gallery!');
        setNewImage({
          image_url: '',
          caption: '',
          category: 'celebration',
          is_hero: false,
        });
        fetchWedding();
      }
    } catch (err) {
      setNotice('Failed to add photo');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to remove this photo?')) return;
    try {
      const res = await fetch(`${apiBase}/weddings/admin/gallery/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotice('Photo removed');
        fetchWedding();
      }
    } catch (err) {
      setNotice('Failed to delete photo');
    }
  };

  if (loading) return <div className="p-8 text-gold-300 font-cinzel">Loading gallery...</div>;

  const images = wedding?.gallery_images || [];

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-gold-500/20 pb-4">
        <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold-400 uppercase">
          Photos & Artworks
        </span>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold gold-text-gradient mt-1">
          EDITORIAL GALLERY MANAGER
        </h2>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add New Image Form */}
      <form onSubmit={handleAddImage} className="p-6 rounded-xl bg-navy-950/80 border border-gold-500/30 space-y-4 font-sans">
        <h3 className="font-cinzel text-xs font-bold text-gold-300 uppercase">
          Add New Photo / Artwork
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-gold-300 mb-1">Image URL *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={newImage.image_url}
              onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
              className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-gold-300 mb-1">Caption</label>
            <input
              type="text"
              placeholder="e.g. Traditional Garland Exchange"
              value={newImage.caption}
              onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
              className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs text-gold-300 mb-1">Category</label>
            <select
              value={newImage.category}
              onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
              className="w-full px-3 py-2 rounded bg-navy-900 border border-gold-500/30 text-white text-xs"
            >
              <option value="artwork">Couple Artwork</option>
              <option value="groom">Groom</option>
              <option value="bride">Bride</option>
              <option value="family">Family</option>
              <option value="celebration">Celebration</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={adding}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 font-cinzel font-bold text-xs tracking-wider uppercase hover:brightness-110 shadow-gold-glow flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{adding ? 'ADDING...' : 'ADD TO GALLERY'}</span>
        </button>
      </form>

      {/* Existing Images Grid */}
      <div className="space-y-4">
        <h3 className="font-cinzel text-xs font-bold text-gold-400 uppercase">
          Current Gallery Images ({images.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden border border-gold-500/30 bg-navy-950 shadow-md flex flex-col justify-between"
            >
              <div className="aspect-square w-full overflow-hidden bg-navy-900">
                <img
                  src={img.image_url}
                  alt={img.caption || 'Gallery item'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2.5 space-y-1">
                <span className="text-[9px] font-cinzel text-gold-400 uppercase tracking-wider block">
                  {img.category}
                </span>
                <p className="text-xs text-white truncate font-serif italic">
                  {img.caption || 'No caption'}
                </p>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="mt-2 w-full py-1 rounded bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 text-[10px] font-cinzel flex items-center justify-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
