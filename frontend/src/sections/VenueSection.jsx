import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Car, Heart } from 'lucide-react';

function VenueCard({ title, data }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
      className="rounded-3xl overflow-hidden border border-[#FCE4E8] bg-white/95 shadow-[0_10px_35px_rgba(232,93,117,0.08)]"
    >
      {/* Card header */}
      <div className="px-6 py-4 border-b border-[#FCE4E8] bg-[#FCE4E8]/50">
        <span className="font-cinzel text-[10px] font-semibold tracking-[0.25em] uppercase text-[#E85D75]">
          {title}
        </span>
        <h3 className="font-serif italic text-xl md:text-2xl font-bold mt-0.5 text-[#8F3045]">
          {data.venue_name}
        </h3>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#E85D75]" />
          <div>
            <p className="font-sans text-sm leading-relaxed text-[#8F3045]/85">
              {data.venue_address}
            </p>
            {data.landmark && (
              <p className="font-sans text-xs mt-1 text-[#E85D75] font-medium">
                Landmark: {data.landmark}
              </p>
            )}
          </div>
        </div>

        {/* Parking */}
        {data.parking_info && (
          <div className="flex items-start gap-3">
            <Car className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#E85D75]" />
            <p className="font-sans text-xs leading-relaxed text-[#8F3045]/70">
              {data.parking_info}
            </p>
          </div>
        )}

        {/* Map embed */}
        {data.map_embed_url && (
          <div className="rounded-2xl overflow-hidden border border-[#FCE4E8] mt-2">
            <iframe
              src={data.map_embed_url}
              title={data.venue_name}
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        )}

        {/* Maps link */}
        {data.google_maps_url && (
          <div className="pt-2">
            <a
              href={data.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase transition-all bg-gradient-to-r from-[#E85D75] to-[#E11D48] text-white shadow-[0_4px_16px_rgba(232,93,117,0.3)] hover:brightness-105"
            >
              <MapPin className="w-3 h-3" />
              GET DIRECTIONS
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function VenueSection({ id, marriage, reception }) {
  return (
    <section
      id={id}
      className="relative py-20 md:py-28 px-4 bg-[#FFF7F9] scroll-mt-[70px]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vh] bg-[#FCE4E8] opacity-60 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <span className="font-cinzel text-[10px] font-semibold tracking-[0.3em] text-[#8F3045]/70 uppercase">
            Travel &amp; Location Details
          </span>
          <h2 className="font-serif italic text-3xl md:text-5xl font-bold text-[#8F3045]">
            Celebration Venues
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
            <Heart className="w-3 h-3 fill-[#E85D75] text-[#E85D75]" />
            <div className="w-12 h-[1px] bg-[#E85D75]/30" />
          </div>
        </motion.div>

        {/* Two venue cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <VenueCard title="MARRIAGE VENUE"  data={marriage} />
          <VenueCard title="RECEPTION VENUE" data={reception} />
        </div>
      </div>
    </section>
  );
}
