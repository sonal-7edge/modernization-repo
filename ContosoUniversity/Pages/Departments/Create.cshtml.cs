using ContosoUniversity.Data;
using ContosoUniversity.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ContosoUniversity.Pages.Departments;

public class CreateModel : PageModel
{
    private readonly 
        SchoolContext _context;

    public CreateModel(
        SchoolContext context)
    {
        _context = context;
    }

    public IActionResult OnGet()
    {
    ViewData["InstructorID"] = new SelectList(_context.Instructors, "ID", "FirstMidName");
        return Page();
    }

    [BindProperty]
    public Department Department { get; set; }

    // To protect from overposting attacks, see https://aka.ms/RazorPagesCRUD
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            ViewData["InstructorID"] = new SelectList(_context.Instructors, "ID", "FirstMidName");
            return Page();
        }

        // Convert DateTime to UTC for PostgreSQL compatibility
        if (Department.StartDate.Kind == DateTimeKind.Unspecified)
        {
            Department.StartDate = DateTime.SpecifyKind(Department.StartDate, DateTimeKind.Utc);
        }
        else if (Department.StartDate.Kind == DateTimeKind.Local)
        {
            Department.StartDate = Department.StartDate.ToUniversalTime();
        }

        _context.Departments.Add(Department);
        await _context.SaveChangesAsync();

        return RedirectToPage("./Index");
    }
}
