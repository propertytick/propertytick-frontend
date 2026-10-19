'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { formatDate } from '@/lib/utils';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/audit-logs?limit=100');
        if (data.success) setLogs(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Audit Logs</h1>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Action</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-xs text-gray-500">{formatDate(log.createdAt)}</td>
                <td className="p-3">{log.user?.fullName || '-'}</td>
                <td className="p-3 font-mono text-xs">{log.action}</td>
                <td className="p-3">
                  <span className={`badge ${log.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-3 text-xs text-gray-500">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
