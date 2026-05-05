// File: ReportTimelineDto.cs
using System;
using System.Collections.Generic;

namespace DHSX.Web.Application.DTOs.Reports
{
    // DTO đại diện cho 1 sự kiện (1 dòng trên cây timeline)
    public class TimelineEventDto
    {
        public int TimelineId { get; set; }
        public string ActionType { get; set; }
        public string ActionDetail { get; set; }
        public DateTime ActionTime { get; set; }

        public string FullName { get; set; }
        public string Position { get; set; }
        public string DeptName { get; set; }
    }

    // DTO bọc toàn bộ dữ liệu trả về cho 1 báo cáo
    public class ReportTimelineDto
    {
        public int ReportId { get; set; }
        public string ReportName { get; set; }
        public string GlobalStatus { get; set; }
        public List<TimelineEventDto> Events { get; set; }
    }
}