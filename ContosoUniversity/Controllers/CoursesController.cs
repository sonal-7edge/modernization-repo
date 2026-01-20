using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContosoUniversity.Data;
using ContosoUniversity.Models;
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly SchoolContext _context;

    public CoursesController(SchoolContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<CourseListResponse>> GetCourses()
    {
        var courses = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Instructors)
            .Include(c => c.Enrollments)
            .Select(c => new CourseDto
            {
                CourseID = c.CourseID,
                Title = c.Title,
                Credits = c.Credits,
                DepartmentID = c.DepartmentID,
                DepartmentName = c.Department.Name,
                EnrollmentCount = c.Enrollments.Count(),
                Instructors = c.Instructors.Select(i => new InstructorSummaryDto
                {
                    ID = i.ID,
                    FullName = i.FullName
                }).ToList()
            })
            .ToListAsync();

        return Ok(new CourseListResponse { Courses = courses });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Instructors)
            .Include(c => c.Enrollments)
            .Where(c => c.CourseID == id)
            .Select(c => new CourseDto
            {
                CourseID = c.CourseID,
                Title = c.Title,
                Credits = c.Credits,
                DepartmentID = c.DepartmentID,
                DepartmentName = c.Department.Name,
                EnrollmentCount = c.Enrollments.Count(),
                Instructors = c.Instructors.Select(i => new InstructorSummaryDto
                {
                    ID = i.ID,
                    FullName = i.FullName
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (course == null)
        {
            return NotFound();
        }

        return Ok(course);
    }

    [HttpPost]
    public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto createDto)
    {
        // Check if course ID already exists
        if (await _context.Courses.AnyAsync(c => c.CourseID == createDto.CourseID))
        {
            return BadRequest("A course with this number already exists.");
        }

        // Check if department exists
        if (!await _context.Departments.AnyAsync(d => d.DepartmentID == createDto.DepartmentID))
        {
            return BadRequest("Department not found.");
        }

        var course = new Course
        {
            CourseID = createDto.CourseID,
            Title = createDto.Title,
            Credits = createDto.Credits,
            DepartmentID = createDto.DepartmentID
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        // Assign instructors if provided
        if (createDto.InstructorIDs.Any())
        {
            var instructors = await _context.Instructors
                .Where(i => createDto.InstructorIDs.Contains(i.ID))
                .ToListAsync();

            foreach (var instructor in instructors)
            {
                course.Instructors.Add(instructor);
            }
            await _context.SaveChangesAsync();
        }

        var result = await GetCourse(course.CourseID);
        return CreatedAtAction(nameof(GetCourse), new { id = course.CourseID }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, UpdateCourseDto updateDto)
    {
        if (id != updateDto.CourseID)
        {
            return BadRequest();
        }

        var course = await _context.Courses
            .Include(c => c.Instructors)
            .FirstOrDefaultAsync(c => c.CourseID == id);

        if (course == null)
        {
            return NotFound();
        }

        // Check if department exists
        if (!await _context.Departments.AnyAsync(d => d.DepartmentID == updateDto.DepartmentID))
        {
            return BadRequest("Department not found.");
        }

        course.Title = updateDto.Title;
        course.Credits = updateDto.Credits;
        course.DepartmentID = updateDto.DepartmentID;

        // Update instructor assignments
        course.Instructors.Clear();
        if (updateDto.InstructorIDs.Any())
        {
            var instructors = await _context.Instructors
                .Where(i => updateDto.InstructorIDs.Contains(i.ID))
                .ToListAsync();

            foreach (var instructor in instructors)
            {
                course.Instructors.Add(instructor);
            }
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CourseExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Instructors)
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.CourseID == id);

        if (course == null)
        {
            return NotFound();
        }

        // Check if course has enrollments
        if (course.Enrollments.Any())
        {
            return BadRequest("Cannot delete course with existing enrollments.");
        }

        // Clear instructor assignments
        course.Instructors.Clear();

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("instructors")]
    public async Task<ActionResult<List<InstructorSummaryDto>>> GetInstructorsForDropdown()
    {
        var instructors = await _context.Instructors
            .Select(i => new InstructorSummaryDto
            {
                ID = i.ID,
                FullName = i.FullName
            })
            .OrderBy(i => i.FullName)
            .ToListAsync();

        return Ok(instructors);
    }

    private bool CourseExists(int id)
    {
        return _context.Courses.Any(e => e.CourseID == id);
    }
}