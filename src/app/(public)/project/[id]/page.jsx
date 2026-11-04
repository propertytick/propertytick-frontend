'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { MapPin, Building2, ArrowLeft } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        if (data.success) setProject(data.data.project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) return <Loader />;
  if (!project) return <div className="p-8 text-center">Project not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {project.photos?.[0] && (
            <img src={project.photos[0]} alt={project.title} className="w-full h-80 object-cover" />
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{project.title}</h1>
            <div className="flex items-center gap-2 text-slate-600 mb-4">
              <MapPin className="w-4 h-4" />
              {project.location?.city}, {project.location?.state}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {project.totalArea && (
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Total Area</p>
                  <p className="font-bold">{project.totalArea} sqft</p>
                </div>
              )}
              {project.totalPlots && (
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Total Plots</p>
                  <p className="font-bold">{project.totalPlots}</p>
                </div>
              )}
              {project.priceRange && (
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Price Range</p>
                  <p className="font-bold">{project.priceRange}</p>
                </div>
              )}
            </div>

            <p className="text-slate-700 mb-6">{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}