using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ContosoUniversity.Data;
using ContosoUniversity.Models.MongoModels;
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly ICounterService _counterService;

    public StudentsController(MongoDbContext context, ICounterService counterService)
    {
        _context = context;
        _counterService = counterService;
    }

    [HttpGet]
    public async Task<ActionResult<StudentListResponse>> GetStudents(
        string? sortOrder = null,
        string? searchString = null,
        int pageIndex = 1,
        int pageSize = 10)
    {
        var filter = FilterDefinition<Student>.Empty;

        if (!string.IsNullOrEmpty(searchString))
        {
            filter = Builders<Student>.Filter.Or(
                Builders<Student>.Filter.Regex(s => s.LastName, new MongoDB.Bson.BsonRegularExpression(searchString, "i")),
                Builders<Student>.Filter.Regex(s => s.FirstMidName, new MongoDB.Bson.BsonRegularExpression(searchString, "i"))
            );
        }

        var sort = sortOrder switch
        {
            "name_desc" => Builders<Student>.Sort.Descending(s => s.LastName),
            "Date" => Builders<Student>.Sort.Ascending(s => s.EnrollmentDate),
            "date_desc" => Builders<Student>.Sort.Descending(s => s.EnrollmentDate),
            _ => Builders<Student>.Sort.Ascending(s => s.LastName)
        };

        var totalCount = await _context.Students.CountDocumentsAsync(filter);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var students = await _context.Students
            .Find(filter)
            .Sort(sort)
            .Skip((pageIndex - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        var studentDtos = students.Select(s => new StudentDto
        {
            Id = s.StudentId,
            LastName = s.LastName,
            FirstMidName = s.FirstMidName,
            EnrollmentDate = s.EnrollmentDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            FullName = s.FullName
        }).ToList();

        return Ok(new StudentListResponse
        {
            Students = studentDtos,
            PageIndex = pageIndex,
            TotalPages = totalPages,
            HasPreviousPage = pageIndex > 1,
            HasNextPage = pageIndex < totalPages,
            TotalCount = (int)totalCount
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    {
        var student = await _context.Students
            .Find(s => s.StudentId == id)
            .FirstOrDefaultAsync();

        if (student == null)
        {
            return NotFound();
        }

        var studentDto = new StudentDto
        {
            Id = student.StudentId,
            LastName = student.LastName,
            FirstMidName = student.FirstMidName,
            EnrollmentDate = student.EnrollmentDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            FullName = student.FullName
        };

        return Ok(studentDto);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent(CreateStudentDto createDto)
    {
        var student = new Student
        {
            StudentId = await _counterService.GetNextSequenceValueAsync("student"),
            LastName = createDto.LastName,
            FirstMidName = createDto.FirstMidName,
            EnrollmentDate = DateTime.Parse(createDto.EnrollmentDate)
        };

        await _context.Students.InsertOneAsync(student);

        var studentDto = new StudentDto
        {
            Id = student.StudentId,
            LastName = student.LastName,
            FirstMidName = student.FirstMidName,
            EnrollmentDate = student.EnrollmentDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            FullName = student.FullName
        };

        return CreatedAtAction(nameof(GetStudent), new { id = student.StudentId }, studentDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, UpdateStudentDto updateDto)
    {
        if (id != updateDto.Id)
        {
            return BadRequest();
        }

        var existingStudent = await _context.Students
            .Find(s => s.StudentId == id)
            .FirstOrDefaultAsync();

        if (existingStudent == null)
        {
            return NotFound();
        }

        existingStudent.LastName = updateDto.LastName;
        existingStudent.FirstMidName = updateDto.FirstMidName;
        existingStudent.EnrollmentDate = DateTime.Parse(updateDto.EnrollmentDate);

        var result = await _context.Students.ReplaceOneAsync(
            s => s.StudentId == id,
            existingStudent
        );

        if (result.MatchedCount == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var result = await _context.Students.DeleteOneAsync(s => s.StudentId == id);

        if (result.DeletedCount == 0)
        {
            return NotFound();
        }

        return NoContent();
    }
}