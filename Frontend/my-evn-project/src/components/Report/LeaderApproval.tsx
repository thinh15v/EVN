    import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, Download, FileText } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

export const LeaderApprovalView = ({ report, onApprove }: any) => {
  const myDept = report.departments.find((d: any) => d.id === 'B02');
  const [selectedV, setSelectedV] = useState<number[]>([]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg flex items-center">
          <ShieldCheck className="mr-2 text-green-600"/> Phê duyệt Ban Kỹ thuật
        </h3>
        <StatusBadge status={myDept?.status} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-600 uppercase">Danh sách bản nộp của nhân viên</div>
        <div className="p-4 space-y-3">
          {myDept?.versions.map((v: any) => (
            <label key={v.v} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedV.includes(v.v) ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <input type="checkbox" className="w-5 h-5 mr-4 accent-green-600" onChange={() => setSelectedV(prev => prev.includes(v.v) ? prev.filter(i => i !== v.v) : [...prev, v.v])} />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{v.file}</p>
                <p className="text-[10px] text-gray-400">{v.time} - {v.user}</p>
              </div>
              <Download size={16} className="text-blue-500" />
            </label>
          ))}
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            disabled={selectedV.length === 0 || myDept?.locked}
            onClick={() => onApprove(selectedV, [])}
            className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            {myDept?.locked ? 'Đã chốt số liệu' : 'Xác nhận & Khóa số'}
          </button>
        </div>
      </div>
    </div>
  );
};