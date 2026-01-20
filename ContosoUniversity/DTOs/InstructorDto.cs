using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.DTOs;

public class InstructorDto
{
    public int ID { get; set; }
    public string LastName { get; set; }
    public string FirstMidName { get; set; }
    public DateTime HireDate { get; set; }
    public string FullName { get; set; }
    public string? OfficeLocation { get; set; }
    public List<CourseDto> Courses { get; set; } = new();
}

public class CreateInstructorDto
{
    [Required]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstMidName { get; set; }

    [Required]
    public DateTime HireDate { get; set; }

    [StringLength(50)]
    public string? OfficeLocation { get; set; }
}

public class UpdateInstructorDto : CreateInstructorDto
{
    public int ID { get; set; }
}

public class InstructorListResponse
{
    public List<InstructorDto> Instructors { get; set; } = new();
}