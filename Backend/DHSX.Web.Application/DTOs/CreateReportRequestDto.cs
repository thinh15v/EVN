using System;
using System.Collections.Generic;

namespace DHSX.Web.Application.DTOs.Reports
{
    public class CreateReportRequestDto
    {
        public string ReportType { get; set; } // Vd: EVN, EVNHCMC
        public string ReportName { get; set; }
        public DateTime Deadline { get; set; }

        // Danh sách ID của các Ban được phân công
        public List<int> DepartmentIds { get; set; }

        // ID của người tạo (Tạm thời truyền từ Frontend, sau này sẽ lấy tự động từ Token)
        public int CreatedByUserId { get; set; }
    }
}