using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DHSX.Web.Application.DTOs.Departments;
using DHSX.Web.Application.Interfaces;

namespace DHSX.Web.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentsController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _departmentService.GetAllAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _departmentService.GetByIdAsync(id);
            if (data == null) return NotFound(new { success = false, message = "Không tìm thấy Phòng Ban" });
            return Ok(new { success = true, data });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DepartmentRequestDto request)
        {
            var data = await _departmentService.CreateAsync(request);
            return Ok(new { success = true, message = "Tạo mới thành công", data });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DepartmentRequestDto request)
        {
            var success = await _departmentService.UpdateAsync(id, request);
            if (!success) return NotFound(new { success = false, message = "Không tìm thấy Phòng Ban để cập nhật" });
            return Ok(new { success = true, message = "Cập nhật thành công" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _departmentService.DeleteAsync(id);
            if (!success) return NotFound(new { success = false, message = "Không tìm thấy Phòng Ban để xóa" });
            return Ok(new { success = true, message = "Xóa thành công" });
        }
    }
}