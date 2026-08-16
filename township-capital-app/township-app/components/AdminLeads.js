'use client';
// components/AdminLeads.js
import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['new', 'contacted', 'closed'];

export default function AdminLeads() {
  const [leads, setLeads] = useState(null);

  function load() {
    fetch('/api/leads').then((r) => r.json()).then((data) => setLeads(data.leads || []));
  }
  useEffect(load, []);

  async function updateStatus(id, status) {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (leads === null) return <p className="text-gray-400">Loading…</p>;
  if (leads.length === 0) return <p className="text-gray-500">No contact form submissions yet.</p>;

  return (
    <div className="bg-white rounded-2xl border border-navy/10 overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="bg-[#fbf9f3] text-left text-xs uppercase tracking-wide text-gray-400">
            <th className="p-4">Name</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Project</th>
            <th className="p-4">Message</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-t border-[#f2ede0]">
              <td className="p-4">{lead.name}</td>
              <td className="p-4">{lead.phone}</td>
              <td className="p-4">{lead.project?.name || '—'}</td>
              <td className="p-4 max-w-xs truncate">{lead.message || '—'}</td>
              <td className="p-4">
                <select
                  className="input !py-1.5 !text-xs"
                  value={lead.status}
                  onChange={(e) => updateStatus(lead._id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
