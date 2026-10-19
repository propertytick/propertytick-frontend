export const formatPrice = (amount) => {
  if (!amount) return '0';
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const LAND_UNITS = {
  sqft: 1,
  gaz: 9,
  biswa: 1350,
  kattha: 1350,
  bigha: 27000,
  acre: 43560,
  hectare: 107639,
  murabba: 1089000,
};

export const convertLand = (value, from, to) => {
  const sqft = value * LAND_UNITS[from];
  return Math.round((sqft / LAND_UNITS[to]) * 100) / 100;
};
