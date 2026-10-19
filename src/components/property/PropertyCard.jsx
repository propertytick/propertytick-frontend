import Link from 'next/link';
import { MapPin, Ruler, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function PropertyCard({ property }) {
  const owner = property.listedBy || property.owner;

  return (
    <Link href={`/property/${property._id}`} className="card group hover:-translate-y-1">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {property.photos?.[0] ? (
          <img
            src={property.photos[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            कोई फोटो नहीं
          </div>
        )}

        {property.promotion?.isPaid && (
          <span className="absolute top-3 left-3 badge bg-amber-500 text-white">⭐ फीचर्ड</span>
        )}
        {property.exchangeAvailable && (
          <span className="absolute top-3 right-3 badge bg-green-500 text-white">🔄 Exchange</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>

        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">
            {property.location?.landmark || property.location?.city || 'स्थान नहीं'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-extrabold text-primary-700">
              ₹{formatPrice(property.price?.amount)}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {property.area?.value} {property.area?.unit}
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {property.views || 0}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
