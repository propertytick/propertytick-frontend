'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [colonizers, setColonizers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedColonizer, setSelectedColonizer] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [colonizerSearch, setColonizerSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [userType, setUserType] = useState('colonizer');
  const [dealers, setDealers] = useState([]);
  const [dealerSearch, setDealerSearch] = useState('');
  const [selectedDealer, setSelectedDealer] = useState('');
  const [dealerProperties, setDealerProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [propertySearch, setPropertySearch] = useState('');
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({ ratePerDay: '', startDate: '', endDate: '', image: null });

  useEffect(() => {
    api.get('/admin/advertisements')
      .then(({ data }) => data.success && setAds(data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
  if (userType !== 'dealer') return;
  const fetchDealers = async () => {
    try {
      const { data } = await api.get(`/admin/users?role=broker&search=${dealerSearch}`);
      if (data.success) setDealers(data.data);
    } catch (err) {
      console.error('Failed to fetch dealers', err);
    }
  };
  fetchDealers();
}, [userType, dealerSearch]);   // ✅ closing add karo
   

  useEffect(() => {
    if (!selectedDealer) return;
    const fetchProperties = async () => {
      const { data } = await api.get(`/admin/users/${selectedDealer}/properties?search=${propertySearch}`);
      if (data.success) setDealerProperties(data.data);
    };
    fetchProperties();
  }, [selectedDealer, propertySearch]);

  useEffect(() => {
  const timer = setTimeout(() => {
    const fetchColonizers = async () => {
      try {
        const { data } = await api.get(`/admin/colonizers/search?search=${colonizerSearch}`);
        if (data.success) setColonizers(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchColonizers();
  }, 300);   // 300ms debounce
  
  return () => clearTimeout(timer);
}, [colonizerSearch]);

  useEffect(() => {
    if (!selectedColonizer) return;
    const fetchProjects = async () => {
      const { data } = await api.get(`/admin/colonizers/${selectedColonizer}/projects?search=${projectSearch}`);
      if (data.success) setProjects(data.data);
    };
    fetchProjects();
  }, [selectedColonizer, projectSearch]);

  const handleGenerateLink = async (e) => {
    e.preventDefault();
    
    let payload = {};
    if (userType === 'colonizer') {
      if (!selectedColonizer || !selectedProject) {
        alert('Please select colonizer and project');
        return;
      }
      payload = {
        projectId: selectedProject,
        colonizerId: selectedColonizer,
        adType: 'upcoming_project',
      };
    } else {
  if (!selectedDealer || !selectedProperty) {
    alert('Please select dealer and property');
    return;
  }
  
  // ✅ Selected property ka listingPurpose check karo
  const selectedProp = dealerProperties.find(p => p._id === selectedProperty);
  const adType = selectedProp?.listingPurpose === 'rent' 
    ? 'rent_property' 
    : 'sell_property';
  
  payload = {
    propertyId: selectedProperty,
    userId: selectedDealer,
    adType,
  };
}

    try {
      const { data } = await api.post('/admin/advertisements/generate-link', payload);
      if (data.success) {
        setGeneratedLink(data.link);
        alert('Link generated!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const handlePublish = async (id, form) => {
  try {
    const { data } = await api.patch(`/admin/advertisements/${id}/publish`, {
      ratePerDay: Number(form.ratePerDay.value),
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      discountText: form.discountText?.value || '',
    });
    if (data.success) {
      alert('Published!');
      setAds(prev => prev.map(ad => 
        ad._id === id 
          ? { ...ad, status: 'active', ...data.data } 
          : ad
      ));
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to publish');
  }
};

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ratePerDay', editForm.ratePerDay);
    formData.append('startDate', editForm.startDate);
    formData.append('endDate', editForm.endDate);
    if (editForm.image) formData.append('image', editForm.image);

    try {
      const { data } = await api.put(`/admin/advertisements/${editingAd._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
  alert('Ad updated!');
  setAds(prev => prev.map(ad => 
    ad._id === editingAd._id 
      ? { ...ad, ...data.data } 
      : ad
  ));
  setEditingAd(null);   // Modal band karo
}
    } catch (err) {
      alert('Failed to update ad');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    try {
      const { data } = await api.delete(`/admin/advertisements/${id}`);
      if (data.success) {
        alert('Ad deleted!');
        setAds(prev => prev.filter(ad => ad._id !== id));
      }
    } catch (err) {
      alert('Failed to delete ad');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Ads</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">🔗 Generate Ad Submit Link</h2>
        
        <form onSubmit={handleGenerateLink} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1">User Type</label>
            <select
  value={userType}
  onChange={(e) => {
    setUserType(e.target.value);
    setSelectedColonizer('');
    setSelectedProject('');
    setSelectedDealer('');
    setSelectedProperty('');
    setGeneratedLink('');
  }}
  className="input-field w-full mb-2"
>
  <option value="colonizer">Colonizer (Project)</option>
  <option value="dealer">Property Dealer (Sell/Rent)</option>
</select>
              
          </div>

          {userType === 'colonizer' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">Search Colonizer</label>
                <input type="text" placeholder="Search by name, email, phone, city, pincode..." value={colonizerSearch} onChange={(e) => setColonizerSearch(e.target.value)} className="input-field w-full mb-2" />
                <select value={selectedColonizer} onChange={(e) => setSelectedColonizer(e.target.value)} required className="input-field w-full">
                  <option value="">Select Colonizer</option>
                  {colonizers.map(c => (
                    <option key={c._id} value={c._id}>{c.fullName} - {c.companyName || c.shopName || ''} - {c.location?.city} - {c.phone}</option>
                  ))}
                </select>
              </div>

              {selectedColonizer && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Search Project</label>
                  <input type="text" placeholder="Search by title, city, pincode..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="input-field w-full mb-2" />
                  <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} required className="input-field w-full">
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title} - {p.location?.city} - {p.location?.pincode}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {userType === 'dealer' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">Search Dealer</label>
                <input type="text" placeholder="Search by name, phone, city..." value={dealerSearch} onChange={(e) => setDealerSearch(e.target.value)} className="input-field w-full mb-2" />
                <select value={selectedDealer} onChange={(e) => setSelectedDealer(e.target.value)} required className="input-field w-full">
                  <option value="">Select Dealer</option>
                  {dealers.map(d => (
                    <option key={d._id} value={d._id}>{d.fullName} - {d.phone} - {d.location?.city}</option>
                  ))}
                </select>
              </div>

              {selectedDealer && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Search Property</label>
                  <input type="text" placeholder="Search by title, city..." value={propertySearch} onChange={(e) => setPropertySearch(e.target.value)} className="input-field w-full mb-2" />
                  <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)} required className="input-field w-full">
                    <option value="">Select Property</option>
                    {dealerProperties.map(p => (
                      <option key={p._id} value={p._id}>{p.title} - {p.listingPurpose} - {p.location?.city}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn-primary w-full">Generate Link</button>
        </form>

        {generatedLink && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-800 mb-2">✅ Link Generated:</p>
            <div className="flex items-center gap-2">
              <input type="text" value={generatedLink} readOnly className="input-field flex-1 bg-white" />
              <button onClick={() => { navigator.clipboard.writeText(generatedLink); alert('Link copied!'); }} className="btn-primary px-4">Copy</button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">📋 All Ads</h2>
        {ads.length === 0 ? (
          <p className="text-gray-500">No ads found. Please generate a link first.</p>
        ) : (
          <div className="space-y-4">
            {ads.map(ad => (
              <div key={ad._id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <img src={ad.image} alt="Ad" className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {ad.adType === 'upcoming_project' && (ad.project?.title || 'Project')}
                      {ad.adType === 'sell_property' && (ad.property?.title || 'Sell Property')}
                      {ad.adType === 'rent_property' && (ad.property?.title || 'Rent Property')}
                    </p>
                    <p className="text-xs text-slate-500">
                      Type: {ad.adType === 'upcoming_project' ? 'Project' : ad.adType === 'sell_property' ? 'Sell' : 'Rent'}
                    </p>
                    <p className="text-xs text-slate-500">Pins: {ad.pinCodes?.join(', ') || 'N/A'}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      ad.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ad.status === 'pending' ? '⏳ Pending' : ad.status === 'active' ? '✅ Published' : ad.status}
                    </span>
                  </div>
                </div>

                {ad.status === 'pending' && (
                  <div className="mt-4 flex gap-2 items-end">
                    <form onSubmit={e => { e.preventDefault(); handlePublish(ad._id, e.target); }} className="flex gap-2 flex-1">
                      <input name="ratePerDay" type="number" placeholder="Rate/day (₹)" required className="input-field" />
                      <input name="startDate" type="date" required className="input-field" />
                      <input name="endDate" type="date" required className="input-field" />
                      <input name="discountText" type="text" placeholder="Discount" className="input-field" />
                      <button type="submit" className="btn-primary">Publish</button>
                    </form>
                    <button type="button" onClick={() => handleDelete(ad._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-all">Delete</button>
                  </div>
                )}

                {ad.status === 'active' && (
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => { setEditingAd(ad); setEditForm({ ratePerDay: ad.ratePerDay || '', startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '', endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '', image: null }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">Edit</button>
                    <button type="button" onClick={() => handleDelete(ad._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-all">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editingAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Advertisement</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">New Photo (optional)</label>
                <input type="file" accept="image/*" onChange={e => setEditForm({...editForm, image: e.target.files[0]})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Rate/Day (₹)</label>
                <input type="number" value={editForm.ratePerDay} onChange={e => setEditForm({...editForm, ratePerDay: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Start Date</label>
                <input type="date" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">End Date</label>
                <input type="date" value={editForm.endDate} onChange={e => setEditForm({...editForm, endDate: e.target.value})} className="input-field" required />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">Update Ad</button>
                <button type="button" onClick={() => setEditingAd(null)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}