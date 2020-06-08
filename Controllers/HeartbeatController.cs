using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using CERTHB2B.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;
using System.IO;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using CERTHB2B.Models;
using System.Threading.Tasks;
using CERTHB2B.Utils;

namespace CERTHB2B.Controllers.Api
{
    [Route("[controller]")]
    [ApiController]
    public class HeartbeatController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IHostEnvironment environment;
        private UserManager<ApplicationUser> userManager;

        public HeartbeatController(ApplicationDbContext dbContext, 
            UserManager<ApplicationUser> userMgr, 
            IHostEnvironment env)
        {
            context = dbContext;
            userManager = userMgr;
            environment = env;
        }
    
        [HttpGet]
        [ResponseCache(NoStore = true)]
        public async Task<IActionResult> Default()
        {
            var packageJson = System.IO.File.ReadAllText(Path.Combine(environment.ContentRootPath, "ClientApp", "package.json"));
            var packageInfo = JsonSerializer.Deserialize<Dictionary<string, dynamic>>(packageJson);
            var spaVersion = packageInfo["version"];

            var isAuth = User.Identity.IsAuthenticated;
            dynamic newContactRequests = 0;

            if (isAuth)
            {
                var user = await userManager.FindByEmailAsync(User.Identity.Name);

                if (user != null)
                {
                    var contactRequests = (
                        from profile in context.BusinessProfiles
                        where profile.UserId == user.Id
                        select (
                            from requests in context.BusinessContactRequests
                            where requests.ToId == profile.ProfileId && requests.IsOpened == false
                            select requests
                        ).ToList()
                    );

                    if (contactRequests.Count() > 0)
                    {
                        newContactRequests = contactRequests.FirstOrDefault().Count();
                    }

                    Console.WriteLine(ObjectDumper.Dump(contactRequests));

                    Console.WriteLine("newContactRequests {0}", newContactRequests);
                }
            }

            return Ok(new { spaVersion, isAuth, newContactRequests });
        }
    }
}
