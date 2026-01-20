using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.DTOs;

public class StudentDto
{
    public int ID { get; set; }
    public string LastName { get; set; } = string.Empty;
    public string FirstMidName { get; set; } = string.Empty;
    public DateTime EnrollmentDate { get; set; }
    public string FullName => $"{FirstMidName} {LastName}";
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
    public DateTime EnrollmentDate { get; set; }
}

public class UpdateStudentDto : CreateStudentDto
{
    public int ID { get; set; }
}

public class StudentListDto
{
    public List<StudentDto> Students { get; set; } = new();
    public int PageIndex { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
    public int TotalCount { get; set; }
}