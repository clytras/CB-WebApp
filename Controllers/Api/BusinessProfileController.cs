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
using CERTHB2B.Utils;
using CERTHB2B.Services;
using CERTHB2B.ViewModels.Business;
using System.Text.RegularExpressions;

namespace CERTHB2B.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessProfileController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private readonly ApplicationDbContext context;
        private readonly IRazorViewToStringRenderer razorRenderer;
        private readonly CERTHB2B.Services.IAppEmailSender appEmailSender;

        public BusinessProfileController(
            UserManager<ApplicationUser> userMgr,
            ApplicationDbContext dbContext,
            CERTHB2B.Services.IAppEmailSender appEmailSndr,
            IRazorViewToStringRenderer razorRndr)
        {
            userManager = userMgr;
            context = dbContext;
            appEmailSender = appEmailSndr;
            razorRenderer = razorRndr;
        }
    
        [HttpGet("{profileId}")]
        [Authorize]
        public async Task<IActionResult> Index(long profileId)
        {
            var result = await GetProfileData(profileId: profileId, withLastContactRequestSend: true);
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
                // var user = await userManager.FindByEmailAsync(User.Identity.Name);
                var user = await GetCurrentUserAsync();

                if (user != null)
                    result = await GetProfileData(user.Id, withNewContactRequestsCounter: true);
            }
            else
                result = await GetProfileData(userId);

            if (result != null)
                profileFound = await result.FirstOrDefaultAsync();

            return profileFound != null ? 
                Ok(profileFound) : 
                NotFound();
        }

        [HttpPost("Listing/{page?}/{perPage?}")]
        [Authorize]
        public async Task<IActionResult> OnGetListing([FromBody]BusinessProfileListingRequest listingRequest, int page = 1, int perPage = 12)
        {
            // var user = await userManager.FindByEmailAsync(User.Identity.Name);
            var user = await GetCurrentUserAsync();

            if (user != null) {

                var profile = await context.BusinessProfiles
                    .Include(p => p.Activities)
                    .FirstOrDefaultAsync(p => p.User.Id == user.Id);

                var lookupActivities = profile != null ? profile.Activities.Select(a => a.ActivityId).ToList() : new List<long>();

                bool hasTermCompanyName = listingRequest.SearchTermCompanyName?.Length > 0;
                bool hasTermCountries = listingRequest.SearchTermCountries?.Count() > 0;
                bool hasTermActivities = listingRequest.SearchTermActivities?.Count() > 0;

                var termActivitiesIds = hasTermActivities ? (
                    from a in context.BusinessActivitiesOptions
                    where listingRequest.SearchTermActivities.Contains(a.ActivityOptionAlias)
                    select a.ActivityId
                ).ToList() : new List<long>();

                var profiles = (
                    from p in context.BusinessProfiles
                        .Include(p => p.Activities)
                        .Include(p => p.User)
                        .Include(p => p.CompanyLocation)
                    where p.IsProfileVisible == true && p.User.Id != user.Id
                    where !hasTermCompanyName || EF.Functions.Like(p.CompanyName, $"%{listingRequest.SearchTermCompanyName}%")
                    where !hasTermCountries || listingRequest.SearchTermCountries.Contains(p.CompanyLocation.Country)
                    where !hasTermActivities || p.Activities.Where(a => termActivitiesIds.Contains(a.ActivityId)).Count() == termActivitiesIds.Count()
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

                var total = profiles.Count();
                var data = profiles.ToPagedList(page, perPage);

                if (listingRequest.ReturnActivitiesOptions)
                {
                    var ActivitiesOptions = GetActivitiesOptions();
                    return Ok(new { total, data, ActivitiesOptions });
                }

                return Ok(new { total, data });

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
                // var user = await userManager.FindByEmailAsync(User.Identity.Name);
                var user = await GetCurrentUserAsync();

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
                        var profileData = await GetProfileData(user.Id);
                        return Ok(await profileData.FirstOrDefaultAsync());
                    }
                    catch
                    {
                        throw;
                    }
                }

                return NotFound(new { userNotFound = User.Identity.Name });
            }

            return BadRequest(ModelState);
        }

        [HttpPost("SetProfileOfUserVisibility")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> OnSetProfileOfUserVisibility(ProfileOfUserVisibility profileVisibility)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByIdAsync(profileVisibility.UserId);

                if (user != null)
                {
                    var profile = await context.BusinessProfiles.FirstOrDefaultAsync(p => p.User.Id == user.Id);

                    if (profile != null)
                    {
                        profile.IsProfileVisible = profileVisibility.Visibility;
                        context.Update(profile);

                        try
                        {
                            await context.SaveChangesAsync();
                            return Ok();
                        }
                        catch
                        {
                            throw;
                        }
                    }

                    return new BadRequestJsonResult("NoProfile");
                }

                return NotFound();
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

        [HttpPost("SendContactRequest")]
        [Authorize]
        public async Task<IActionResult> OnSendContactRequest(SendContactRequest contactRequest)
        {
            if (ModelState.IsValid)
            {
                // var user = await userManager.FindByEmailAsync(User.Identity.Name);
                var user = await GetCurrentUserAsync();

                if (user != null)
                {
                    var profile = await context.BusinessProfiles
                        .Include(p => p.ContactRequests)
                        .FirstOrDefaultAsync(p => p.User.Id == user.Id);

                    if (profile != null)
                    {
                        Console.WriteLine("Own profile found");
                        var toProfile = await context.BusinessProfiles
                            .Include(p => p.User)
                            .Include(p => p.ContactRequests)
                            .FirstOrDefaultAsync(p => p.ProfileId == contactRequest.ToProfileId);
                        
                        if (toProfile != null)
                        {
                            var lastRequestSend = (
                                from requests in profile.ContactRequests
                                where requests.ToId == contactRequest.ToProfileId && requests.Date > DateTime.UtcNow.AddDays(-7)
                                select requests
                            ).FirstOrDefault();

                            if (lastRequestSend != null)
                            {
                                return new BadRequestJsonResult("HasSentRecently");
                            }

                            var newContactRequest = new BusinessProfileRequests
                            {
                                From = profile,
                                ToId = toProfile.ProfileId,
                                Date = DateTime.Now.ToUniversalTime(),
                                IsOpened = false
                            };

                            context.Add(newContactRequest);

                            try
                            {
                                await context.SaveChangesAsync();

                                const string view = "/Pages/Templates/Email/Business/ContactRequest";
                                string email = toProfile.Email ?? toProfile.User.Email;
                                string ProfileLink = $"{Request.Scheme}://{Request.Host.Value}/discover/profile/{profile.ProfileId}";

                                var model = new ContactRequestViewModel
                                {
                                    ContactRequest = newContactRequest,
                                    ProfileLink = ProfileLink
                                };

                                var htmlBody = await razorRenderer.RenderViewToStringAsync($"{view}Html.cshtml", model);
                                var textBody = await razorRenderer.RenderViewToStringAsync($"{view}Text.cshtml", model);

                                await appEmailSender.SendEmailAsync(email, Constants.WithAppTitle("New Contact Request"), htmlBody, textBody);

                                return Ok(new { newContactRequest.RequestId, newContactRequest.Date });
                            }
                            catch
                            {
                                throw;
                            }
                        }

                        return new BadRequestJsonResult("NoToProfile");
                    }

                    return new BadRequestJsonResult("NoOwnProfile");
                }

                return NotFound(new { userNotFound = User.Identity.Name });
            }

            return BadRequest(ModelState);
        }

        [HttpGet("ContactRequests/{page?}/{perPage?}")]
        public async Task<IActionResult> ContactRequests(int page = 1, int perPage = 10)
        {
            var user = await userManager.FindByEmailAsync(User.Identity.Name);

            if (user != null)
            {
                var profile = await context.BusinessProfiles
                    .FirstOrDefaultAsync(p => p.User.Id == user.Id);

                if (profile != null)
                {
                    var requests = (
                        from req in context.BusinessContactRequests
                        where req.FromId == profile.ProfileId || req.ToId == profile.ProfileId
                        orderby req.Date descending
                        select new {
                            req.RequestId,
                            req.Date,
                            req.IsOpened,
                            req.FromId,
                            req.ToId,
                            ConnectionCompanyName = (req.FromId == profile.ProfileId) ? 
                                context.BusinessProfiles.FirstOrDefault(r => r.ProfileId == req.ToId).CompanyName :
                                context.BusinessProfiles.FirstOrDefault(r => r.ProfileId == req.FromId).CompanyName
                        }
                    );

                    var data = requests.ToPagedList(page, perPage);
                    var total = requests.Count();

                    foreach(var req in data.Where(r => r.ToId == profile.ProfileId))
                    {
                        var request = context.BusinessContactRequests.Find(req.RequestId);
                        request.IsOpened = true;
                    }

                    try
                    {
                        await context.SaveChangesAsync();
                    }
                    catch {}

                    var newContactRequests = (
                        from req in context.BusinessContactRequests
                        where req.ToId == profile.ProfileId && req.IsOpened == false
                        select req
                    ).ToList().Count();

                    return Ok(new { data, total, newContactRequests });
                }

                return new BadRequestJsonResult("NoOwnProfile");
            }

            return NotFound(new { userNotFound = User.Identity.Name });
        }

        private Dictionary<string, object> GetActivitiesOptions()
        {
            return new CollectionToDictionary<BusinessActivitiesOptions>(
                context.BusinessActivitiesOptions.ToList()
            ).Convert(i => i.ActivityId.ToString(), i => i.ActivityOptionAlias);
        }

        private Task<ApplicationUser> GetCurrentUserAsync() => userManager.GetUserAsync(HttpContext.User);

        private async Task<IQueryable<dynamic>> GetProfileData(
            string userId = null, 
            long profileId = 0, 
            bool withNewContactRequestsCounter = false,
            bool withLastContactRequestSend = false)
        {
            var OtherActivitiesList = (
                from profile in context.BusinessProfiles
                    .Include(p => p.OtherActivities)
                where profile.User.Id == userId || profile.ProfileId == profileId
                select profile.OtherActivities).ToList();

            var OtherActivities = new CollectionToDictionary<BusinessProfileOtherActivities>(OtherActivitiesList)
                .Convert(i => i.ActivityAlias, i => i.OtherText);

            var currentUser = await GetCurrentUserAsync();
            long currentUserProfileId = 0;
            if (currentUser != null)
            {
                var currentUserProfile = context.BusinessProfiles.Where(p => p.UserId == currentUser.Id).FirstOrDefault();
                if (currentUserProfile != null)
                    currentUserProfileId = currentUserProfile.ProfileId;
            }

            return
                from profile in context.BusinessProfiles
                    .Include(p => p.ContactPerson)
                    .Include(p => p.CompanyLocation)
                    .Include(p => p.OtherActivities)
                    // .Include(p => p.ContactRequests)
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
                    OtherActivities,
                    NewContactRequests = withNewContactRequestsCounter == true ? (
                        from requests in context.BusinessContactRequests
                        where requests.ToId == profile.ProfileId && requests.IsOpened == false
                        select requests
                    ).Count() : 0,
                    LastContactRequestSend = withLastContactRequestSend == true && currentUserProfileId != 0 ? (
                        from requests in context.BusinessContactRequests
                        where requests.FromId == currentUserProfileId && requests.ToId == profile.ProfileId
                        orderby requests.Date descending
                        select new {
                            requests.FromId,
                            requests.ToId,
                            requests.Date
                        }
                    ).FirstOrDefault() : null
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
