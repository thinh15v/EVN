// src/constants/mockData.ts
export const ALL_DEPARTMENTS = [
  { id: 'B01', name: 'Ban Kế hoạch' },
  { id: 'B02', name: 'Ban Kỹ thuật' },
  { id: 'B03', name: 'Ban Tài chính' },
  { id: 'B04', name: 'Ban Quản lý dự án' },
];

export const INITIAL_REPORTS = [
  {
    id: 'REP001',
    type: 'EVN',
    name: 'Báo cáo giao ban ĐHSX tháng 5/2026',
    deadline: '2026-05-31 17:00',
    adminStatus: 'Đang thực hiện',
    globalLocked: false,
    departments: [
      {
        id: 'B01',
        name: 'Ban Kế hoạch',
        status: 'Đã xác nhận',
        locked: true,
        confirmTime: '15:00 26/05/2026',
        confirmUser: 'LĐ. Trần Thị C',
        versions: [
          { v: 1, file: 'BC_GiaoBan_KH_v1.xlsx', time: '10:00 25/05/2026', user: 'NV. Nguyễn Văn B', note: 'Gửi bản nháp', selected: false },
          { v: 2, file: 'BC_GiaoBan_KH_final.xlsx', time: '14:30 26/05/2026', user: 'NV. Nguyễn Văn B', note: 'Cập nhật số liệu', selected: true }
        ]
      },
      {
        id: 'B02',
        name: 'Ban Kỹ thuật',
        status: 'Đã cập nhật',
        locked: false,
        versions: [
          { v: 1, file: 'BC_GiaoBan_KT_T05.docx', time: '09:15 27/05/2026', user: 'NV. Trần Thị C', note: 'Báo cáo sự cố', selected: false }
        ]
      }
    ],
    finalFiles: [],
    timeline: [
      { id: 1, time: '09:00 24/05/2026', user: 'Admin: Hệ thống', action: 'Khởi tạo đợt báo cáo', dept: '' }
    ]
  }
];