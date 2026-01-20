using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.Models.MongoModels;

public class Department
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("departmentId")]
    public int DepartmentId { get; set; }

    [BsonElement("name")]
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [BsonElement("budget")]
    [Range(0, double.MaxValue)]
    public decimal Budget { get; set; }

    [BsonElement("startDate")]
    public DateTime StartDate { get; set; }

    [BsonElement("instructorId")]
    public int? InstructorId { get; set; }

    [BsonElement("administratorName")]
    public string? AdministratorName { get; set; }

    [BsonElement("concurrencyToken")]
    public byte[]? ConcurrencyToken { get; set; }
}