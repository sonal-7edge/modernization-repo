using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly SchoolContext _context;
    private readonly IConfiguration _configuration;

    public StudentsController(SchoolContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<StudentListDto>> GetStudents(
        string sortOrder = null,
        string searchString = null,
        int pageIndex = 1)
    {
        var studentsQuery = _context.Students.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrEmpty(searchString))
        {
            studentsQuery = studentsQuery.Where(s => 
                s.LastName.Contains(searchString) || 
                s.FirstMidName.Contains(searchString));
        }

        // Apply sorting
        studentsQuery = sortOrder switch
        {
            "name_desc" => studentsQuery.OrderByDescending(s => s.LastName),
            "Date" => studentsQuery.OrderBy(s => s.EnrollmentDate),
            "date_desc" => studentsQuery.OrderByDescending(s => s.EnrollmentDate),
            _ => studentsQuery.OrderBy(s => s.LastName)
        };

        var pageSize = _configuration.GetValue("PageSize", 4);
        var paginatedList = await PaginatedList<Student>.CreateAsync(
            studentsQuery.AsNoTracking(), pageIndex, pageSize);

        var result = new StudentListDto
        {
            Students = paginatedList.Select(s => new StudentDto
            {
                ID = s.ID,
                LastName = s.LastName,
                FirstMidName = s.FirstMidName,
                EnrollmentDate = s.EnrollmentDate
            }).ToList(),
            PageIndex = paginatedList.PageIndex,
            TotalPages = paginatedList.TotalPages,
            HasPreviousPage = paginatedList.HasPreviousPage,
            HasNextPage = paginatedList.HasNextPage,
            TotalCount = paginatedList.TotalCount
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        
        if (student == null)
            return NotFound();

        var studentDto = new StudentDto
        {
            ID = student.ID,
            LastName = student.LastName,
            FirstMidName = student.FirstMidName,
            EnrollmentDate = student.EnrollmentDate
        };

        return Ok(studentDto);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent(CreateStudentDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var student = new Student
        {
            LastName = createDto.LastName,
            FirstMidName = createDto.FirstMidName,
            EnrollmentDate = DateTime.SpecifyKind(createDto.EnrollmentDate, DateTimeKind.Utc)
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        var studentDto = new StudentDto
        {
            ID = student.ID,
            LastName = student.LastName,
            FirstMidName = student.FirstMidName,
            EnrollmentDate = student.EnrollmentDate
        };

        return CreatedAtAction(nameof(GetStudent), new { id = student.ID }, studentDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, UpdateStudentDto updateDto)
    {
        if (id != updateDto.ID)
            return BadRequest();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound();

        student.LastName = updateDto.LastName;
        student.FirstMidName = updateDto.FirstMidName;
        student.EnrollmentDate = DateTime.SpecifyKind(updateDto.EnrollmentDate, DateTimeKind.Utc);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StudentExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound();

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool StudentExists(int id)
    {
        return _context.Students.Any(e => e.ID == id);
    }
}