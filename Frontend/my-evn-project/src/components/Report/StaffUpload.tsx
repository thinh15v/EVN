import React, { useState } from 'react';
import { FileUp, History, Clock, Lock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

export const StaffUploadView = ({ report, onUpload }: any) => {
  const [note, setNote] = useState('');
  const myDept = report.departments.find((d: any) => d.id === 'B02'); // Giả định user thuộc Ban KT
  const isLocked = myDept?.locked || report.globalLocked;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{report.name}</h2>
          <p className="text-xs text-gray-500 mt-1 flex items-center"><Clock size={12} className="mr-1"/> Hạn: {report.deadline}</p>
        </div>
        <StatusBadge status={myDept?.status || 'Chưa cập nhật'} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center"><FileUp className="mr-2 text-blue-600" size={18}/> Nộp báo cáo</h3>
        
        {isLocked ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center text-amber-700">
            <Lock size={18} className="mr-3 shrink-0"/>
            <p className="text-sm font-medium">Báo cáo đã bị khóa. Bạn không thể cập nhật thêm.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
              <p className="text-sm text-blue-600 font-bold">Bấm để chọn file Excel/Word</p>
            </div>
            <textarea 
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ghi chú nội dung thay đổi..."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
            <button 
              onClick={() => { onUpload("BC_Update.xlsx", note); setNote(''); }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-lg active:scale-[0.98] transition-all"
            >
              Gửi báo cáo ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};