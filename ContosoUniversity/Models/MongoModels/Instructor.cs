using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.Models.MongoModels;

public class Instructor
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("instructorId")]
    public int InstructorId { get; set; }

    [BsonElement("lastName")]
    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [BsonElement("firstMidName")]
    [Required]
    [StringLength(50)]
    public string FirstMidName { get; set; } = string.Empty;

    [BsonElement("hireDate")]
    public DateTime HireDate { get; set; }

    [BsonIgnore]
    public string FullName => $"{LastName}, {FirstMidName}";

    [BsonElement("officeLocation")]
    public string? OfficeLocation { get; set; }

    [BsonElement("courseIds")]
    public List<int> CourseIds { get; set; } = new();
}