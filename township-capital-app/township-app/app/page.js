// app/page.js
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import ProjectCard from '@/components/ProjectCard';

export const dynamic = 'force-dynamic'; // always show fresh listings

async function getProjects() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 }).limit(4).lean();
  return JSON.parse(JSON.stringify(projects));
}

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main>
      <section className="bg-navy text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-gold text-xs font-bold tracking-widest uppercase mb-4">Rajgir &amp; Bihta, Bihar</div>
          <h1 className="text-5xl max-w-2xl mb-6">The ground floor of Bihar&apos;s next growth corridor.</h1>
          <p className="max-w-xl text-[#c7c8de] mb-8">
            Verified plots from DNS Homes — with real pricing, projected value, and a dashboard to track what you save.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/projects" className="btn-gold">See all projects →</Link>
            <Link href="/calculator" className="btn-outline !border-white/30 !text-white">Try the calculator</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-8">Featured projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">
            No projects yet — run <code className="bg-gray-100 px-2 py-1 rounded">npm run seed</code> to load
            Mountain Bliss and Shuvida Enclave, or add one from the admin panel.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
