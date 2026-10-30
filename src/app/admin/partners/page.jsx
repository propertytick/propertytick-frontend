'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Search, Eye, Trash2, Send, RefreshCw } from 'lucide-react';

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/supervisers', {
        params: { search, page, limit: 10 },
      });
      setPartners(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPartners();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/admin/supervisers/${id}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchPartners();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSendKyc = async (id) => {
    if (!confirm('Send KYC link to this partner?')) return;
    try {
      await api.post(`/admin/superviser/send-kyc-link/${id}`);
      toast.success('KYC link sent successfully!');
      fetchPartners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send link');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      await api.delete(`/admin/supervisers/${id}`);
      toast.success('Partner deleted');
      fetchPartners();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'KYC_Sent': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Partners (Supervisers)</h1>
        <button onClick={fetchPartners} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, mobile, or city..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : partners.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No partners found</td></tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{partner.name}</div>
                      <div className="text-sm text-gray-500">{partner.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{partner.mobile}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {partner.city}, {partner.pinCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{partner.marketingExperience || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={partner.status}
                        onChange={(e) => handleStatusChange(partner._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(partner.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="KYC_Sent">KYC Sent</option>
                        <option value="Active">Active</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSendKyc(partner._id)}
                          title="Send KYC Link"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner._id)}
                          title="Delete"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}