using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ContosoUniversity.Pages
{
    public class StatusCodeModel : PageModel
    {
        public int ErrorStatusCode { get; set; }

        public void OnGet(int statusCode)
        {
            ErrorStatusCode = statusCode;
            Response.StatusCode = statusCode;
        }
    }
}