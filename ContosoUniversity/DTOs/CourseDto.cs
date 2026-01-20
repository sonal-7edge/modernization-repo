using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.DTOs;

public class CourseDto
{
    public int CourseID { get; set; }
    public string Title { get; set; }
    public int Credits { get; set; }
    public int DepartmentID { get; set; }
    public string DepartmentName { get; set; }
    public List<InstructorSummaryDto> Instructors { get; set; } = new();
    public int EnrollmentCount { get; set; }
}

public class CreateCourseDto
{
    [Required]
    [Range(1000, 9999, ErrorMessage = "Course number must be between 1000 and 9999")]
    public int CourseID { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Title { get; set; }

    [Required]
    [Range(0, 5)]
    public int Credits { get; set; }

    [Required]
    public int DepartmentID { get; set; }

    public List<int> InstructorIDs { get; set; } = new();
}

public class UpdateCourseDto : CreateCourseDto
{
}

public class CourseListResponse
{
    public List<CourseDto> Courses { get; set; } = new();
}

public class InstructorSummaryDto
{
    public int ID { get; set; }
    public string FullName { get; set; }
}