// src/components/Common/StatusBadge.tsx
import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    'Vừa khởi tạo': 'bg-slate-100 text-slate-700 border-slate-200',
    'Chưa cập nhật': 'bg-red-50 text-red-700 border-red-200',
    'Đang thực hiện': 'bg-amber-50 text-amber-700 border-amber-200',
    'Đã cập nhật': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Đã xác nhận': 'bg-green-50 text-green-700 border-green-200',
    'Hoàn tất': 'bg-emerald-50 text-emerald-800 border-emerald-300',
    'Đã thu thập đủ': 'bg-emerald-50 text-emerald-800 border-emerald-300',
    'Đã hủy phân công': 'bg-slate-200 text-slate-600 border-slate-300',
  };
  
  return (
    <span className={`px-2.5 py-1 inline-flex text-[11px] uppercase tracking-wider font-bold rounded-md border ${map[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};