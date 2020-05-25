using System;
using Microsoft.AspNetCore.Identity;
using CERTHB2B.Models;
using IdentityServer4.Services;
using System.Threading.Tasks;
using IdentityServer4.Models;
using System.Collections.Generic;
using System.Security.Claims;
using IdentityModel;

namespace CERTHB2B.Services
{
    public class ProfileService : IProfileService
    {
        protected UserManager<ApplicationUser> mUserManager;

        public ProfileService(UserManager<ApplicationUser> userManager)
        {
            mUserManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            ApplicationUser user = await mUserManager.GetUserAsync(context.Subject);

            IList<string> roles = await mUserManager.GetRolesAsync(user);

            IList<Claim> roleClaims = new List<Claim>();
            foreach (string role in roles)
            {
                roleClaims.Add(new Claim(JwtClaimTypes.Role, role));
            }

            context.IssuedClaims.Add(new Claim(JwtClaimTypes.Name, user.UserName));
            context.IssuedClaims.AddRange(roleClaims);
            context.IssuedClaims.Add(new Claim(JwtClaimTypes.EmailVerified, user.EmailConfirmed.ToString()));
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }
}
