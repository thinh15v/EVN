// File: IDepartmentService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using DHSX.Web.Application.DTOs.Departments;

namespace DHSX.Web.Application.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentResponseDto>> GetAllAsync();
        Task<DepartmentResponseDto> GetByIdAsync(int id);
        Task<DepartmentResponseDto> CreateAsync(DepartmentRequestDto request);
        Task<bool> UpdateAsync(int id, DepartmentRequestDto request);
        Task<bool> DeleteAsync(int id);
    }
}