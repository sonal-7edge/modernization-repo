using MongoDB.Driver;
using ContosoUniversity.Models.MongoModels;

namespace ContosoUniversity.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB") ?? "mongodb://localhost:27017";
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "ContosoUniversity";
        
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<Student> Students => _database.GetCollection<Student>("students");
    public IMongoCollection<Department> Departments => _database.GetCollection<Department>("departments");
    public IMongoCollection<Instructor> Instructors => _database.GetCollection<Instructor>("instructors");
    public IMongoCollection<Course> Courses => _database.GetCollection<Course>("courses");
    public IMongoCollection<Enrollment> Enrollments => _database.GetCollection<Enrollment>("enrollments");
}