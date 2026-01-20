using ContosoUniversity.Models.MongoModels;
using ContosoUniversity.Services;
using MongoDB.Driver;

namespace ContosoUniversity.Data;

public static class MongoDbInitializer
{
    public static async Task InitializeAsync(MongoDbContext context, ICounterService counterService)
    {
        // Check if data already exists
        var studentCount = await context.Students.CountDocumentsAsync(FilterDefinition<Student>.Empty);
        if (studentCount > 0)
        {
            return; // Database has been seeded
        }

        // Seed Departments
        var departments = new List<Department>
        {
            new Department
            {
                DepartmentId = await counterService.GetNextSequenceValueAsync("department"),
                Name = "English",
                Budget = 350000,
                StartDate = DateTime.Parse("2007-09-01"),
                InstructorId = null
            },
            new Department
            {
                DepartmentId = await counterService.GetNextSequenceValueAsync("department"),
                Name = "Mathematics",
                Budget = 100000,
                StartDate = DateTime.Parse("2007-09-01"),
                InstructorId = null
            },
            new Department
            {
                DepartmentId = await counterService.GetNextSequenceValueAsync("department"),
                Name = "Engineering",
                Budget = 350000,
                StartDate = DateTime.Parse("2007-09-01"),
                InstructorId = null
            },
            new Department
            {
                DepartmentId = await counterService.GetNextSequenceValueAsync("department"),
                Name = "Economics",
                Budget = 100000,
                StartDate = DateTime.Parse("2007-09-01"),
                InstructorId = null
            }
        };

        await context.Departments.InsertManyAsync(departments);

        // Seed Instructors
        var instructors = new List<Instructor>
        {
            new Instructor
            {
                InstructorId = await counterService.GetNextSequenceValueAsync("instructor"),
                FirstMidName = "Kim",
                LastName = "Abercrombie",
                HireDate = DateTime.Parse("1995-03-11"),
                OfficeLocation = "Smith 17"
            },
            new Instructor
            {
                InstructorId = await counterService.GetNextSequenceValueAsync("instructor"),
                FirstMidName = "Fadi",
                LastName = "Fakhouri",
                HireDate = DateTime.Parse("2002-07-06"),
                OfficeLocation = "Gowan 27"
            },
            new Instructor
            {
                InstructorId = await counterService.GetNextSequenceValueAsync("instructor"),
                FirstMidName = "Roger",
                LastName = "Harui",
                HireDate = DateTime.Parse("1998-07-01"),
                OfficeLocation = "Thompson 304"
            },
            new Instructor
            {
                InstructorId = await counterService.GetNextSequenceValueAsync("instructor"),
                FirstMidName = "Candace",
                LastName = "Kapoor",
                HireDate = DateTime.Parse("2001-01-15")
            },
            new Instructor
            {
                InstructorId = await counterService.GetNextSequenceValueAsync("instructor"),
                FirstMidName = "Roger",
                LastName = "Zheng",
                HireDate = DateTime.Parse("2004-02-12")
            }
        };

        await context.Instructors.InsertManyAsync(instructors);

        // Seed Courses
        var courses = new List<Course>
        {
            new Course
            {
                CourseId = 1050,
                Title = "Chemistry",
                Credits = 3,
                DepartmentId = departments[2].DepartmentId, // Engineering
                InstructorIds = new List<int> { instructors[0].InstructorId }
            },
            new Course
            {
                CourseId = 4022,
                Title = "Microeconomics",
                Credits = 3,
                DepartmentId = departments[3].DepartmentId, // Economics
                InstructorIds = new List<int> { instructors[1].InstructorId }
            },
            new Course
            {
                CourseId = 4041,
                Title = "Macroeconomics",
                Credits = 3,
                DepartmentId = departments[3].DepartmentId, // Economics
                InstructorIds = new List<int> { instructors[1].InstructorId }
            },
            new Course
            {
                CourseId = 1045,
                Title = "Calculus",
                Credits = 4,
                DepartmentId = departments[1].DepartmentId, // Mathematics
                InstructorIds = new List<int> { instructors[2].InstructorId }
            },
            new Course
            {
                CourseId = 3141,
                Title = "Trigonometry",
                Credits = 4,
                DepartmentId = departments[1].DepartmentId, // Mathematics
                InstructorIds = new List<int> { instructors[2].InstructorId }
            },
            new Course
            {
                CourseId = 2021,
                Title = "Composition",
                Credits = 3,
                DepartmentId = departments[0].DepartmentId, // English
                InstructorIds = new List<int> { instructors[3].InstructorId }
            },
            new Course
            {
                CourseId = 2042,
                Title = "Literature",
                Credits = 4,
                DepartmentId = departments[0].DepartmentId, // English
                InstructorIds = new List<int> { instructors[3].InstructorId }
            }
        };

        await context.Courses.InsertManyAsync(courses);

        // Update instructors with course assignments
        foreach (var instructor in instructors)
        {
            var assignedCourses = courses.Where(c => c.InstructorIds.Contains(instructor.InstructorId)).ToList();
            instructor.CourseIds = assignedCourses.Select(c => c.CourseId).ToList();
        }

        // Update instructors in database
        foreach (var instructor in instructors)
        {
            await context.Instructors.ReplaceOneAsync(
                i => i.InstructorId == instructor.InstructorId,
                instructor
            );
        }

        // Seed Students
        var students = new List<Student>
        {
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Carson",
                LastName = "Alexander",
                EnrollmentDate = DateTime.Parse("2016-09-01")
            },
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Meredith",
                LastName = "Alonso",
                EnrollmentDate = DateTime.Parse("2018-09-01")
            },
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Arturo",
                LastName = "Anand",
                EnrollmentDate = DateTime.Parse("2019-09-01")
            },
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Gytis",
                LastName = "Barzdukas",
                EnrollmentDate = DateTime.Parse("2018-09-01")
            },
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Yan",
                LastName = "Li",
                EnrollmentDate = DateTime.Parse("2018-09-01")
            },
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Peggy",
                LastName = "Justice",
                EnrollmentDate = DateTime.Parse("2017-09-01")
            },
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Laura",
                LastName = "Norman",
                EnrollmentDate = DateTime.Parse("2019-09-01")
            },
            new Student
            {
                StudentId = await counterService.GetNextSequenceValueAsync("student"),
                FirstMidName = "Nino",
                LastName = "Olivetto",
                EnrollmentDate = DateTime.Parse("2011-09-01")
            }
        };

        await context.Students.InsertManyAsync(students);

        // Seed Enrollments
        var enrollments = new List<Enrollment>
        {
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[0].StudentId,
                CourseId = courses[0].CourseId, // Chemistry
                Grade = Grade.A
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[0].StudentId,
                CourseId = courses[1].CourseId, // Microeconomics
                Grade = Grade.C
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[0].StudentId,
                CourseId = courses[2].CourseId, // Macroeconomics
                Grade = Grade.B
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[1].StudentId,
                CourseId = courses[3].CourseId, // Calculus
                Grade = Grade.B
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[1].StudentId,
                CourseId = courses[4].CourseId, // Trigonometry
                Grade = Grade.B
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[1].StudentId,
                CourseId = courses[5].CourseId, // Composition
                Grade = Grade.B
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[2].StudentId,
                CourseId = courses[0].CourseId // Chemistry
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[3].StudentId,
                CourseId = courses[0].CourseId // Chemistry
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[4].StudentId,
                CourseId = courses[5].CourseId, // Composition
                Grade = Grade.B
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[5].StudentId,
                CourseId = courses[6].CourseId // Literature
            },
            new Enrollment
            {
                EnrollmentId = await counterService.GetNextSequenceValueAsync("enrollment"),
                StudentId = students[6].StudentId,
                CourseId = courses[3].CourseId, // Calculus
                Grade = Grade.A
            }
        };

        await context.Enrollments.InsertManyAsync(enrollments);
    }
}