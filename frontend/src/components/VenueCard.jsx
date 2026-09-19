import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Landmark, ExternalLink } from 'lucide-react';

export default function VenueCard({
  title = "MARRIAGE VENUE",
  venueName,
  address,
  landmark,
  parkingInfo,
  googleMapsUrl,
  mapEmbedUrl,
  themeType = "sacred", // "sacred" (Marriage) | "royal" (Reception)
}) {
  const isSacred = themeType === "sacred";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`rounded-2xl p-6 md:p-8 border-2 shadow-royal flex flex-col justify-between ${
        isSacred
          ? "bg-[#fdfbf7] text-neutral-900 border-[#dfba73]"
          : "bg-navy-950/90 text-[#f7e7ce] border-gold-400/40"
      }`}
    >
      <div className="space-y-4">
        <div className="border-b border-current/15 pb-3">
          <span className={`font-cinzel text-[10px] tracking-[0.25em] font-bold uppercase ${
            isSacred ? "text-[#8c6d33]" : "text-gold-400"
          }`}>
            {title}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold mt-1">
            {venueName}
          </h3>
        </div>

        <div className="flex items-start space-x-3 text-sm">
          <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            isSacred ? "text-[#8c6d33]" : "text-gold-400"
          }`} />
          <p className="font-sans leading-relaxed opacity-90">
            {address}
          </p>
        </div>

        {landmark && (
          <div className="flex items-start space-x-3 text-xs">
            <Landmark className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              isSacred ? "text-[#8c6d33]" : "text-gold-400"
            }`} />
            <div>
              <strong className="font-semibold">Landmark:</strong> {landmark}
            </div>
          </div>
        )}

        {parkingInfo && (
          <div className="flex items-start space-x-3 text-xs">
            <Car className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              isSacred ? "text-[#8c6d33]" : "text-gold-400"
            }`} />
            <div>
              <strong className="font-semibold">Parking:</strong> {parkingInfo}
            </div>
          </div>
        )}

        {/* Optional Embedded Map */}
        {mapEmbedUrl && (
          <div className="w-full h-44 rounded-xl overflow-hidden border border-current/20 mt-4">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={venueName}
            />
          </div>
        )}
      </div>

      {googleMapsUrl && (
        <div className="mt-6 pt-4 border-t border-current/15">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-full font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-md ${
              isSacred
                ? "bg-gradient-to-r from-[#8c6d33] via-[#dfba73] to-[#8c6d33] text-[#1c040d] hover:brightness-110"
                : "bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-navy-950 hover:brightness-110"
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>GET DIRECTIONS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </motion.div>
  );
}
