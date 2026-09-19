import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { KolamDivider } from './Ornaments';

export default function Gallery({ images = [] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  if (!images || images.length === 0) return null;

  const categories = ["all", "artwork", "groom", "bride", "family", "celebration"];

  const filteredImages = activeCategory === "all"
    ? images
    : images.filter(img => img.category?.toLowerCase() === activeCategory);

  const heroImage = images.find(img => img.is_hero) || images[0];
  const supportingImages = images.filter(img => img.id !== heroImage?.id);

  const openLightbox = (index) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const showNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const showPrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Editorial Header */}
      <div className="text-center space-y-2">
        <span className="font-cinzel text-[10px] tracking-[0.3em] text-gold-400 uppercase">
          Sacred Moments & Traditions
        </span>
        <h2 className="font-cinzel text-2xl md:text-4xl font-bold gold-text-gradient">
          EDITORIAL GALLERY
        </h2>
        <KolamDivider className="mx-auto my-3 text-gold-500" />
      </div>

      {/* Editorial Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Large Hero Feature (Left / Top 7 cols) */}
        {heroImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => openLightbox(images.indexOf(heroImage))}
            className="md:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-gold-400/50 shadow-royal aspect-[4/3.5] md:aspect-auto md:min-h-[420px]"
          >
            <img
              src={heroImage.image_url}
              alt={heroImage.caption || "Hero Gallery Image"}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[9px] font-cinzel tracking-widest text-gold-400 uppercase bg-navy-950/80 px-2.5 py-1 rounded-full border border-gold-500/30">
                  FEATURED ARTWORK
                </span>
                <p className="font-serif italic text-lg text-white font-medium mt-1">
                  {heroImage.caption || "A Sacred Union"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-400/60 flex items-center justify-center text-gold-300">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Right Stack of Supporting Editorial Cards (5 cols) */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {supportingImages.slice(0, 4).map((img, idx) => {
            const originalIndex = images.indexOf(img);
            return (
              <motion.div
                key={img.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => openLightbox(originalIndex)}
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-gold-400/40 shadow-md aspect-square bg-navy-950"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || `Gallery ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-navy-950/30 group-hover:bg-navy-950/60 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity font-cinzel text-[10px] tracking-widest text-gold-200 bg-navy-950/90 px-3 py-1 rounded-full border border-gold-400/40">
                    VIEW
                  </span>
                </div>
                {img.caption && (
                  <div className="absolute bottom-2 left-2 right-2 truncate text-[10px] font-sans text-gold-200/90 bg-navy-950/75 px-1.5 py-0.5 rounded">
                    {img.caption}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FULL-SCREEN EDITORIAL LIGHTBOX */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 text-gold-300 hover:text-white p-2 rounded-full bg-navy-950/60 border border-gold-500/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-gold-300 hover:text-white p-3 rounded-full bg-navy-950/60 border border-gold-500/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-gold-300 hover:text-white p-3 rounded-full bg-navy-950/60 border border-gold-500/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={images[selectedImageIndex]?.image_url}
                alt="Enlarged gallery item"
                className="max-h-[75vh] max-w-full object-contain rounded-xl border border-gold-400/50 shadow-2xl"
              />
              {images[selectedImageIndex]?.caption && (
                <p className="font-serif italic text-base text-gold-200 mt-3 text-center bg-navy-950/80 px-4 py-1.5 rounded-full border border-gold-500/30">
                  {images[selectedImageIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
