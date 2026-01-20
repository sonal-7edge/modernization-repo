using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ContosoUniversity.Data;
using ContosoUniversity.Models.MongoModels;
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly ICounterService _counterService;

    public CoursesController(MongoDbContext context, ICounterService counterService)
    {
        _context = context;
        _counterService = counterService;
    }

    [HttpGet]
    public async Task<ActionResult<CourseListResponse>> GetCourses()
    {
        var courses = await _context.Courses.Find(_ => true).ToListAsync();
        var departments = await _context.Departments.Find(_ => true).ToListAsync();
        var instructors = await _context.Instructors.Find(_ => true).ToListAsync();
        var enrollments = await _context.Enrollments.Find(_ => true).ToListAsync();

        var courseDtos = courses.Select(c =>
        {
            var department = departments.FirstOrDefault(d => d.DepartmentId == c.DepartmentId);
            var courseInstructors = instructors.Where(i => c.InstructorIds.Contains(i.InstructorId)).ToList();
            var courseEnrollments = enrollments.Where(e => e.CourseId == c.CourseId).ToList();

            return new CourseDto
            {
                CourseID = c.CourseId,
                Title = c.Title,
                Credits = c.Credits,
                DepartmentID = c.DepartmentId,
                DepartmentName = department?.Name ?? "Unknown",
                EnrollmentCount = courseEnrollments.Count,
                Instructors = courseInstructors.Select(i => new InstructorSummaryDto
                {
                    ID = i.InstructorId,
                    FullName = i.FullName
                }).ToList()
            };
        }).ToList();

        return Ok(new CourseListResponse { Courses = courseDtos });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(int id)
    {
        var course = await _context.Courses
            .Find(c => c.CourseId == id)
            .FirstOrDefaultAsync();

        if (course == null)
        {
            return NotFound();
        }

        var department = await _context.Departments
            .Find(d => d.DepartmentId == course.DepartmentId)
            .FirstOrDefaultAsync();

        var instructors = await _context.Instructors
            .Find(i => course.InstructorIds.Contains(i.InstructorId))
            .ToListAsync();

        var enrollmentCount = await _context.Enrollments
            .CountDocumentsAsync(e => e.CourseId == course.CourseId);

        var courseDto = new CourseDto
        {
            CourseID = course.CourseId,
            Title = course.Title,
            Credits = course.Credits,
            DepartmentID = course.DepartmentId,
            DepartmentName = department?.Name ?? "Unknown",
            EnrollmentCount = (int)enrollmentCount,
            Instructors = instructors.Select(i => new InstructorSummaryDto
            {
                ID = i.InstructorId,
                FullName = i.FullName
            }).ToList()
        };

        return Ok(courseDto);
    }

    [HttpPost]
    public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto createDto)
    {
        // Check if course ID already exists
        var existingCourse = await _context.Courses
            .Find(c => c.CourseId == createDto.CourseID)
            .FirstOrDefaultAsync();

        if (existingCourse != null)
        {
            return BadRequest("A course with this number already exists.");
        }

        // Check if department exists
        var department = await _context.Departments
            .Find(d => d.DepartmentId == createDto.DepartmentID)
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return BadRequest("Department not found.");
        }

        var course = new Course
        {
            CourseId = createDto.CourseID,
            Title = createDto.Title,
            Credits = createDto.Credits,
            DepartmentId = createDto.DepartmentID,
            InstructorIds = createDto.InstructorIDs ?? new List<int>()
        };

        await _context.Courses.InsertOneAsync(course);

        // Update instructors with course assignment
        if (createDto.InstructorIDs?.Any() == true)
        {
            var instructors = await _context.Instructors
                .Find(i => createDto.InstructorIDs.Contains(i.InstructorId))
                .ToListAsync();

            foreach (var instructor in instructors)
            {
                if (!instructor.CourseIds.Contains(course.CourseId))
                {
                    instructor.CourseIds.Add(course.CourseId);
                    await _context.Instructors.ReplaceOneAsync(
                        i => i.InstructorId == instructor.InstructorId,
                        instructor
                    );
                }
            }
        }

        var result = await GetCourse(course.CourseId);
        return CreatedAtAction(nameof(GetCourse), new { id = course.CourseId }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, UpdateCourseDto updateDto)
    {
        if (id != updateDto.CourseID)
        {
            return BadRequest();
        }

        var existingCourse = await _context.Courses
            .Find(c => c.CourseId == id)
            .FirstOrDefaultAsync();

        if (existingCourse == null)
        {
            return NotFound();
        }

        // Check if department exists
        var department = await _context.Departments
            .Find(d => d.DepartmentId == updateDto.DepartmentID)
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return BadRequest("Department not found.");
        }

        // Remove course from old instructors
        var oldInstructors = await _context.Instructors
            .Find(i => i.CourseIds.Contains(existingCourse.CourseId))
            .ToListAsync();

        foreach (var instructor in oldInstructors)
        {
            instructor.CourseIds.Remove(existingCourse.CourseId);
            await _context.Instructors.ReplaceOneAsync(
                i => i.InstructorId == instructor.InstructorId,
                instructor
            );
        }

        // Update course
        existingCourse.Title = updateDto.Title;
        existingCourse.Credits = updateDto.Credits;
        existingCourse.DepartmentId = updateDto.DepartmentID;
        existingCourse.InstructorIds = updateDto.InstructorIDs ?? new List<int>();

        var result = await _context.Courses.ReplaceOneAsync(
            c => c.CourseId == id,
            existingCourse
        );

        if (result.MatchedCount == 0)
        {
            return NotFound();
        }

        // Add course to new instructors
        if (updateDto.InstructorIDs?.Any() == true)
        {
            var newInstructors = await _context.Instructors
                .Find(i => updateDto.InstructorIDs.Contains(i.InstructorId))
                .ToListAsync();

            foreach (var instructor in newInstructors)
            {
                if (!instructor.CourseIds.Contains(existingCourse.CourseId))
                {
                    instructor.CourseIds.Add(existingCourse.CourseId);
                    await _context.Instructors.ReplaceOneAsync(
                        i => i.InstructorId == instructor.InstructorId,
                        instructor
                    );
                }
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        // Check if course has enrollments
        var enrollmentCount = await _context.Enrollments.CountDocumentsAsync(e => e.CourseId == id);
        if (enrollmentCount > 0)
        {
            return BadRequest("Cannot delete course with existing enrollments.");
        }

        // Remove course from instructors
        var instructors = await _context.Instructors
            .Find(i => i.CourseIds.Contains(id))
            .ToListAsync();

        foreach (var instructor in instructors)
        {
            instructor.CourseIds.Remove(id);
            await _context.Instructors.ReplaceOneAsync(
                i => i.InstructorId == instructor.InstructorId,
                instructor
            );
        }

        var result = await _context.Courses.DeleteOneAsync(c => c.CourseId == id);

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