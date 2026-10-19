export const ROLES = {
  BUYER: 'buyer',
  BROKER: 'broker',
  ADVOCATE: 'advocate',
  COLONIZER: 'colonizer',
  TYPIST: 'typist',
  STAMP_VENDOR: 'stamp_vendor',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  buyer: 'ग्राहक',
  broker: 'प्रॉपर्टी डीलर',
  advocate: 'वकील',
  colonizer: 'कॉलोनाइज़र',
  typist: 'टाइपिस्ट',
  stamp_vendor: 'स्टांप वेंडर',
  admin: 'एडमिन',
};

export const PROPERTY_TYPES = [
  'plot', 'land', 'house', 'flat', 'shop', 'agriculture', 'commercial', 'industrial',
];

export const LAND_UNITS = ['bigha', 'biswa', 'gaz', 'murabba', 'kattha', 'sqft', 'acre', 'hectare'];

export const COLORS = {
  primary: '#1e40af',
  secondary: '#f59e0b',
  accent: '#10b981',
  danger: '#ef4444',
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
