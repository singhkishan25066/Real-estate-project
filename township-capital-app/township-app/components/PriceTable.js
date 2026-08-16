'use client';
// components/PriceTable.js
// Shows every plot size for a project with current price + projected value,
// driven by shared year/growth-rate controls. Used on the project detail page.
import { useState } from 'react';
import { currentPrice, projectedValue, gainPercent, formatRupees } from '@/lib/pricing';

const YEAR_OPTIONS = [3, 5, 10];
const RATE_OPTIONS = [
  { label: 'Conservative · 6%/yr', value: 6 },
  { label: 'Moderate · 10%/yr', value: 10 },
  { label: 'Optimistic · 15%/yr', value: 15 },
];

export default function PriceTable({ plotSizes, ratePerSqft }) {
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(10);

  return (
    <div>
      <div className="card flex flex-wrap gap-6 items-end mb-6">
        <div>
          <div className="label !mb-2">Holding period</div>
          <div className="flex gap-2">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  years === y ? 'bg-navy text-white border-navy' : 'bg-[#fbf9f3] border-[#e2ddca]'
                }`}
              >
                {y} yrs
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="label !mb-2">Growth assumption</div>
          <div className="flex gap-2 flex-wrap">
            {RATE_OPTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRate(r.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  rate === r.value ? 'bg-stone text-white border-stone' : 'bg-[#fbf9f3] border-[#e2ddca]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fbf9f3] text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="p-4">Plot size</th>
              <th className="p-4">Current price</th>
              <th className="p-4">Projected value</th>
              <th className="p-4">Est. gain</th>
            </tr>
          </thead>
          <tbody>
            {plotSizes.map((p, i) => {
              const current = currentPrice(p.sizeSqft, ratePerSqft);
              const future = projectedValue(current, rate, years);
              const gain = gainPercent(current, future);
              return (
                <tr key={i} className="border-t border-[#f2ede0]">
                  <td className="p-4">
                    {p.sizeSqft.toLocaleString('en-IN')} sq ft{p.code ? ` (Type ${p.code})` : ''}
                  </td>
                  <td className="p-4 font-serif">{formatRupees(current)}</td>
                  <td className="p-4 font-serif">{formatRupees(future)}</td>
                  <td className="p-4">
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-sage/15 text-sage">
                      ↑ {gain.toFixed(0)}% · {formatRupees(future - current)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Projected values use a chosen growth assumption, not a guarantee — actual appreciation depends on
        registry activity, infrastructure delivery, and demand.
      </p>
    </div>
  );
}
