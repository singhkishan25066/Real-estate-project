// components/ProjectCard.js
import Link from 'next/link';

export default function ProjectCard({ project }) {
  const smallest = [...project.plotSizes].sort((a, b) => a.sizeSqft - b.sizeSqft)[0];
  const entryPrice = smallest ? smallest.sizeSqft * project.ratePerSqft : null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block bg-white rounded-2xl overflow-hidden border border-navy/10 hover:-translate-y-1 hover:shadow-xl transition"
    >
      <div className="h-40 bg-gradient-to-br from-navy to-stone/70 flex items-end p-4">
        <span className="text-white text-sm">📍 {project.locality}</span>
      </div>
      <div className="p-5">
        <div className="text-xs text-gray-400 mb-1">{project.district} district</div>
        <h3 className="text-xl mb-2">{project.name}</h3>
        <div className="flex justify-between items-center border-t pt-3 mt-3 text-sm">
          <span className="font-serif text-lg">
            {entryPrice ? `₹${(entryPrice / 100000).toFixed(2)} L onwards` : '—'}
          </span>
          <span className="text-gray-400">₹{project.ratePerSqft}/sq ft</span>
        </div>
      </div>
    </Link>
  );
}
