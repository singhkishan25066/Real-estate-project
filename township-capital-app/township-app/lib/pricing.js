// lib/pricing.js
// Shared math so the projects list, project detail page, and standalone
// calculator all compute the same numbers the same way.

export const SQFT_PER_KATHA = 1361.25; // Patna/Magadh standard — confirm locally per thana
export const SQFT_PER_BIGHA = SQFT_PER_KATHA * 20;

export function currentPrice(sizeSqft, ratePerSqft) {
  return sizeSqft * ratePerSqft;
}

// Simple compound growth projection. Not a guarantee — an assumption the
// user chooses (conservative / moderate / optimistic).
export function projectedValue(current, annualRatePct, years) {
  return current * Math.pow(1 + annualRatePct / 100, years);
}

export function gainPercent(current, future) {
  if (!current) return 0;
  return ((future - current) / current) * 100;
}

export function formatRupees(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function sqftToKatha(sqft) {
  return sqft / SQFT_PER_KATHA;
}
