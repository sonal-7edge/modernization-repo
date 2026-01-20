using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ContosoUniversity.Data;
using ContosoUniversity.Models.MongoModels;
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly ICounterService _counterService;

    public DepartmentsController(MongoDbContext context, ICounterService counterService)
    {
        _context = context;
        _counterService = counterService;
    }

    [HttpGet]
    public async Task<ActionResult<DepartmentListResponse>> GetDepartments()
    {
        var departments = await _context.Departments.Find(_ => true).ToListAsync();
        var instructors = await _context.Instructors.Find(_ => true).ToListAsync();

        var departmentDtos = departments.Select(d =>
        {
            var administrator = instructors.FirstOrDefault(i => i.InstructorId == d.InstructorId);
            return new DepartmentDto
            {
                DepartmentID = d.DepartmentId,
                Name = d.Name,
                Budget = d.Budget,
                StartDate = d.StartDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                InstructorID = d.InstructorId,
                AdministratorName = administrator?.FullName,
                ConcurrencyToken = d.ConcurrencyToken
            };
        }).ToList();

        return Ok(new DepartmentListResponse { Departments = departmentDtos });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
    {
        var department = await _context.Departments
            .Find(d => d.DepartmentId == id)
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return NotFound();
        }

        var administrator = department.InstructorId.HasValue
            ? await _context.Instructors.Find(i => i.InstructorId == department.InstructorId.Value).FirstOrDefaultAsync()
            : null;

        var departmentDto = new DepartmentDto
        {
            DepartmentID = department.DepartmentId,
            Name = department.Name,
            Budget = department.Budget,
            StartDate = department.StartDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            InstructorID = department.InstructorId,
            AdministratorName = administrator?.FullName,
            ConcurrencyToken = department.ConcurrencyToken
        };

        return Ok(departmentDto);
    }

    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment(CreateDepartmentDto createDto)
    {
        var department = new Department
        {
            DepartmentId = await _counterService.GetNextSequenceValueAsync("department"),
            Name = createDto.Name,
            Budget = createDto.Budget,
            StartDate = DateTime.Parse(createDto.StartDate),
            InstructorId = createDto.InstructorID,
            ConcurrencyToken = Guid.NewGuid().ToByteArray()
        };

        // Set administrator name if instructor is provided
        if (createDto.InstructorID.HasValue)
        {
            var instructor = await _context.Instructors
                .Find(i => i.InstructorId == createDto.InstructorID.Value)
                .FirstOrDefaultAsync();
            department.AdministratorName = instructor?.FullName;
        }

        await _context.Departments.InsertOneAsync(department);

        var result = await GetDepartment(department.DepartmentId);
        return CreatedAtAction(nameof(GetDepartment), new { id = department.DepartmentId }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepartment(int id, UpdateDepartmentDto updateDto)
    {
        if (id != updateDto.DepartmentID)
        {
            return BadRequest();
        }

        var existingDepartment = await _context.Departments
            .Find(d => d.DepartmentId == id)
            .FirstOrDefaultAsync();

        if (existingDepartment == null)
        {
            return NotFound();
        }

        // Check concurrency token if provided
        if (updateDto.ConcurrencyToken != null && 
            !existingDepartment.ConcurrencyToken?.SequenceEqual(updateDto.ConcurrencyToken) == true)
        {
            return Conflict("The record has been modified by another user.");
        }

        existingDepartment.Name = updateDto.Name;
        existingDepartment.Budget = updateDto.Budget;
        existingDepartment.StartDate = DateTime.Parse(updateDto.StartDate);
        existingDepartment.InstructorId = updateDto.InstructorID;
        existingDepartment.ConcurrencyToken = Guid.NewGuid().ToByteArray();

        // Update administrator name
        if (updateDto.InstructorID.HasValue)
        {
            var instructor = await _context.Instructors
                .Find(i => i.InstructorId == updateDto.InstructorID.Value)
                .FirstOrDefaultAsync();
            existingDepartment.AdministratorName = instructor?.FullName;
        }
        else
        {
            existingDepartment.AdministratorName = null;
        }

        var result = await _context.Departments.ReplaceOneAsync(
            d => d.DepartmentId == id,
            existingDepartment
        );

        if (result.MatchedCount == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        // Check if department has courses
        var coursesCount = await _context.Courses.CountDocumentsAsync(c => c.DepartmentId == id);
        if (coursesCount > 0)
        {
            return BadRequest("Cannot delete department with existing courses.");
        }

        var result = await _context.Departments.DeleteOneAsync(d => d.DepartmentId == id);

        if (result.DeletedCount == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpGet("instructors")]
    public async Task<ActionResult<List<InstructorSummaryDto>>> GetInstructorsForDropdown()
    {
        var instructors = await _context.Instructors.Find(_ => true).ToListAsync();

        var instructorDtos = instructors.Select(i => new InstructorSummaryDto
        {
            ID = i.InstructorId,
            FullName = i.FullName
        }).OrderBy(i => i.FullName).ToList();

        return Ok(instructorDtos);
    }
}