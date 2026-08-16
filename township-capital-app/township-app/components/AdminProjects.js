'use client';
// components/AdminProjects.js
import { useEffect, useState } from 'react';

const emptyForm = {
  name: '', slug: '', locality: '', district: '', ratePerSqft: '',
  plotSizesText: '', infraText: '', paymentPlan: '', description: '',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/projects').then((r) => r.json()).then((data) => setProjects(data.projects || []));
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // "600:H, 900:G, 1200:C" -> [{sizeSqft, code}]
      const plotSizes = form.plotSizesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const [size, code] = s.split(':').map((x) => x.trim());
          return { sizeSqft: parseFloat(size), code: code || '' };
        });
      const infraPoints = form.infraText.split('\n').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          locality: form.locality,
          district: form.district,
          ratePerSqft: parseFloat(form.ratePerSqft),
          plotSizes,
          infraPoints,
          paymentPlan: form.paymentPlan,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create project.');
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl mb-4">Existing projects</h2>
        {projects === null && <p className="text-gray-400">Loading…</p>}
        <div className="space-y-3">
          {projects?.map((p) => (
            <div key={p._id} className="card flex justify-between items-center">
              <div>
                <div className="font-serif text-lg">{p.name}</div>
                <div className="text-sm text-gray-400">{p.locality} · ₹{p.ratePerSqft}/sq ft</div>
              </div>
              <button onClick={() => handleDelete(p._id)} className="text-sm text-red-500">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl mb-4">Add a project</h2>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Slug (URL-friendly, unique)</label>
            <input className="input" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Locality</label>
              <input className="input" required value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} />
            </div>
            <div>
              <label className="label">District</label>
              <input className="input" required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Rate per sq ft (₹)</label>
            <input type="number" className="input" required value={form.ratePerSqft} onChange={(e) => setForm({ ...form, ratePerSqft: e.target.value })} />
          </div>
          <div>
            <label className="label">Plot sizes — "sqft:code" comma-separated, e.g. 600:H, 900:G, 1200:C</label>
            <input className="input" required value={form.plotSizesText} onChange={(e) => setForm({ ...form, plotSizesText: e.target.value })} />
          </div>
          <div>
            <label className="label">Nearby infra — one per line</label>
            <textarea className="input" rows={3} value={form.infraText} onChange={(e) => setForm({ ...form, infraText: e.target.value })} />
          </div>
          <div>
            <label className="label">Payment plan</label>
            <input className="input" value={form.paymentPlan} onChange={(e) => setForm({ ...form, paymentPlan: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Add project'}</button>
        </form>
      </div>
    </div>
  );
}
