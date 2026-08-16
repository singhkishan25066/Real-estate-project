'use client';
// components/CalculatorContent.js
import { useEffect, useState } from 'react';
import { SQFT_PER_KATHA, projectedValue, gainPercent, formatRupees } from '@/lib/pricing';

const AREA_UNITS = { katha: SQFT_PER_KATHA, sqft: 1, bigha: SQFT_PER_KATHA * 20 };

export default function CalculatorContent() {
  const [projects, setProjects] = useState([]);
  const [priceSqft, setPriceSqft] = useState(950);
  const [area, setArea] = useState(5);
  const [areaUnit, setAreaUnit] = useState('katha');
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(10);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(data.projects || []));
  }, []);

  const areaSqft = area * AREA_UNITS[areaUnit];
  const current = priceSqft * areaSqft;
  const future = projectedValue(current, rate, years);
  const gain = gainPercent(current, future);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-stone text-xs font-bold tracking-widest uppercase mb-4">Plan ahead</div>
      <h1 className="text-4xl mb-2">What could this plot be worth later?</h1>
      <p className="text-gray-500 mb-10">A planning estimate, not a valuation or a promise.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card space-y-5">
          <div>
            <label className="label">Quick-fill from a project</label>
            <select
              className="input"
              onChange={(e) => {
                const p = projects.find((pr) => pr._id === e.target.value);
                if (p) setPriceSqft(p.ratePerSqft);
              }}
            >
              <option value="">Custom — I&apos;ll enter my own</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} — ₹{p.ratePerSqft}/sq ft
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Price per sq ft (₹)</label>
            <input
              type="number"
              className="input"
              value={priceSqft}
              onChange={(e) => setPriceSqft(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Plot area</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="input"
                value={area}
                onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
              />
              <select className="input max-w-[120px]" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                <option value="katha">Katha</option>
                <option value="sqft">Sq ft</option>
                <option value="bigha">Bigha</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Holding period (years)</label>
            <input
              type="number"
              className="input"
              value={years}
              onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Growth scenario</label>
            <div className="flex gap-2 flex-wrap">
              {[6, 10, 15].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border flex-1 ${
                    rate === r ? 'bg-stone text-white border-stone' : 'bg-[#fbf9f3] border-[#e2ddca]'
                  }`}
                >
                  {r}%/yr
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-navy text-white rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <div className="text-gold text-xs uppercase tracking-wide">Estimated future value</div>
            <div className="font-serif text-4xl mt-2">{formatRupees(future)}</div>
            <div className="text-sm text-[#a9aac6] mt-2">
              at {rate}%/yr over {years} year{years === 1 ? '' : 's'}
            </div>
            <div className="inline-block mt-4 text-sm font-bold px-4 py-1.5 rounded-full bg-sage/25 text-[#a9e0ad]">
              +{gain.toFixed(0)}% estimated gain
            </div>
          </div>
          <div className="mt-8 space-y-2 text-sm">
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span>Current value</span><span>{formatRupees(current)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span>Absolute gain</span><span>{formatRupees(future - current)}</span>
            </div>
          </div>
          <p className="text-xs text-[#8f91b3] mt-6">
            Simple compound growth on your chosen rate. Actual land prices move in jumps tied to registry,
            infrastructure, and demand — treat this as a planning estimate, not investment advice.
          </p>
        </div>
      </div>
    </main>
  );
}
