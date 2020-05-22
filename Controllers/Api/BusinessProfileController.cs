using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using EKETAGreenmindB2B.Data;
using Microsoft.EntityFrameworkCore;
using EKETAGreenmindB2B.Models;
using System.Dynamic;
using EKETAGreenmindB2B.Models.Requests;
using System.Text.Json;

namespace EKETAGreenmindB2B.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessProfileController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private readonly ApplicationDbContext context;

        public BusinessProfileController(UserManager<ApplicationUser> userMgr, ApplicationDbContext dbContext)
        {
            userManager = userMgr;
            context = dbContext;
        }
    
        [HttpGet("{profileId}")]
        [Authorize]
        public async Task<IActionResult> Index(long profileId)
        {
            var result = GetProfileData(profileId: profileId);
            var profileFound = await result.FirstOrDefaultAsync();

            return profileFound != null ? 
                Ok(profileFound) : 
                NotFound();
        }

        [HttpGet("OfAccount/{userId?}")]
        [Authorize]
        public async Task<IActionResult> OnGetProfile(string userId = null)
        {
            dynamic profileFound = null;
            IQueryable<dynamic> result = null;

            if (String.IsNullOrEmpty(userId))
            {
                var user = await userManager.GetUserAsync(User);

                if (user != null)
                    result = GetProfileData(user.Id);
            }
            else
                result = GetProfileData(userId);

            if (result != null)
                profileFound = await result.FirstOrDefaultAsync();

            return profileFound != null ? 
                Ok(profileFound) : 
                NotFound();
        }


        [HttpPut]
        // [Authorize]
        public async Task<IActionResult> OnPutProfile(BusinessProfilePutRequest businessProfilePutRequest)
        {
            if (ModelState.IsValid)
            {
                ICollection<BusinessProfileActivities> activities = (from p in context.BusinessActivitiesOptions
                                 where businessProfilePutRequest.ActivitiesOptions.Any(v => p.ActivityOptionAlias.Equals(v))
                                 select new BusinessProfileActivities() {
                                     ActivityId = p.ActivityId
                                 }).ToList();

                businessProfilePutRequest.Profile.Activities = activities;
                
                var user = await userManager.FindByIdAsync("16dad1b9-55a4-4eb6-bda7-d2c020776962");

                if (user != null)
                {
                    var profile = await context.BusinessProfiles
                        .Include(p => p.CompanyLocation)
                        .Include(p => p.ContactPerson)
                        .Include(p => p.Activities)
                        .Include(p => p.OtherActivities)
                        .FirstOrDefaultAsync(p => p.User.Id == user.Id);

                    if (profile != null)
                    {
                        profile.CompanyName = businessProfilePutRequest.Profile.CompanyName;
                        profile.Email = businessProfilePutRequest.Profile.Email;
                        profile.Telephone = businessProfilePutRequest.Profile.Telephone;
                        profile.CompanyLocation = businessProfilePutRequest.Profile.CompanyLocation;
                        profile.ContactPerson = businessProfilePutRequest.Profile.ContactPerson;
                        profile.Activities.Clear();
                        profile.Activities = businessProfilePutRequest.Profile.Activities;
                        profile.OtherActivities.Clear();
                        profile.OtherActivities = businessProfilePutRequest.Profile.OtherActivities;
                        context.Update(profile);
                    }
                    else
                    {
                        Console.WriteLine("Profile adding");
                        businessProfilePutRequest.Profile.User = user;
                        businessProfilePutRequest.Profile.ProfileId = 0;
                        context.Add(businessProfilePutRequest.Profile);
                    }

                    try
                    {
                        await context.SaveChangesAsync();
                        return Ok(businessProfilePutRequest.Profile);
                    }
                    catch (Exception e)
                    {
                        return Conflict(e?.InnerException?.Message);
                    }
                }


                // // var user = await userManager.GetUserAsync(User);

                // if(user != null) {
                //     businessProfilePutRequest.Profile.User = user;
                //     context.Add(businessProfilePutRequest.Profile);

                //     try
                //     {
                //         await context.SaveChangesAsync();
                //         return Ok(businessProfilePutRequest.Profile);
                //     }
                //     catch (Exception e)
                //     {
                //         return Conflict(e?.InnerException?.Message);
                //     }
                // }

                return NotFound(new { userNotFound = User.Identity.Name });

                
                // context.AddRange(businessActivitiesOptions);

                // try
                // {
                //     await context.SaveChangesAsync();
                //     return Ok();
                // }
                // catch (DbUpdateException e)
                // {
                //     return Conflict(e?.InnerException?.Message);
                // }
            }

            return BadRequest(ModelState);
        }


        private IQueryable<dynamic> GetProfileData(string userId = null, long profileId = 0)
        {
            return
                from profile in context.BusinessProfiles
                    .Include(p => p.ContactPerson)
                    .Include(p => p.CompanyLocation)
                    .Include(p => p.OtherActivities)
                where profile.User.Id == userId || profile.ProfileId == profileId
                select new {
                    UserId = userId,
                    profile.ProfileId,
                    profile.Email,
                    profile.Telephone,
                    profile.CompanyName,
                    profile.CompanyLocation,
                    profile.ContactPerson,
                    Activities = 
                    (
                        from pa in profile.Activities
                        join bao in context.BusinessActivitiesOptions on pa.ActivityId equals bao.ActivityId
                        select bao
                    ),
                    profile.OtherActivities
                };
        }

        private async Task<BusinessProfile> GetCurrentUserProfile(string userId)
        {
            // var user = await userManager.GetUserAsync(User);
            var user = await userManager.FindByIdAsync(userId);

            if (user != null)
            {
                return await context.BusinessProfiles.FirstOrDefaultAsync(p => p.User.Id == user.Id);
            }

            return null;
        }
    }
}
