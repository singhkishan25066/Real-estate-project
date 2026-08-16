// app/projects/page.js
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import ProjectCard from '@/components/ProjectCard';

export const dynamic = 'force-dynamic';

async function getProjects() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-stone text-xs font-bold tracking-widest uppercase mb-4">DNS Homes projects</div>
      <h1 className="text-4xl mb-8">All projects</h1>
      {projects.length === 0 ? (
        <p className="text-gray-500">
          No projects yet — run <code className="bg-gray-100 px-2 py-1 rounded">npm run seed</code>.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </main>
  );
}
