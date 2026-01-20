using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.Models.MongoModels;

public class Course
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("courseId")]
    public int CourseId { get; set; }

    [BsonElement("title")]
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [BsonElement("credits")]
    [Range(0, 5)]
    public int Credits { get; set; }

    [BsonElement("departmentId")]
    public int DepartmentId { get; set; }

    [BsonElement("instructorIds")]
    public List<int> InstructorIds { get; set; } = new();

    [BsonElement("enrollmentIds")]
    public List<ObjectId> EnrollmentIds { get; set; } = new();
}