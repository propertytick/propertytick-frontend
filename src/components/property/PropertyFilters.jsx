'use client';

const TYPES = [
  { value: '', label: 'Property Type' },
  { value: 'plot', label: 'Plot' },
  { value: 'land', label: 'Land' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat' },
  { value: 'shop', label: 'Shop' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];

export default function PropertyFilters({ filters, setFilters }) {
  // ✅ SAFE DEFAULT — agar filters undefined ho toh empty object banao
  const safeFilters = filters || {};

  const update = (key, value) => {
    if (typeof setFilters === 'function') {
      const newFilters = { ...safeFilters };
      if (value) {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }
      setFilters(newFilters);
    }
  };

  return (
    <div className="grid md:grid-cols-4 gap-3">
      <select
        value={safeFilters.propertyType || ''}
        onChange={(e) => update('propertyType', e.target.value)}
        className="input-field py-2"
      >
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price (₹)"
        value={safeFilters.minPrice || ''}
        onChange={(e) => update('minPrice', e.target.value)}
        className="input-field py-2"
      />

      <input
        type="number"
        placeholder="Max Price (₹)"
        value={safeFilters.maxPrice || ''}
        onChange={(e) => update('maxPrice', e.target.value)}
        className="input-field py-2"
      />

      <select
        value={safeFilters.exchangeAvailable || ''}
        onChange={(e) => update('exchangeAvailable', e.target.value)}
        className="input-field py-2"
      >
        <option value="">All Listings</option>
        <option value="true">Exchange Available</option>
      </select>
    </div>
  );
}
