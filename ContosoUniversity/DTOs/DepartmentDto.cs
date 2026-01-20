using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.DTOs;

public class DepartmentDto
{
    public int DepartmentID { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public int? InstructorID { get; set; }
    public string? AdministratorName { get; set; }
    public byte[]? ConcurrencyToken { get; set; }
}

public class CreateDepartmentDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public decimal Budget { get; set; }
    
    [Required]
    public string StartDate { get; set; } = string.Empty;
    
    public int? InstructorID { get; set; }
}

public class UpdateDepartmentDto : CreateDepartmentDto
{
    public int DepartmentID { get; set; }
    public byte[]? ConcurrencyToken { get; set; }
}

public class DepartmentListResponse
{
    public List<DepartmentDto> Departments { get; set; } = new();
}