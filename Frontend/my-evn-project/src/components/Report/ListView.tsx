// src/components/Report/ReportListView.tsx
import React from 'react';
import { Search, Plus, History, Clock } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

export const ReportListView = ({ role, reports, onViewDetail, onViewTimeline, onCreateClick }: any) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" placeholder="Tìm kiếm..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-80 shadow-sm"
          />
        </div>
        {role === 'ADMIN' && (
          <button onClick={onCreateClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center">
            <Plus size={18} className="mr-2" /> Khởi tạo báo cáo
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Thông tin</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Hạn chót</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report: any) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold">{report.name}</div>
                  <div className="text-xs text-gray-400">{report.id}</div>
                </td>
                <td className="px-6 py-4 text-sm"><Clock size={14} className="inline mr-1"/>{report.deadline}</td>
                <td className="px-6 py-4"><StatusBadge status={report.adminStatus} /></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onViewDetail(report.id)} className="bg-slate-800 text-white px-3 py-1.5 rounded text-xs">
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};