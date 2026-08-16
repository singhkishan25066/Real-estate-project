// app/projects/[slug]/page.js
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import PriceTable from '@/components/PriceTable';
import FavoriteButton from '@/components/FavoriteButton';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

async function getProject(slug) {
  await connectDB();
  const project = await Project.findOne({ slug }).lean();
  return project ? JSON.parse(JSON.stringify(project)) : null;
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <main>
      <section className="bg-navy text-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-gold text-xs font-bold tracking-widest uppercase mb-4">
            {project.district} district
          </div>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl mb-2">{project.name}</h1>
              <p className="text-[#c7c8de]">📍 {project.locality}</p>
            </div>
            <FavoriteButton projectId={project._id} />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {project.description && <p className="text-gray-600 mb-8 max-w-2xl">{project.description}</p>}

        {project.infraPoints?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl mb-4">Nearby</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
              {project.infraPoints.map((point, i) => (
                <li key={i}>— {point}</li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-2xl mb-4">Current price &amp; projected value</h2>
        <PriceTable plotSizes={project.plotSizes} ratePerSqft={project.ratePerSqft} />

        {project.paymentPlan && (
          <p className="text-sm text-gray-500 mt-6">
            <strong>Payment plan:</strong> {project.paymentPlan}
          </p>
        )}

        <div className="mt-16 max-w-lg">
          <h2 className="text-2xl mb-4">Interested in {project.name}?</h2>
          <ContactForm projectId={project._id} />
        </div>
      </section>
    </main>
  );
}
