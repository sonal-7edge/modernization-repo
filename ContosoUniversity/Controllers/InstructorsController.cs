using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ContosoUniversity.Data;
using ContosoUniversity.Models.MongoModels;
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InstructorsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly ICounterService _counterService;

    public InstructorsController(MongoDbContext context, ICounterService counterService)
    {
        _context = context;
        _counterService = counterService;
    }

    [HttpGet]
    public async Task<ActionResult<InstructorListResponse>> GetInstructors()
    {
        var instructors = await _context.Instructors.Find(_ => true).ToListAsync();
        var courses = await _context.Courses.Find(_ => true).ToListAsync();
        var departments = await _context.Departments.Find(_ => true).ToListAsync();

        var instructorDtos = instructors.Select(i =>
        {
            var instructorCourses = courses.Where(c => c.InstructorIds.Contains(i.InstructorId)).ToList();
            var courseDtos = instructorCourses.Select(c =>
            {
                var department = departments.FirstOrDefault(d => d.DepartmentId == c.DepartmentId);
                return new CourseDto
                {
                    CourseID = c.CourseId,
                    Title = c.Title,
                    Credits = c.Credits,
                    DepartmentID = c.DepartmentId,
                    DepartmentName = department?.Name ?? "Unknown"
                };
            }).ToList();

            return new InstructorDto
            {
                ID = i.InstructorId,
                LastName = i.LastName,
                FirstMidName = i.FirstMidName,
                HireDate = i.HireDate,
                FullName = i.FullName,
                OfficeLocation = i.OfficeLocation,
                Courses = courseDtos
            };
        }).ToList();

        return Ok(new InstructorListResponse { Instructors = instructorDtos });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InstructorDto>> GetInstructor(int id)
    {
        var instructor = await _context.Instructors
            .Find(i => i.InstructorId == id)
            .FirstOrDefaultAsync();

        if (instructor == null)
        {
            return NotFound();
        }

        var courses = await _context.Courses
            .Find(c => c.InstructorIds.Contains(instructor.InstructorId))
            .ToListAsync();

        var departments = await _context.Departments.Find(_ => true).ToListAsync();

        var courseDtos = courses.Select(c =>
        {
            var department = departments.FirstOrDefault(d => d.DepartmentId == c.DepartmentId);
            return new CourseDto
            {
                CourseID = c.CourseId,
                Title = c.Title,
                Credits = c.Credits,
                DepartmentID = c.DepartmentId,
                DepartmentName = department?.Name ?? "Unknown"
            };
        }).ToList();

        var instructorDto = new InstructorDto
        {
            ID = instructor.InstructorId,
            LastName = instructor.LastName,
            FirstMidName = instructor.FirstMidName,
            HireDate = instructor.HireDate,
            FullName = instructor.FullName,
            OfficeLocation = instructor.OfficeLocation,
            Courses = courseDtos
        };

        return Ok(instructorDto);
    }

    [HttpPost]
    public async Task<ActionResult<InstructorDto>> CreateInstructor(CreateInstructorDto createDto)
    {
        var instructor = new Instructor
        {
            InstructorId = await _counterService.GetNextSequenceValueAsync("instructor"),
            LastName = createDto.LastName,
            FirstMidName = createDto.FirstMidName,
            HireDate = createDto.HireDate,
            OfficeLocation = createDto.OfficeLocation
        };

        await _context.Instructors.InsertOneAsync(instructor);

        var result = await GetInstructor(instructor.InstructorId);
        return CreatedAtAction(nameof(GetInstructor), new { id = instructor.InstructorId }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInstructor(int id, UpdateInstructorDto updateDto)
    {
        if (id != updateDto.ID)
        {
            return BadRequest();
        }

        var existingInstructor = await _context.Instructors
            .Find(i => i.InstructorId == id)
            .FirstOrDefaultAsync();

        if (existingInstructor == null)
        {
            return NotFound();
        }

        existingInstructor.LastName = updateDto.LastName;
        existingInstructor.FirstMidName = updateDto.FirstMidName;
        existingInstructor.HireDate = updateDto.HireDate;
        existingInstructor.OfficeLocation = updateDto.OfficeLocation;

        var result = await _context.Instructors.ReplaceOneAsync(
            i => i.InstructorId == id,
            existingInstructor
        );

        if (result.MatchedCount == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInstructor(int id)
    {
        // Remove instructor from all courses
        var coursesWithInstructor = await _context.Courses
            .Find(c => c.InstructorIds.Contains(id))
            .ToListAsync();

        foreach (var course in coursesWithInstructor)
        {
            course.InstructorIds.Remove(id);
            await _context.Courses.ReplaceOneAsync(c => c.CourseId == course.CourseId, course);
        }

        // Remove instructor from departments
        var departmentsWithInstructor = await _context.Departments
            .Find(d => d.InstructorId == id)
            .ToListAsync();

        foreach (var department in departmentsWithInstructor)
        {
            department.InstructorId = null;
            department.AdministratorName = null;
            await _context.Departments.ReplaceOneAsync(d => d.DepartmentId == department.DepartmentId, department);
        }

        var result = await _context.Instructors.DeleteOneAsync(i => i.InstructorId == id);

        if (result.DeletedCount == 0)
        {
            return NotFound();
        }

        return NoContent();
    }
}