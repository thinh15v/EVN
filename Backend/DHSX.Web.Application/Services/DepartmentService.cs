using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DHSX.Web.Application.DTOs.Departments; 
using DHSX.Web.Domain.Entities;
using DHSX.Web.Application.Interfaces;

namespace DHSX.Web.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IOracleDbContext _context;

        public DepartmentService(IOracleDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepartmentResponseDto>> GetAllAsync()
        {
            var depts = await _context.Departments.ToListAsync();
            return depts.Select(d => new DepartmentResponseDto
            {
                // Ép kiểu (int) ở đây
                DeptId = (int)d.DeptId,
                DeptCode = d.DeptCode,
                DeptName = d.DeptName,
                Description = d.Description
            });
        }

        public async Task<DepartmentResponseDto> GetByIdAsync(int id)
        {
            // FindAsync yêu cầu truyền đúng kiểu dữ liệu của Primary Key (decimal)
            var dept = await _context.Departments.FindAsync((decimal)id);
            if (dept == null) return null;

            return new DepartmentResponseDto
            {
                DeptId = (int)dept.DeptId,
                DeptCode = dept.DeptCode,
                DeptName = dept.DeptName,
                Description = dept.Description
            };
        }

        public async Task<DepartmentResponseDto> CreateAsync(DepartmentRequestDto request)
        {
            var dept = new Department
            {
                DeptCode = request.DeptCode,
                DeptName = request.DeptName,
                Description = request.Description
            };

            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();

            return new DepartmentResponseDto
            {
                DeptId = (int)dept.DeptId,
                DeptCode = dept.DeptCode,
                DeptName = dept.DeptName,
                Description = dept.Description
            };
        }

        public async Task<bool> UpdateAsync(int id, DepartmentRequestDto request)
        {
            var dept = await _context.Departments.FindAsync((decimal)id);
            if (dept == null) return false;

            dept.DeptCode = request.DeptCode;
            dept.DeptName = request.DeptName;
            dept.Description = request.Description;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var dept = await _context.Departments.FindAsync((decimal)id);
            if (dept == null) return false;

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}