using System;
using Microsoft.AspNetCore.Identity;
using EKETAGreenmindB2B.Models;
using EKETAGreenmindB2B.Utils;

namespace EKETAGreenmindB2B.Data.Seeds
{
    public partial class IdentityDataInitializer
    {
        public static void SeedData(UserManager<ApplicationUser> userManager, 
                                    RoleManager<IdentityRole> roleManager)
        {
            SeedRoles(roleManager);
            SeedUsers(userManager);
        }

        public static void SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.RoleExistsAsync(Constants.IdentityRoleAdminName).Result)
            {
                IdentityRole role = new IdentityRole();
                role.Name = Constants.IdentityRoleAdminName;
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }

            if (!roleManager.RoleExistsAsync(Constants.IdentityRoleEditorName).Result)
            {
                IdentityRole role = new IdentityRole();
                role.Name = Constants.IdentityRoleEditorName;
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }

            if (!roleManager.RoleExistsAsync(Constants.IdentityRoleUserName).Result)
            {
                IdentityRole role = new IdentityRole();
                role.Name = Constants.IdentityRoleUserName;
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }
        }

        public static void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            string userEmail = "christos.lytras@gmail.com";

            if (userManager.FindByNameAsync(userEmail).Result == null)
            {
                ApplicationUser user = new ApplicationUser();
                user.UserName = userEmail;
                user.Email = userEmail;
                user.EmailConfirmed = true;
                user.LockoutEnabled = false;
                user.TwoFactorEnabled = false;
                user.RegistrationDate = DateTime.UtcNow;

                IdentityResult result = userManager.CreateAsync(user, "Christos2020$").Result;

                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "Admin").Wait();
                }
            }

            userEmail = "chris@nekya.com";

            if (userManager.FindByNameAsync(userEmail).Result == null)
            {
                ApplicationUser user = new ApplicationUser();
                user.UserName = userEmail;
                user.Email = userEmail;
                user.EmailConfirmed = true;
                user.TwoFactorEnabled = false;
                user.RegistrationDate = DateTime.UtcNow;

                IdentityResult result = userManager.CreateAsync(user, "Christos2020$").Result;

                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "Editor").Wait();
                }
            }

            userEmail = "zkr.tmp@gmail.com";

            if (userManager.FindByNameAsync(userEmail).Result == null)
            {
                ApplicationUser user = new ApplicationUser();
                user.UserName = userEmail;
                user.Email = userEmail;
                user.EmailConfirmed = true;
                user.TwoFactorEnabled = false;
                user.RegistrationDate = DateTime.UtcNow;

                IdentityResult result = userManager.CreateAsync(user, "Christos2020$").Result;

                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "User").Wait();
                }
            }
        }
    }
}
