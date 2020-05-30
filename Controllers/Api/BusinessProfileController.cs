using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using CERTHB2B.Data;
using Microsoft.EntityFrameworkCore;
using CERTHB2B.Models;
using CERTHB2B.Models.Requests;
using CERTHB2B.CustomResults;
using X.PagedList;

namespace CERTHB2B.Controllers.Api
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
                // var user = await userManager.GetUserAsync(User);
                var user = await userManager.FindByEmailAsync(User.Identity.Name);

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

        [HttpPost("Listing")]
        // [HttpGet("Listing")]
        [Authorize]
        public async Task<IActionResult> OnGetListing(BusinessProfileListingRequest listingRequest)
        {
            var user = await userManager.FindByEmailAsync(User.Identity.Name);
            // var user = await userManager.FindByEmailAsync("admin@nekya.com");

            // var toMatch = new List<long>()
            // {
            //     24, // "Offer.Collaboration.$ForFundingCall",
            //     21, // "TopicsOfInterest.ICTTransport.$DataAnalyticsTransport",
            //     8,  // "TopicsOfInterest.Logistics.$DronesApplicationsForLogistics"
            // };

            if (user != null) {

                var profile = await context.BusinessProfiles
                    .Include(p => p.Activities)
                    .FirstOrDefaultAsync(p => p.User.Id == user.Id);

                var lookupActivities = profile != null ? profile.Activities.Select(a => a.ActivityId).ToList() : new List<long>();

                var profiles = (
                    from p in context.BusinessProfiles
                        .Include(p => p.Activities)
                        .Include(p => p.User)
                        .Include(p => p.CompanyLocation)
                    where p.IsProfileVisible == true && p.User.Id != user.Id
                    select new
                    {
                        p.ProfileId,
                        Email = p.Email ?? p.User.Email,
                        p.CompanyName,
                        p.CompanyLocation.City,
                        p.CompanyLocation.Country,
                        p.CompanyLocation.Region,
                        Activities = (
                            from pa in p.Activities
                            join bao in context.BusinessActivitiesOptions on pa.ActivityId equals bao.ActivityId
                            select bao.ActivityId
                        ).ToList(),
                        MatchingActivities = (
                            // p.Activities.Count(a => toMatch.Contains(a.ActivityId))
                            from m in p.Activities
                            where lookupActivities.Contains(m.ActivityId)
                            select m.ActivityId
                        ).ToList()
                    }
                ).AsEnumerable().OrderByDescending(p => p.MatchingActivities.Count);

                if (listingRequest.ReturnActivitiesOptions)
                {
                    var ActivitiesOptions = GetActivitiesOptions();
                    return Ok(new { profiles, ActivitiesOptions });
                }

                return Ok(profiles);

            }

            return BadRequest();
        }


        [HttpPut("Information")]
        [Authorize]
        public async Task<IActionResult> OnPutInformation(BusinessProfile businessProfile)
        {
            if (ModelState.IsValid)
            {
                // ICollection<BusinessProfileActivities> activities = (from p in context.BusinessActivitiesOptions
                //                  where businessProfilePutRequest.ActivitiesOptions.Any(v => p.ActivityOptionAlias.Equals(v))
                //                  select new BusinessProfileActivities() {
                //                      ActivityId = p.ActivityId
                //                  }).ToList();

                // businessProfilePutRequest.Profile.Activities = activities;
                
                // var user = await userManager.GetUserAsync(User);
                var user = await userManager.FindByEmailAsync(User.Identity.Name);

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
                        profile.CompanyName = businessProfile.CompanyName;
                        profile.Email = businessProfile.Email;
                        profile.Telephone = businessProfile.Telephone;
                        profile.CompanyLocation = businessProfile.CompanyLocation;
                        profile.ContactPerson = businessProfile.ContactPerson;
                        // profile.Activities.Clear();
                        // profile.Activities = businessProfilePutRequest.Profile.Activities;
                        // profile.OtherActivities.Clear();
                        // profile.OtherActivities = businessProfilePutRequest.Profile.OtherActivities;
                        context.Update(profile);
                    }
                    else
                    {
                        businessProfile.User = user;
                        businessProfile.ProfileId = 0;
                        context.Add(businessProfile);
                    }

                    try
                    {
                        await context.SaveChangesAsync();
                        return Ok(await GetProfileData(user.Id).FirstOrDefaultAsync());
                    }
                    catch (Exception e)
                    {
                        return Conflict(e?.InnerException?.Message);
                    }
                }

                return NotFound(new { userNotFound = User.Identity.Name });
            }

            return BadRequest(ModelState);
        }

        [HttpPut("Activities")]
        [Authorize]
        public async Task<IActionResult> OnPutActivities(List<string> activitiesSelected)
        {
            if (ModelState.IsValid)
            {
                // var user = await userManager.GetUserAsync(User);
                var user = await userManager.FindByEmailAsync(User.Identity.Name);

                if (user != null)
                {
                    var profile = await context.BusinessProfiles
                        .Include(p => p.Activities)
                        .FirstOrDefaultAsync(p => p.User.Id == user.Id);

                    if (profile != null)
                    {
                        profile.Activities.Clear();
                        profile.Activities = (
                            from p in context.BusinessActivitiesOptions
                            where activitiesSelected.Any(v => p.ActivityOptionAlias.Equals(v))
                            select new BusinessProfileActivities() {
                                ActivityId = p.ActivityId
                            }).ToList();
                        context.Update(profile);
                    }
                    else
                    {
                        return new BadRequestJsonResult("NoProfile", null, StatusCodes.Status404NotFound);
                    }

                    try
                    {
                        await context.SaveChangesAsync();
                        return Ok();
                    }
                    catch (Exception e)
                    {
                        return Conflict(e?.InnerException?.Message);
                    }
                }

                return NotFound();
            }

            return BadRequest(ModelState);
        }

        [HttpPut("OtherActivity")]
        [Authorize]
        public async Task<IActionResult> OnPutOtherActivity(BusinessOtherActivityPutRequest activityRequest)
        {
            if (ModelState.IsValid)
            {
                // var user = await userManager.GetUserAsync(User);
                var user = await userManager.FindByEmailAsync(User.Identity.Name);

                if (user != null)
                {
                    var profile = await context.BusinessProfiles
                        .Include(p => p.OtherActivities)
                        .FirstOrDefaultAsync(p => p.User.Id == user.Id);

                    if (profile != null)
                    {
                        var activity = (
                            from o in profile.OtherActivities
                            where o.ActivityAlias == activityRequest.ActivityAlias
                            select o).FirstOrDefault();

                        if (activity != null)
                        {
                            activity.OtherText = activityRequest.OtherText;
                            context.Update(profile);
                        }
                        else
                        {
                            context.BusinessProfileOtherActivities.Add(new BusinessProfileOtherActivities()
                            {
                                ActivityAlias = activityRequest.ActivityAlias,
                                OtherText = activityRequest.OtherText,
                                ProfileId = profile.ProfileId
                            });
                        }
                    }
                    else
                    {
                        return new BadRequestJsonResult("NoProfile", null, StatusCodes.Status404NotFound);
                    }

                    try
                    {
                        await context.SaveChangesAsync();
                        return Ok();
                    }
                    catch (Exception e)
                    {
                        return Conflict(e?.InnerException?.Message);
                    }
                }

                return NotFound();
            }

            return BadRequest(ModelState);
        }

        private Dictionary<string, object> GetActivitiesOptions()
        {
            return new CollectionToDictionary<BusinessActivitiesOptions>(
                context.BusinessActivitiesOptions.ToList()
            ).Convert(i => i.ActivityId.ToString(), i => i.ActivityOptionAlias);
        }

        private IQueryable<dynamic> GetProfileData(string userId = null, long profileId = 0)
        {
            var OtherActivitiesList = (
                from profile in context.BusinessProfiles
                    .Include(p => p.OtherActivities)
                where profile.User.Id == userId || profile.ProfileId == profileId
                select profile.OtherActivities).ToList();

            var OtherActivities = new CollectionToDictionary<BusinessProfileOtherActivities>(OtherActivitiesList)
                .Convert(i => i.ActivityAlias, i => i.OtherText);

            return
                from profile in context.BusinessProfiles
                    .Include(p => p.ContactPerson)
                    .Include(p => p.CompanyLocation)
                    .Include(p => p.OtherActivities)
                    .Include(p => p.User)
                where profile.User.Id == userId || profile.ProfileId == profileId
                select new {
                    UserId = userId,
                    profile.ProfileId,
                    profile.IsProfileVisible,
                    Email = userId == null ? (profile.Email ?? profile.User.Email) : profile.Email,
                    profile.Telephone,
                    profile.CompanyName,
                    profile.CompanyLocation,
                    profile.ContactPerson,
                    Activities = 
                    (
                        from pa in profile.Activities
                        join bao in context.BusinessActivitiesOptions on pa.ActivityId equals bao.ActivityId
                        select bao
                    ).Select(a => a.ActivityOptionAlias).Distinct(),
                    OtherActivities
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

        private class CollectionToDictionary<T> : Dictionary<string, object>
        {
            private List<T> list;
            private List<ICollection<T>> listCollection;

            public CollectionToDictionary(List<ICollection<T>> listCollection)
            {
                this.listCollection = listCollection;
            }

            public CollectionToDictionary(List<T> list)
            {
                this.list = list;
            }

            public Dictionary<string, object> Convert(Func<T, string> key, Func<T, string> value)
            {
                var result = new Dictionary<string, object>();

                if (listCollection != null)
                {
                    listCollection.ToList().ForEach(item => item.ToList().ForEach(i => result.Add(key(i), value(i))));
                }
                else
                {
                    list.ForEach(item => result.Add(key(item), value(item)));
                }

                return result;
            }
        }
    }
}
