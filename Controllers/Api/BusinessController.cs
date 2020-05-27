using Microsoft.AspNetCore.Mvc;
using CERTHB2B.Data;

namespace CERTHB2B.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public BusinessController(ApplicationDbContext dbContext)
        {
            context = dbContext;
        }

        // For creating activity options using code

        // [HttpPost("AddActivityOptions")]
        // public async Task<IActionResult> AddActivityOptions(List<BusinessActivitiesOptions> businessActivitiesOptions)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         context.AddRange(businessActivitiesOptions);

        //         try
        //         {
        //             await context.SaveChangesAsync();
        //             return Ok();
        //         }
        //         catch (DbUpdateException e)
        //         {
        //             return Conflict(e?.InnerException?.Message);
        //         }
        //     }

        //     return BadRequest(ModelState);
        // }
    }
}
