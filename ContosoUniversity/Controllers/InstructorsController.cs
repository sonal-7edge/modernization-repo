using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContosoUniversity.Data;
using ContosoUniversity.Models;
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InstructorsController : ControllerBase
{
    private readonly SchoolContext _context;

    public InstructorsController(SchoolContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<InstructorListResponse>> GetInstructors()
    {
        var instructors = await _context.Instructors
            .Include(i => i.OfficeAssignment)
            .Include(i => i.Courses)
                .ThenInclude(c => c.Department)
            .Select(i => new InstructorDto
            {
                ID = i.ID,
                LastName = i.LastName,
                FirstMidName = i.FirstMidName,
                HireDate = i.HireDate,
                FullName = i.FullName,
                OfficeLocation = i.OfficeAssignment != null ? i.OfficeAssignment.Location : null,
                Courses = i.Courses.Select(c => new CourseDto
                {
                    CourseID = c.CourseID,
                    Title = c.Title,
                    Credits = c.Credits,
                    DepartmentID = c.DepartmentID,
                    DepartmentName = c.Department.Name
                }).ToList()
            })
            .ToListAsync();

        return Ok(new InstructorListResponse { Instructors = instructors });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InstructorDto>> GetInstructor(int id)
    {
        var instructor = await _context.Instructors
            .Include(i => i.OfficeAssignment)
            .Include(i => i.Courses)
                .ThenInclude(c => c.Department)
            .Where(i => i.ID == id)
            .Select(i => new InstructorDto
            {
                ID = i.ID,
                LastName = i.LastName,
                FirstMidName = i.FirstMidName,
                HireDate = i.HireDate,
                FullName = i.FullName,
                OfficeLocation = i.OfficeAssignment != null ? i.OfficeAssignment.Location : null,
                Courses = i.Courses.Select(c => new CourseDto
                {
                    CourseID = c.CourseID,
                    Title = c.Title,
                    Credits = c.Credits,
                    DepartmentID = c.DepartmentID,
                    DepartmentName = c.Department.Name
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (instructor == null)
        {
            return NotFound();
        }

        return Ok(instructor);
    }

    [HttpPost]
    public async Task<ActionResult<InstructorDto>> CreateInstructor(CreateInstructorDto createDto)
    {
        var instructor = new Instructor
        {
            LastName = createDto.LastName,
            FirstMidName = createDto.FirstMidName,
            HireDate = createDto.HireDate
        };

        _context.Instructors.Add(instructor);
        await _context.SaveChangesAsync();

        // Add office assignment if provided
        if (!string.IsNullOrEmpty(createDto.OfficeLocation))
        {
            var officeAssignment = new OfficeAssignment
            {
                InstructorID = instructor.ID,
                Location = createDto.OfficeLocation
            };
            _context.OfficeAssignments.Add(officeAssignment);
            await _context.SaveChangesAsync();
        }

        // Return the created instructor
        var result = await GetInstructor(instructor.ID);
        return CreatedAtAction(nameof(GetInstructor), new { id = instructor.ID }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInstructor(int id, UpdateInstructorDto updateDto)
    {
        if (id != updateDto.ID)
        {
            return BadRequest();
        }

        var instructor = await _context.Instructors
            .Include(i => i.OfficeAssignment)
            .FirstOrDefaultAsync(i => i.ID == id);

        if (instructor == null)
        {
            return NotFound();
        }

        instructor.LastName = updateDto.LastName;
        instructor.FirstMidName = updateDto.FirstMidName;
        instructor.HireDate = updateDto.HireDate;

        // Handle office assignment
        if (!string.IsNullOrEmpty(updateDto.OfficeLocation))
        {
            if (instructor.OfficeAssignment == null)
            {
                instructor.OfficeAssignment = new OfficeAssignment
                {
                    InstructorID = instructor.ID,
                    Location = updateDto.OfficeLocation
                };
            }
            else
            {
                instructor.OfficeAssignment.Location = updateDto.OfficeLocation;
            }
        }
        else if (instructor.OfficeAssignment != null)
        {
            _context.OfficeAssignments.Remove(instructor.OfficeAssignment);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!InstructorExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInstructor(int id)
    {
        var instructor = await _context.Instructors
            .Include(i => i.OfficeAssignment)
            .Include(i => i.Courses)
            .FirstOrDefaultAsync(i => i.ID == id);

        if (instructor == null)
        {
            return NotFound();
        }

        // Remove office assignment if exists
        if (instructor.OfficeAssignment != null)
        {
            _context.OfficeAssignments.Remove(instructor.OfficeAssignment);
        }

        // Clear course assignments
        instructor.Courses.Clear();

        _context.Instructors.Remove(instructor);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool InstructorExists(int id)
    {
        return _context.Instructors.Any(e => e.ID == id);
    }
}