using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly SchoolContext _context;

    public DepartmentsController(SchoolContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<DepartmentListDto>> GetDepartments()
    {
        var departments = await _context.Departments
            .Include(d => d.Administrator)
            .Select(d => new DepartmentDto
            {
                DepartmentID = d.DepartmentID,
                Name = d.Name,
                Budget = d.Budget,
                StartDate = d.StartDate,
                InstructorID = d.InstructorID,
                AdministratorName = d.Administrator != null ? d.Administrator.FullName : "",
                ConcurrencyToken = d.ConcurrencyToken != null ? Convert.ToBase64String(d.ConcurrencyToken) : ""
            })
            .ToListAsync();

        var result = new DepartmentListDto
        {
            Departments = departments
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
    {
        var department = await _context.Departments
            .Include(d => d.Administrator)
            .FirstOrDefaultAsync(d => d.DepartmentID == id);

        if (department == null)
            return NotFound();

        var departmentDto = new DepartmentDto
        {
            DepartmentID = department.DepartmentID,
            Name = department.Name,
            Budget = department.Budget,
            StartDate = department.StartDate,
            InstructorID = department.InstructorID,
            AdministratorName = department.Administrator?.FullName ?? "",
            ConcurrencyToken = department.ConcurrencyToken != null ? Convert.ToBase64String(department.ConcurrencyToken) : ""
        };

        return Ok(departmentDto);
    }

    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment(CreateDepartmentDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var department = new Department
        {
            Name = createDto.Name,
            Budget = createDto.Budget,
            StartDate = DateTime.SpecifyKind(createDto.StartDate, DateTimeKind.Utc),
            InstructorID = createDto.InstructorID
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        // Reload to get the administrator info
        await _context.Entry(department)
            .Reference(d => d.Administrator)
            .LoadAsync();

        var departmentDto = new DepartmentDto
        {
            DepartmentID = department.DepartmentID,
            Name = department.Name,
            Budget = department.Budget,
            StartDate = department.StartDate,
            InstructorID = department.InstructorID,
            AdministratorName = department.Administrator?.FullName ?? "",
            ConcurrencyToken = department.ConcurrencyToken != null ? Convert.ToBase64String(department.ConcurrencyToken) : ""
        };

        return CreatedAtAction(nameof(GetDepartment), new { id = department.DepartmentID }, departmentDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepartment(int id, UpdateDepartmentDto updateDto)
    {
        if (id != updateDto.DepartmentID)
            return BadRequest();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var department = await _context.Departments.FindAsync(id);
        if (department == null)
            return NotFound();

        // Set original concurrency token for optimistic concurrency
        if (updateDto.ConcurrencyToken != null)
        {
            _context.Entry(department).Property(d => d.ConcurrencyToken)
                .OriginalValue = updateDto.ConcurrencyToken;
        }

        department.Name = updateDto.Name;
        department.Budget = updateDto.Budget;
        department.StartDate = DateTime.SpecifyKind(updateDto.StartDate, DateTimeKind.Utc);
        department.InstructorID = updateDto.InstructorID;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DepartmentExists(id))
                return NotFound();
            
            return Conflict("The record you attempted to edit was modified by another user.");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null)
            return NotFound();

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("instructors")]
    public async Task<ActionResult<List<object>>> GetInstructorsForDropdown()
    {
        var instructors = await _context.Instructors
            .Select(i => new { 
                ID = i.ID, 
                FullName = i.FullName 
            })
            .ToListAsync();

        return Ok(instructors);
    }

    private bool DepartmentExists(int id)
    {
        return _context.Departments.Any(e => e.DepartmentID == id);
    }
}