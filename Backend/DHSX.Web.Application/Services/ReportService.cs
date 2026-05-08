using DHSX.Web.Application.DTOs.Reports;
using DHSX.Web.Application.Interfaces;
using DHSX.Web.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
namespace DHSX.Web.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IOracleDbContext _context;
        private readonly IStorageService _storageService;
        private readonly IEmailService _emailService;
        private readonly IExternalDirectoryService _externalDirectoryService;
        public ReportService(IOracleDbContext context, IStorageService storageService, IEmailService emailService, IExternalDirectoryService externalDirectoryService)
        {
            _context = context;
            _storageService = storageService;
            _emailService = emailService;
            _externalDirectoryService = externalDirectoryService;
        }

        public async Task<IEnumerable<DeptReportListDto>> GetReportsByDeptAsync(int deptId)
        {
            // Tìm các báo cáo có phân công cho DeptId này
            var reports = await _context.ReportAssignments
                .Include(a => a.Report) // Join ngược lên bảng Report
                .Where(a => a.DeptId == deptId)
                .OrderByDescending(a => a.Report.CreatedAt)
                .Select(a => new DeptReportListDto
                {
                    ReportId = (int)a.ReportId,
                    ReportCode = a.Report.ReportCode,
                    ReportName = a.Report.ReportName,
                    Deadline = (DateTime)a.Report.Deadline, // Ép kiểu nếu Deadline trong DB có thể null
                    AssignmentId = (int)a.AssignmentId,
                    AssignStatus = a.AssignStatus,
                    IsLocked = (bool)(a.IsLocked ?? false)
                })
                .ToListAsync();

            return reports;
        }

        public async Task<bool> UploadFinalFileAsync(int reportId, IFormFile file)
        {
            // 1. Upload lên MinIO vào thư mục riêng của Admin
            string folder = $"report_{reportId}/final_summaries";
            string path = await _storageService.UploadFileAsync(file, folder);

            // 2. Lưu vào bảng REPORT_FINAL_FILES
            var finalFile = new ReportFinalFile
            {
                ReportId = (decimal)reportId,
                FileName = file.FileName,
                FilePath = path,
                UploadedAt = DateTime.Now
            };

            _context.ReportFinalFiles.Add(finalFile);

            // 3. (Tùy chọn) Cập nhật trạng thái Global của Báo cáo thành "Hoàn tất" 
            // nếu Admin đã bắt đầu upload file tổng hợp.

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteFinalFileAsync(int fileId)
        {
            var file = await _context.ReportFinalFiles.FindAsync((decimal)fileId);
            if (file == null) return false;

            // Lưu ý: Trong thực tế nên xóa cả file trên MinIO ở đây
            _context.ReportFinalFiles.Remove(file);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnlockAssignmentAsync(UnlockAssignmentDto request)
        {
            var assignment = await _context.ReportAssignments.FindAsync((decimal)request.AssignmentId);
            if (assignment == null) throw new Exception("Không tìm thấy phân công.");

            assignment.IsLocked = false;
            assignment.AssignStatus = "Đã cập nhật"; // Cho phép cập nhật lại

            // Ghi log Timeline
            var timeline = new ReportTimeline
            {
                ReportId = assignment.ReportId,
                DeptId = assignment.DeptId,
                UserId = (decimal)request.UserId,
                ActionType = "UNLOCK",
                ActionDetail = $"Admin mở khóa để Ban cập nhật lại. Lý do: {request.Reason}",
                ActionTime = DateTime.Now,
                UserFullname = request.UserFullName,
                UserPosition = request.UserPosition,
                UserDeptName = request.UserDeptName
            };

            _context.ReportTimelines.Add(timeline);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CreateReportAsync(CreateReportRequestDto request)
        {
            // Bắt đầu một Transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Lưu vào bảng REPORTS
                // Sinh mã báo cáo tự động (Vd: REP20261025xxxx)
                string generatedCode = "REP" + DateTime.Now.ToString("yyyyMMddHHmmss");

                var report = new Report
                {
                    ReportCode = generatedCode,
                    ReportType = request.ReportType,
                    ReportName = request.ReportName,
                    Deadline = request.Deadline,
                    GlobalStatus = "Đã phân công",
                    CreatedBy = (decimal)request.CreatedByUserId, // Ép kiểu tùy thuộc vào Entity sinh ra
                    CreatedAt = DateTime.Now
                };

                _context.Reports.Add(report);
                await _context.SaveChangesAsync(); // Lưu để lấy ReportId sinh ra từ DB

                // 2. Lưu vào bảng REPORT_ASSIGNMENTS (Phân công cho các Ban)
                foreach (var deptId in request.DepartmentIds)
                {
                    var assignment = new ReportAssignment
                    {
                        ReportId = report.ReportId,
                        DeptId = (decimal)deptId,
                        AssignStatus = "Chưa cập nhật",
                        IsLocked = false
                    };
                    _context.ReportAssignments.Add(assignment);
                }

                // 3. Lưu vào bảng REPORT_TIMELINE (Ghi nhận lịch sử)
                var timeline = new ReportTimeline
                {
                    ReportId = report.ReportId,
                    UserId = (decimal)request.CreatedByUserId,
                    ActionType = "CREATE",
                    ActionDetail = $"Khởi tạo đợt báo cáo và phân công cho {request.DepartmentIds.Count} Ban.",
                    ActionTime = DateTime.Now
                };
                _context.ReportTimelines.Add(timeline);

                // Lưu tất cả Assignment và Timeline
                await _context.SaveChangesAsync();

                // Xác nhận thành công (Commit Transaction)
                await transaction.CommitAsync();

                // === TÍCH HỢP GỬI MAIL VỚI API NGOÀI ===
                foreach (var deptId in request.DepartmentIds)
                {
                    // 1. Gọi API ngoài lấy danh sách Email của Ban
                    var emails = await _externalDirectoryService.GetEmailsByDeptIdAsync(deptId);

                    // 2. Nếu có email, tiến hành gửi
                    if (emails != null && emails.Count > 0)
                    {
                        string subject = $"[ĐHSX] Có đợt báo cáo mới: {request.ReportName}";
                        string body = $"Kính gửi Lãnh đạo Ban,<br/>Ban của bạn vừa được phân công cập nhật báo cáo <b>{request.ReportName}</b>.<br/>Hạn chót: {request.Deadline:dd/MM/yyyy HH:mm}. Vui lòng đăng nhập hệ thống để chỉ đạo thực hiện.";

                        // Lặp qua từng email để gửi (mỗi người 1 mail riêng biệt)
                        foreach (var email in emails)
                        {
                            if (!string.IsNullOrWhiteSpace(email))
                            {
                                await _emailService.SendEmailAsync(email, subject, body);
                            }
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                // Nếu có bất kỳ lỗi nào, hủy bỏ toàn bộ thao tác (Rollback)
                await transaction.RollbackAsync();

                // (Tùy chọn) Ghi log lỗi ra file ở đây
                throw new Exception("Lỗi khi tạo báo cáo: " + ex.Message);
            }
        }

        public async Task<bool> UploadReportFileAsync(UploadReportFileDto request)
        {
            // 1. Kiểm tra xem Ban này có được phân công báo cáo này không
            var assignment = await _context.ReportAssignments
                .FirstOrDefaultAsync(a => a.ReportId == request.ReportId && a.DeptId == request.DeptId);

            if (assignment == null) throw new Exception("Phòng ban của bạn không được phân công báo cáo này.");
            if ((bool)assignment.IsLocked) throw new Exception("Báo cáo này đã bị Lãnh đạo khóa, không thể cập nhật thêm.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 2. Upload file lên MinIO
                string folderPrefix = $"report_{request.ReportId}/dept_{request.DeptId}";
                string savedFilePath = await _storageService.UploadFileAsync(request.File, folderPrefix);

                // 3. Tính toán Version Number (Lần thứ mấy)
                int currentVersionsCount = await _context.ReportVersions
                    .CountAsync(v => v.AssignmentId == assignment.AssignmentId);
                int newVersionNumber = currentVersionsCount + 1;

                // 4. Lưu thông tin file vào REPORT_VERSIONS
                var version = new ReportVersion
                {
                    AssignmentId = assignment.AssignmentId,
                    VersionNumber = (decimal)newVersionNumber,
                    FileName = request.File.FileName,
                    FilePath = savedFilePath,
                    Note = request.Note,
                    IsSelected = false,
                    UploadedBy = (decimal)request.UserId,
                    UploadedAt = DateTime.Now
                };
                _context.ReportVersions.Add(version);

                // 5. Cập nhật trạng thái của bảng ASSIGNMENTS
                assignment.AssignStatus = "Đã cập nhật";
                _context.ReportAssignments.Update(assignment);

                // 6. Ghi log Timeline
                var timeline = new ReportTimeline
                {
                    ReportId = (decimal)request.ReportId,
                    DeptId = (decimal)request.DeptId,
                    UserId = (decimal)request.UserId,
                    ActionType = "UPLOAD",
                    ActionDetail = $"Cập nhật file {request.File.FileName} (Lần {newVersionNumber})",
                    ActionTime = DateTime.Now,
                    UserFullname = request.UserFullName,
                    UserPosition = request.UserPosition,
                    UserDeptName = request.UserDeptName
                };
                _context.ReportTimelines.Add(timeline);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception("Lỗi hệ thống khi cập nhật file: " + ex.Message);
            }
        }

        public async Task<IEnumerable<ReportListDto>> GetReportsAsync()
        {
            // Lấy tất cả báo cáo, sắp xếp mới nhất lên đầu
            // Lệnh Include giúp tự động Join với bảng ReportAssignments
            var reports = await _context.Reports
                .Include(r => r.ReportAssignments)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            // Map sang DTO để trả về Frontend
            var result = reports.Select(r => new ReportListDto
            {
                ReportId = (int)r.ReportId,
                ReportCode = r.ReportCode,
                ReportType = r.ReportType,
                ReportName = r.ReportName,
                Deadline = r.Deadline,
                GlobalStatus = r.GlobalStatus,

                // Đếm tổng số Ban được phân công
                TotalAssigned = r.ReportAssignments?.Count ?? 0,

                // Đếm số Ban đã hoàn thành (Điều kiện là Lãnh đạo đã khóa: IsLocked == 1)
                TotalCompleted = r.ReportAssignments?.Count(a => a.IsLocked == true) ?? 0
            });

            return result;
        }

        public async Task<ReportTimelineDto> GetReportTimelineAsync(int reportId)
        {
            var report = await _context.Reports.FindAsync((decimal)reportId);
            if (report == null) return null;

            // Truy vấn KHÔNG có join với bảng Users
            var query = from t in _context.ReportTimelines
                        where t.ReportId == reportId

                        // Vẫn Left Join với bảng Departments để lấy tên Ban
                        join d in _context.Departments on t.DeptId equals d.DeptId into deptGroup
                        from d in deptGroup.DefaultIfEmpty()

                        orderby t.ActionTime descending

                        select new TimelineEventDto
                        {
                            TimelineId = (int)t.TimelineId,
                            ActionType = t.ActionType,
                            ActionDetail = t.ActionDetail,
                            ActionTime = t.ActionTime ?? DateTime.Now,
                            FullName = t.UserFullname,     // Lấy trực tiếp từ bảng Timeline
                            Position = t.UserPosition,     // Lấy trực tiếp từ bảng Timeline
                            DeptName = t.UserDeptName      // Lấy trực tiếp từ bảng Timeline
                        };

            var events = await query.ToListAsync();

            return new ReportTimelineDto
            {
                ReportId = (int)report.ReportId,
                ReportName = report.ReportName,
                GlobalStatus = report.GlobalStatus,
                Events = events
            };
        }

       public async Task<bool> ApproveAndLockReportAsync(ApproveReportDto request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Lấy thông tin phân công và kiểm tra tồn tại
            // Ép kiểu (decimal) nếu cột trong DB của bạn là Decimal
            var assignment = await _context.ReportAssignments
                .FirstOrDefaultAsync(a => a.AssignmentId == (decimal)request.AssignmentId);

            if (assignment == null) 
                throw new Exception($"Không tìm thấy thông tin phân công với ID: {request.AssignmentId}");

            if (assignment.IsLocked == true) 
                throw new Exception("Báo cáo này đã được lãnh đạo phê duyệt và khóa từ trước.");

            // 2. Kiểm tra trực tiếp xem file được chọn có tồn tại và thuộc về Assignment này không
            var selectedVersion = await _context.ReportVersions
                .FirstOrDefaultAsync(v => v.VersionId == request.SelectedVersionId && v.AssignmentId == (decimal)request.AssignmentId);

            if (selectedVersion == null)
                throw new Exception($"Không tìm thấy phiên bản file (ID: {request.SelectedVersionId}) thuộc về đợt phân công này.");

            // 3. Cập nhật trạng thái cho tất cả các phiên bản của Assignment này
            var allVersions = await _context.ReportVersions
                .Where(v => v.AssignmentId == (decimal)request.AssignmentId)
                .ToListAsync();

            foreach (var version in allVersions)
            {
                // Nếu là bản được chọn thì gán true, các bản cũ hơn gán false
                if (version.VersionId == request.SelectedVersionId)
                {
                    version.IsSelected = true; 
                }
                else
                {
                    version.IsSelected = false; // QUAN TRỌNG: Phải là false để bỏ chọn bản cũ
                }
            }

            // 4. Cập nhật trạng thái Assignment
            assignment.IsLocked = true;
            assignment.AssignStatus = "Đã xác nhận";
            assignment.ConfirmedBy = (decimal)request.UserId;
            assignment.ConfirmedAt = DateTime.Now;

            // 5. Ghi log Timeline
            var timeline = new ReportTimeline
            {
                ReportId = assignment.ReportId,
                DeptId = assignment.DeptId,
                UserId = (decimal)request.UserId,
                ActionType = "CONFIRM",
                ActionDetail = $"Lãnh đạo đã phê duyệt bản báo cáo (ID File: {request.SelectedVersionId}).",
                ActionTime = DateTime.Now,
                UserFullname = request.UserFullName,
                UserPosition = request.UserPosition,
                UserDeptName = request.UserDeptName
            };
            _context.ReportTimelines.Add(timeline);

            // 6. Lưu và Commit giao dịch
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return true;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            // Ném lỗi về Controller để trả về Bad Request kèm Message chi tiết
            throw new Exception(ex.Message);
        }
    }
        public async Task<object> GetReportDetailForAdminAsync(int reportId)
        {
            var report = await _context.Reports.FindAsync((decimal)reportId);
            if (report == null) throw new Exception("Không tìm thấy báo cáo này.");

            // 1. Kéo dữ liệu thô từ Database lên RAM trước (Tránh lỗi dịch SQL của Oracle)
            var assignmentsDb = await _context.ReportAssignments
                .Where(a => a.ReportId == reportId)
                .ToListAsync();

            var deptIds = assignmentsDb.Select(a => a.DeptId).Distinct().ToList();
            var departments = await _context.Departments
                .Where(d => deptIds.Contains(d.DeptId))
                .ToListAsync();

            var assignmentIds = assignmentsDb.Select(a => a.AssignmentId).ToList();
            var versionsDb = await _context.ReportVersions
                .Where(v => assignmentIds.Contains(v.AssignmentId))
                .ToListAsync();

            // 2. Lắp ghép dữ liệu bằng C# (Tuyệt đối an toàn)
            var assignments = assignmentsDb.Select(a => new
            {
                AssignmentId = a.AssignmentId,
                DeptName = departments.FirstOrDefault(d => d.DeptId == a.DeptId)?.DeptName ?? "Không rõ",
                AssignStatus = a.AssignStatus,
                IsLocked = a.IsLocked == true, // Ép kiểu an toàn trên C#
                
                Files = versionsDb
                        .Where(v => v.AssignmentId == a.AssignmentId)
                        .OrderByDescending(v => v.VersionNumber)
                        .Select(v => new
                        {
                            VersionId = v.VersionId,
                            FileName = v.FileName,
                            Version = v.VersionNumber,
                            IsFinal = v.IsSelected == true, // Ép kiểu an toàn trên C#
                            Notes = v.Note,
                            UploadedAt = v.UploadedAt
                        }).ToList()
            }).ToList();

            return new
            {
                Report = new 
                { 
                    ReportName = report.ReportName, 
                    ReportCode = report.ReportCode, 
                    GlobalStatus = report.GlobalStatus,
                    Deadline = report.Deadline
                },
                Assignments = assignments
            };
        }

        public async Task<bool> LockAllAssignmentsAsync(int reportId)
        {
            // Tìm tất cả các assignment của báo cáo này chưa bị khóa
            var assignments = await _context.ReportAssignments
                .Where(a => a.ReportId == (decimal)reportId && (a.IsLocked == false || a.IsLocked == null))
                .ToListAsync();

            if (assignments.Any())
            {
                foreach (var assign in assignments)
                {
                    assign.IsLocked = true;
                    // Tùy chọn: Có thể đổi AssignStatus thành "Đã khóa" hoặc giữ nguyên
                }

                // Ghi log Timeline
                var timeline = new ReportTimeline
                {
                    ReportId = (decimal)reportId,
                    UserId = 1, // LƯU Ý: Chỗ này truyền tạm UserId của Admin, bạn có thể truyền từ Controller xuống sau
                    UserFullname = "Admin", // Tạm thời ghi cứng, nên truyền từ Controller xuống
                    UserPosition = "Quản trị viên", // Tạm thời ghi cứng, nên truyền từ Controller xuống
                    UserDeptName = "Bộ phận Admin", // Tạm thời ghi cứng, nên truyền từ Controller xuống
                    ActionType = "LOCK_ALL",
                    ActionDetail = $"Admin đã khóa toàn bộ ({assignments.Count}) Ban, không cho phép cập nhật thêm file.",
                    ActionTime = DateTime.Now
                };
                
                _context.ReportTimelines.Add(timeline);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<IEnumerable<ReportVersionDto>> GetReportVersionsAsync(int reportId, int deptId)
        {
            // 1. Tìm AssignmentId tương ứng với Ban và Báo cáo này
            var assignment = await _context.ReportAssignments
                .FirstOrDefaultAsync(a => a.ReportId == reportId && a.DeptId == deptId);

            if (assignment == null) return new List<ReportVersionDto>();

            // 2. LẤY DỮ LIỆU THÔ LÊN RAM TRƯỚC (QUAN TRỌNG: Gọi ToListAsync ở đây)
            var versionsDb = await _context.ReportVersions
                .Where(v => v.AssignmentId == assignment.AssignmentId)
                .OrderByDescending(v => v.VersionNumber) 
                .ToListAsync(); // <-- Oracle chỉ lấy data, không dịch Boolean

            // 3. MAP SANG DTO BẰNG C# (An toàn tuyệt đối)
            var versions = versionsDb.Select(v => new ReportVersionDto
            {
                VersionId = (int)v.VersionId,
                VersionNumber = (int)v.VersionNumber,
                AssignmentId = (int)v.AssignmentId,
                FileName = v.FileName,
                FilePath = v.FilePath,
                Note = v.Note,
                UploadedAt = v.UploadedAt ?? DateTime.Now,
                IsSelected = v.IsSelected == true, // C# tự xử lý cái này, Oracle không cằn nhằn nữa
                UploadedBy = (int)v.UploadedBy
            }).ToList();

            return versions;
        }

        public async Task<bool> UpdateAssignmentsAsync(int reportId, List<int> departmentIds)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Lấy danh sách các Ban ĐÃ ĐƯỢC PHÂN CÔNG hiện tại trong DB
                var existingAssignments = await _context.ReportAssignments
                    .Where(a => a.ReportId == (decimal)reportId)
                    .ToListAsync();

                var existingDeptIds = existingAssignments.Select(a => (int)a.DeptId).ToList();

                // Lọc ra các Ban CẦN THÊM MỚI và CẦN XÓA BỎ
                var deptsToAdd = departmentIds.Except(existingDeptIds).ToList();
                var deptsToRemove = existingDeptIds.Except(departmentIds).ToList();


                // 1. Xử lý XÓA Ban
                if (deptsToRemove.Any())
                {
                    // Lấy danh sách cần xóa từ danh sách đã load lên RAM (existingAssignments)
                    // Việc lọc trên RAM (C#) sẽ dùng giá trị true/false chuẩn, không gây lỗi SQL
                    var assignmentsToRemove = existingAssignments
                        .Where(a => deptsToRemove.Contains((int)a.DeptId))
                        .ToList();

                    if (assignmentsToRemove.Any())
                    {
                        var assignIdsToRemove = assignmentsToRemove.Select(a => a.AssignmentId).ToList();
                        
                        // Kiểm tra xem có file nộp chưa
                        bool hasFiles = await _context.ReportVersions
                            .AnyAsync(v => assignIdsToRemove.Contains(v.AssignmentId));
                        
                        if (hasFiles)
                        {
                            throw new Exception("Không thể gỡ phân công các Ban ĐÃ TẢI LÊN file báo cáo.");
                        }

                        // Lệnh này sẽ xóa dựa trên Primary Key (ID), Oracle sẽ hiểu 100%
                        _context.ReportAssignments.RemoveRange(assignmentsToRemove);
                    }
                }

                // 2. Xử lý THÊM Ban mới
                if (deptsToAdd.Any())
                {
                    foreach (var deptId in deptsToAdd)
                    {
                        var newAssignment = new ReportAssignment
                        {
                            ReportId = (decimal)reportId,
                            DeptId = (decimal)deptId,
                            AssignStatus = "Chưa cập nhật",
                            IsLocked = false
                        };
                        _context.ReportAssignments.Add(newAssignment);
                    }
                }

                // TẠM THỜI COMMENT ĐOẠN NÀY LẠI TRÁNH LỖI KHÓA NGOẠI USER_ID = 1
                
                if (deptsToAdd.Any() || deptsToRemove.Any())
                {
                    var timeline = new ReportTimeline
                    {
                        ReportId = (decimal)reportId,
                        UserId = 1, // Lỗi 99% nằm ở đây do Database không có User 1
                        ActionType = "UPDATE_ASSIGNMENT",
                        ActionDetail = $"Admin đã cập nhật phân công: Thêm {deptsToAdd.Count} Ban, Gỡ {deptsToRemove.Count} Ban.",
                        ActionTime = DateTime.Now
                    };
                    _context.ReportTimelines.Add(timeline);
                }
                

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                
                // Nâng cấp: Lấy lỗi sâu nhất (InnerException) từ Database nếu có
                string exactError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                
                // Ném lỗi này lên Controller để nó báo về cho Frontend
                throw new Exception(exactError); 
            }
        }
    }
    
}