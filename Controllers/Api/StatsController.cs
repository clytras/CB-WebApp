using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using CERTHB2B.Data;
using CERTHB2B.Models;
using X.PagedList;
using CERTHB2B.Services;
using System.Globalization;

namespace CERTHB2B.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private readonly ApplicationDbContext context;

        public StatsController(
            UserManager<ApplicationUser> userMgr,
            ApplicationDbContext dbContext,
            CERTHB2B.Services.IAppEmailSender appEmailSndr,
            IRazorViewToStringRenderer razorRndr)
        {
            userManager = userMgr;
            context = dbContext;
        }
    
        [Authorize]
        public IActionResult ContactRequests()
        {
            var data = (
                from requests in context.BusinessContactRequests
                group requests by requests.Date.Date into g
                orderby g.Key.Date
                select new {
                    date = g.Key.Date.ToString("d MMM yyyy", new CultureInfo("en-US")),
                    count = g.Count()
                }
            );

            var total = context.BusinessContactRequests.Count();

            return Ok(new { data, total });
        }
    }
}
