using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using CERTHB2B.Data;
using Microsoft.EntityFrameworkCore;
using CERTHB2B.Models;
using CERTHB2B.Services;

namespace CERTHB2B.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private readonly ApplicationDbContext context;
        private readonly IRazorViewToStringRenderer razorRenderer;
        private readonly CERTHB2B.Services.IAppEmailSender appEmailSender;

        public AccountsController(
            UserManager<ApplicationUser> userMgr, 
            SignInManager<ApplicationUser> signinMgr, 
            ApplicationDbContext dbContext,
            CERTHB2B.Services.IAppEmailSender appEmailSndr,
            IRazorViewToStringRenderer razorRndr)
        {
            userManager = userMgr;
            context = dbContext;
            appEmailSender = appEmailSndr;
            razorRenderer = razorRndr;
        }
    
        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Index()
        {
            var userList = await (
                from user in context.Users
                join profile in context.BusinessProfiles
                    on user.Id equals profile.UserId into joinGroup
                from jg in joinGroup.DefaultIfEmpty()
                select new
                {
                    UserId = user.Id,
                    user.UserName,
                    user.Email,
                    user.EmailConfirmed,
                    user.PhoneNumber,
                    user.LockoutEnabled,
                    user.LockoutEnd,
                    user.LastLoginTime,
                    user.RegistrationDate,
                    RoleNames = (
                        from userRole in context.UserRoles
                        join role in context.Roles
                            on userRole.RoleId equals role.Id
                        where userRole.UserId == user.Id
                        select role.Name
                    ).ToList(),
                    HasProfile = jg != null,
                    ProfileId = jg.ProfileId,
                    IsProfileVisible = jg.IsProfileVisible.GetValueOrDefault(),
                }
            ).ToListAsync();

            return Ok(userList);
        }
    }
}

