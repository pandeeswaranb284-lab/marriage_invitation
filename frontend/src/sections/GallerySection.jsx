import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Heart } from 'lucide-react';

function Lightbox({ image, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 border border-white/40 text-white flex items-center justify-center hover:bg-white/30 transition-colors z-10"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={image.image_url}
          alt={image.caption || 'Gallery'}
          className="w-full h-full object-contain rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          style={{ maxHeight: '88vh' }}
        />
        {image.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl px-5 py-4">
            <p className="font-serif italic text-base text-white/95">{image.caption}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function GallerySection({ id, images }) {
  const [lightboxImg, setLightboxImg] = useState(null);

  const heroImg  = images.find(i => i.is_hero) || images[0];
  const restImgs = images.filter(i => i !== heroImg);

  return (
    <section
      id={id}
      className="relative py-20 md:py-28 px-4 bg-[#FFF7F9] scroll-mt-[70px]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-[#FCE4E8] opacity-60 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <span className="font-cinzel text-[10px] font-semibold tracking-[0.3em] text-[#8F3045]/70 uppercase">
            Moments &amp; Memories
          </span>
          <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-[#8F3045]">
            Photo Gallery
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
            <Heart className="w-3 h-3 fill-[#E85D75] text-[#E85D75]" />
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
          </div>
        </motion.div>

        {/* Hero image */}
        {heroImg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative rounded-3xl overflow-hidden cursor-pointer group border border-[#FCE4E8] shadow-[0_12px_40px_rgba(232,93,117,0.12)]"
            style={{ aspectRatio: '16 / 7' }}
            onClick={() => setLightboxImg(heroImg)}
          >
            <img
              src={heroImg.image_url}
              alt={heroImg.caption || 'Hero'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 border border-[#FCE4E8] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-[#E85D75]" />
            </div>
            {heroImg.caption && (
              <div className="absolute bottom-4 left-4">
                <p className="font-serif italic text-sm text-white bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full">
                  {heroImg.caption}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Grid */}
        {restImgs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {restImgs.map((img, i) => (
              <motion.div
                key={img.id || i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group border border-[#FCE4E8] shadow-[0_6px_25px_rgba(232,93,117,0.08)] ${
                  i % 5 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-square'
                }`}
                onClick={() => setLightboxImg(img)}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || `Gallery ${i + 2}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.caption && (
                    <p className="font-serif italic text-xs text-white truncate">{img.caption}</p>
                  )}
                </div>
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 border border-[#FCE4E8] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 text-[#E85D75]" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <Lightbox image={lightboxImg} onClose={() => setLightboxImg(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
