using DHSX.Web.Application.DTOs.Reports;
using DHSX.Web.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace DHSX.Web.API.Controllers
{

    public class UpdateAssignmentsDto
    {
        public List<int> DepartmentIds { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IOracleDbContext _context;
        private readonly IStorageService _storageService;
        public ReportsController(IReportService reportService, IOracleDbContext context, IStorageService storageService)
        {
            _reportService = reportService;
            _context = context;
            _storageService = storageService;
        }

        [HttpGet("dept/{deptId}")]
        public async Task<IActionResult> GetReportsByDept(int deptId)
        {
            try
            {
                var data = await _reportService.GetReportsByDeptAsync(deptId);
                return Ok(new { success = true, data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("download-link")]
        public async Task<IActionResult> GetDownloadLink([FromQuery] string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return BadRequest(new { success = false, message = "Đường dẫn file không hợp lệ." });

                string url = await _storageService.GetPresignedUrlAsync(filePath);
                return Ok(new { success = true, downloadUrl = url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // 1. Mở khóa cho một Ban
        [HttpPost("unlock")]
        public async Task<IActionResult> Unlock([FromBody] UnlockAssignmentDto request)
        {
            await _reportService.UnlockAssignmentAsync(request);
            return Ok(new { success = true, message = "Đã mở khóa thành công." });
        }

        // 2. Admin upload file tổng hợp
        [HttpPost("{id}/final-files")]
        public async Task<IActionResult> UploadFinal(int id, IFormFile file)
        {
            try
            {
                Console.WriteLine($"[INFO] UploadFinal endpoint called: ReportId={id}");
                Console.WriteLine($"[INFO] File info: FileName={file?.FileName}, FileLength={file?.Length}");
                
                // Xác thực file
                if (file == null || file.Length == 0)
                {
                    Console.WriteLine($"[ERROR] File is null or empty!");
                    return BadRequest(new { success = false, message = "Tệp không hợp lệ. Vui lòng chọn một tệp." });
                }

                // Kiểm tra kích thước file (giới hạn 50MB)
                long maxFileSize = 50 * 1024 * 1024; // 50MB
                if (file.Length > maxFileSize)
                {
                    Console.WriteLine($"[ERROR] File size {file.Length} exceeds max {maxFileSize}!");
                    return BadRequest(new { success = false, message = "Kích thước tệp vượt quá 50MB." });
                }

                // Kiểm tra loại file được phép
                var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    Console.WriteLine($"[ERROR] File extension {fileExtension} not allowed!");
                    return BadRequest(new { success = false, message = $"Định dạng tệp '{fileExtension}' không được phép. Các định dạng cho phép: {string.Join(", ", allowedExtensions)}" });
                }

                Console.WriteLine($"[INFO] File validation passed. Starting upload...");
                await _reportService.UploadFinalFileAsync(id, file);
                Console.WriteLine($"[INFO] File uploaded successfully!");
                
                return Ok(new { success = true, message = "Tải lên file tổng hợp thành công." });
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"[ERROR] ArgumentException: {ex.Message}");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Upload file final: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { success = false, message = $"Lỗi khi tải lên tệp: {ex.Message}" });
            }
        }

        // 3. Lấy danh sách file tổng hợp để Admin xem/xóa
        [HttpGet("{id}/final-files")]
        public async Task<IActionResult> GetFinalFiles(int id)
        {
            var files = await _context.ReportFinalFiles
                .Where(f => f.ReportId == id)
                .ToListAsync();
            return Ok(new { success = true, data = files });
        }

        // 4. Xóa file tổng hợp
        [HttpDelete("final-files/{fileId}")]
        public async Task<IActionResult> DeleteFinal(int fileId)
        {
            await _reportService.DeleteFinalFileAsync(fileId);
            return Ok(new { success = true, message = "Đã xóa file tổng hợp." });
        }

        [HttpPost("approve")]
        public async Task<IActionResult> ApproveReport([FromBody] ApproveReportDto request)
        {
            try
            {
                var result = await _reportService.ApproveAndLockReportAsync(request);
                return Ok(new { success = true, message = "Đã phê duyệt và khóa báo cáo thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}/timeline")]
        public async Task<IActionResult> GetReportTimeline(int id)
        {
            try
            {
                var data = await _reportService.GetReportTimelineAsync(id);

                if (data == null)
                    return NotFound(new { success = false, message = "Không tìm thấy báo cáo này." });

                return Ok(new { success = true, data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy lịch sử báo cáo: " + ex.Message });
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetReports()
        {
            try
            {
                var data = await _reportService.GetReportsAsync();
                return Ok(new { success = true, data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách: " + ex.Message });
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportRequestDto request)
        {
            try
            {
                // Kiểm tra sơ bộ dữ liệu đầu vào
                if (request.DepartmentIds == null || request.DepartmentIds.Count == 0)
                {
                    return BadRequest(new { success = false, message = "Phải chọn ít nhất 1 Ban để phân công." });
                }

                var result = await _reportService.CreateReportAsync(request);

                // GỌI API GỬI EMAIL Ở ĐÂY (Chúng ta sẽ tích hợp sau)

                return Ok(new { success = true, message = "Khởi tạo đợt báo cáo thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpPost("upload")]
        // Sử dụng [FromForm] thay vì [FromBody] vì chúng ta đang nhận file (multipart/form-data)
        public async Task<IActionResult> UploadReportFile([FromForm] UploadReportFileDto request)
        {
            try
            {
                Console.WriteLine($"[INFO] UploadReportFile endpoint called: ReportId={request.ReportId}, DeptId={request.DeptId}");
                Console.WriteLine($"[INFO] File info: FileName={request.File?.FileName}, FileLength={request.File?.Length}");

                // Xác thực file
                if (request.File == null || request.File.Length == 0)
                {
                    Console.WriteLine($"[ERROR] File is null or empty!");
                    return BadRequest(new { success = false, message = "Vui lòng đính kèm file báo cáo." });
                }

                // Kiểm tra kích thước file (giới hạn 50MB)
                long maxFileSize = 50 * 1024 * 1024; // 50MB
                if (request.File.Length > maxFileSize)
                {
                    Console.WriteLine($"[ERROR] File size {request.File.Length} exceeds max {maxFileSize}!");
                    return BadRequest(new { success = false, message = "Kích thước tệp vượt quá 50MB." });
                }

                // Kiểm tra loại file được phép
                var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv" };
                var fileExtension = Path.GetExtension(request.File.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    Console.WriteLine($"[ERROR] File extension {fileExtension} not allowed!");
                    return BadRequest(new { success = false, message = $"Định dạng tệp '{fileExtension}' không được phép. Các định dạng cho phép: {string.Join(", ", allowedExtensions)}" });
                }

                Console.WriteLine($"[INFO] File validation passed. Starting upload...");
                var result = await _reportService.UploadReportFileAsync(request);
                Console.WriteLine($"[INFO] Report file uploaded successfully!");

                return Ok(new { success = true, message = "Cập nhật file báo cáo thành công!" });
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"[ERROR] ArgumentException: {ex.Message}");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Upload report file: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { success = false, message = $"Lỗi khi tải lên tệp: {ex.Message}" });
            }
        }
// api mới
        [HttpGet("{id}/detail")]
        public async Task<IActionResult> GetReportDetail(int id)
        {
            try
            {
                var data = await _reportService.GetReportDetailForAdminAsync(id);
                return Ok(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy chi tiết: " + ex.Message });
            }
        }

        [HttpPut("{id}/lock-all")]
        public async Task<IActionResult> LockAllAssignments(int id)
        {
            try
            {
                await _reportService.LockAllAssignmentsAsync(id);
                return Ok(new { success = true, message = "Đã khóa toàn bộ báo cáo thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi khóa toàn bộ: " + ex.Message });
            }
        }

        [HttpGet("{reportId}/versions/{deptId}")]
        public async Task<IActionResult> GetVersions(int reportId, int deptId)
        {
            var res = await _reportService.GetReportVersionsAsync(reportId, deptId);
            return Ok(new { success = true, data = res });
        }


        [HttpPut("{id}/assignments")]
        public async Task<IActionResult> UpdateAssignments(int id, [FromBody] UpdateAssignmentsDto request)
        {
            try
            {
                if (request.DepartmentIds == null || request.DepartmentIds.Count == 0)
                {
                    return BadRequest(new { success = false, message = "Phải chọn ít nhất 1 Ban để phân công." });
                }

                await _reportService.UpdateAssignmentsAsync(id, request.DepartmentIds);
                
                return Ok(new { success = true, message = "Cập nhật phân công thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật phân công: " + ex.Message });
            }
        }
        
    }
}