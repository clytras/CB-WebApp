using System;
using Microsoft.AspNetCore.Identity;
using EKETAGreenmindB2B.Models;

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
            if (!roleManager.RoleExistsAsync("Admin").Result)
            {
                IdentityRole role = new IdentityRole();
                role.Name = "Admin";
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }

            if (!roleManager.RoleExistsAsync("Editor").Result)
            {
                IdentityRole role = new IdentityRole();
                role.Name = "Editor";
                IdentityResult roleResult = roleManager.
                CreateAsync(role).Result;
            }

            if (!roleManager.RoleExistsAsync("User").Result)
            {
                IdentityRole role = new IdentityRole();
                role.Name = "User";
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

                IdentityResult result = userManager.CreateAsync(user, "Christos2020$").Result;

                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "User").Wait();
                }
            }
        }
    }
}
