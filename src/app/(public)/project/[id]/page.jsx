'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { MapPin, Building2, ArrowLeft, FileText, Phone, User, Image as ImageIcon, ShieldCheck } from 'lucide-react';

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
          {/* Main Photo */}
          {project.photos?.[0] && (
            <img src={project.photos[0]} alt={project.title} className="w-full h-80 object-cover" />
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{project.title}</h1>
            
            {/* Location Details */}
            <div className="flex items-center gap-2 text-slate-600 mb-4 flex-wrap">
              <MapPin className="w-4 h-4" />
              <span>{project.location?.city}, {project.location?.state} - {project.location?.pincode}</span>
              {project.location?.landmark && <span className="text-sm text-slate-400">({project.location.landmark})</span>}
            </div>

            {/* RERA Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              RERA: {project.reraNumber}
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              {project.projectType && (
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Type</p>
                  <p className="font-bold capitalize">{project.projectType}</p>
                </div>
              )}
            </div>

            {/* Full Address */}
            {project.projectAddress && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5" /> Full Address
                </h3>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{project.projectAddress}</p>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> About Project
                </h3>
                <p className="text-slate-700 whitespace-pre-line">{project.description}</p>
              </div>
            )}

            {/* Naksha / Layout Map */}
            {project.naksha && project.naksha.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Naksha / Layout Map
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.naksha.map((img, idx) => (
                    <img key={idx} src={img} alt={`Naksha ${idx + 1}`} className="w-full h-64 object-contain border rounded-lg bg-slate-100" />
                  ))}
                </div>
              </div>
            )}

            {/* Contact Persons */}
            {project.contacts && project.contacts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5" /> Contact Persons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.contacts.map((contact, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{contact.name} {contact.post && <span className="text-sm text-slate-500">({contact.post})</span>}</p>
                        <a href={`tel:${contact.phone}`} className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}