using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace ContosoUniversity.Models.MongoModels;

public class Student
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("studentId")]
    public int StudentId { get; set; }

    [BsonElement("lastName")]
    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [BsonElement("firstMidName")]
    [Required]
    [StringLength(50)]
    public string FirstMidName { get; set; } = string.Empty;

    [BsonElement("enrollmentDate")]
    public DateTime EnrollmentDate { get; set; }

    [BsonIgnore]
    public string FullName => $"{FirstMidName} {LastName}";

    [BsonElement("enrollments")]
    public List<ObjectId> EnrollmentIds { get; set; } = new();
}