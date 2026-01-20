using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ContosoUniversity.Models.MongoModels;

public class Enrollment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("enrollmentId")]
    public int EnrollmentId { get; set; }

    [BsonElement("courseId")]
    public int CourseId { get; set; }

    [BsonElement("studentId")]
    public int StudentId { get; set; }

    [BsonElement("grade")]
    public Grade? Grade { get; set; }
}

public enum Grade
{
    A = 0,
    B = 1,
    C = 2,
    D = 3,
    F = 4
}