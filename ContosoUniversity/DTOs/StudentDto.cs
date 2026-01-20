using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.DTOs;

public class StudentDto
{
    public int Id { get; set; }
    public string LastName { get; set; } = string.Empty;
    public string FirstMidName { get; set; } = string.Empty;
    public string EnrollmentDate { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}

public class CreateStudentDto
{
    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string FirstMidName { get; set; } = string.Empty;
    
    [Required]
    public string EnrollmentDate { get; set; } = string.Empty;
}

public class UpdateStudentDto : CreateStudentDto
{
    public int Id { get; set; }
}

public class StudentListResponse
{
    public List<StudentDto> Students { get; set; } = new();
    public int PageIndex { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
    public int TotalCount { get; set; }
}