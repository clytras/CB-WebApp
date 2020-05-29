using System;
using Microsoft.AspNetCore.Identity;
using CERTHB2B.Models;
using CERTHB2B.Utils;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using Bogus;
using static Bogus.DataSets.Name;
using Bogus.DataSets;
using System.Collections.Generic;

namespace CERTHB2B.Data.Seeds
{
    public partial class SeedUsersWithProfiles
    {
        private ApplicationDbContext context;
        private UserManager<ApplicationUser> userManager;
        private RoleManager<IdentityRole> roleManager;
        public SeedUsersWithProfiles(
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userMgr, 
            RoleManager<IdentityRole> roleMgr)
        {
            context = dbContext;
            userManager = userMgr;
            roleManager = roleMgr;
        }

        public async Task Seed(int howMany)
        {
            Console.WriteLine("Running Seed 'SeedUsersWithProfiles' generating {0} users with profiles", howMany);

            Randomizer.Seed = new Random(DateTime.Now.Millisecond);
            string defaultUserPassword = "Ideacom2020$";

            var faker = new Faker("en");

            for (int count = 1; count <= howMany; count++)
            {
                var gender = faker.PickRandom<Gender>();
                var user = new ApplicationUser();
                var userEmail = faker.Internet.Email(faker.Name.FirstName(gender), faker.Name.LastName(gender));

                Console.WriteLine("Adding user with email '{0}'", userEmail);

                user.UserName = userEmail;
                user.Email = userEmail;
                user.EmailConfirmed = true;
                user.LockoutEnabled = true;
                user.TwoFactorEnabled = false;
                user.RegistrationDate = faker.Date.Past();

                IdentityResult result = await userManager.CreateAsync(user, defaultUserPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, Constants.IdentityRoleUserName);

                    var profile = new BusinessProfile()
                    {
                        IsProfileVisible = faker.Random.Int(1, 100) < 90, // 95% visible profiles
                        CompanyName = faker.Company.CompanyName(),
                        Email = faker.Random.Int(1, 100) < 50 ? null : faker.Internet.Email(),
                        Telephone = faker.Phone.PhoneNumber(),
                        UserId = user.Id
                    };

                    // // 80% To have a CompanyLocation
                    // if (faker.Random.Int(1, 100) < 85)
                    // {
                        var location = new BusinessAddress()
                        {
                            StreetAddress = faker.Address.StreetAddress(),
                            City = faker.Address.City(),
                            PostalCode = faker.Address.ZipCode(),
                            Country = faker.Address.CountryCode(Iso3166Format.Alpha3)
                        };

                        // 40% To have a AddressLine2
                        if (faker.Random.Int(1, 100) < 40)
                            location.AddressLine2 = faker.Address.SecondaryAddress();

                        // 60% To have a Region
                        if (faker.Random.Int(1, 100) < 60)
                            location.Region = faker.Address.County();

                        profile.CompanyLocation = location;
                    // }

                    // // 85% To have a ContactPerson
                    // if (faker.Random.Int(1, 100) < 85)
                    // {
                        var contactGender = faker.PickRandom<Gender>();
                        var contactFullname = faker.Name.FullName(contactGender);
                        var lastName = faker.Name.LastName(contactGender);

                        var contact = new BusinessContact()
                        {
                            Name = contactFullname
                        };

                        // 80% To have a Email and Phone
                        if (faker.Random.Int(1, 100) < 80)
                        {
                            contact.Email = faker.Internet.Email(contactFullname);

                            // 60% To have a Phone
                            if (faker.Random.Int(1, 100) < 60)
                                contact.Telephone = faker.Phone.PhoneNumber();
                        }

                        profile.ContactPerson = contact;
                    // }

                    var activities = faker.Random.ListItems(BusinessProfileDataInitializer.ActivitiesOptions);
                    profile.Activities = (
                        from p in context.BusinessActivitiesOptions
                        where activities.Any(v => p.ActivityOptionAlias.Equals(v))
                        select new BusinessProfileActivities() {
                            ActivityId = p.ActivityId
                        }).ToList();

                    context.BusinessProfiles.Add(profile);
                    await context.SaveChangesAsync();

                    var otherHeads = faker.Random.ListItems(new List<string>() { "TopicsOfInterest", "Offer", "Request" }, faker.Random.Int(0, 3));

                    if (otherHeads.Count > 0)
                    {
                        foreach (var otherHead in otherHeads)
                        {
                            context.BusinessProfileOtherActivities.Add(new BusinessProfileOtherActivities()
                            {
                                ActivityAlias = otherHead,
                                OtherText = faker.Lorem.Sentence(),
                                ProfileId = profile.ProfileId
                            });
                        }

                        await context.SaveChangesAsync();
                    }
                }
                else
                {
                    Console.WriteLine("Could not create fake user with '{0}'", userEmail);
                }
            }

            Console.WriteLine("Accounts generation finished.");
        }
    }
}
