using System;
using System.Linq;
using System.Collections.Generic;
using CERTHB2B.Models;
using CERTHB2B.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CERTHB2B.Data.Seeds
{
    public partial class IdentityModelInitializer
    {
        public static void SeedUsersAndRoles(
            EntityTypeBuilder roles, 
            EntityTypeBuilder users, 
            EntityTypeBuilder userRoles)
        {
            var applicationRoles = new List<dynamic>
            {
                new {
                    Id = "24d76187-397c-44aa-bc45-1970ae5adcf3",
                    Name = Constants.IdentityRoleAdminName,
                    ConcurrencyStamp = "d79bb754-16ca-4417-b106-31951e2fb671"
                },
                new {
                    Id = "97c19e19-d4ce-46e7-922b-cc954cfe531d",
                    Name = Constants.IdentityRoleEditorName,
                    ConcurrencyStamp = "7409dfa1-0a1d-4c65-89e9-d04ab259ec03"
                },
                new {
                    Id = "540cf8e7-57d9-4b81-bb5a-898c7f7649c1",
                    Name = Constants.IdentityRoleUserName,
                    ConcurrencyStamp = "458b4ba1-a711-43dd-b0ea-ea0c930214bb"
                },
            };

            roles.HasData(applicationRoles.Select(r => new IdentityRole
            {
                Id = r.Id,
                Name = r.Name,
                NormalizedName = r.Name.ToUpper(),
                ConcurrencyStamp = r.ConcurrencyStamp
            }));
 
            var applicationUsers = new Dictionary<string, dynamic>
            {
                { "admin@nekya.com", new { 
                    Id = "818e3ae4-dfaa-4e2e-a042-2db203e8febb", 
                    RoleId = "24d76187-397c-44aa-bc45-1970ae5adcf3",
                    PasswordHash = "AQAAAAEAACcQAAAAEHzf5sE4/pDew5etQujm8dO/17HHohsdhX84KD8PrlWVdpNdRrwRVuDDp06Af8lA0Q==",
                    SecurityStamp = "CEAA272E6A8028468585E33BEE7402BB",
                    ConcurrencyStamp = "dd4f1dee-d24b-4e68-b408-c9375c624989" }},
                { "editor@nekya.com", new {
                    Id = "bedbc467-6cd4-4342-8658-851556be8ce0",
                    RoleId = "97c19e19-d4ce-46e7-922b-cc954cfe531d",
                    PasswordHash = "AQAAAAEAACcQAAAAENt08bjzGZwulojjOeJZ4ilqVN9ATxdXxj6qPvO2V/6B0culdHIRCFaxMPCTjg0eSQ==",
                    SecurityStamp = "DC8A808B01077C43B268EAE077B7EC2E",
                    ConcurrencyStamp = "0063de9c-29c3-4f58-bb27-8691f18811f8",
                    LockoutEnd = new DateTimeOffset(new DateTime(2070, 5, 26, 0, 0, 0, 0, DateTimeKind.Unspecified)) }},
                { "user@nekya.com", new {
                    Id = "182651c4-7698-4745-ad3e-207edba16b1e",
                    RoleId = "540cf8e7-57d9-4b81-bb5a-898c7f7649c1",
                    PasswordHash = "AQAAAAEAACcQAAAAEJNDFzILfnoH3q61fJAwYdTjd+a47AzAVqpvijjS4uyaAbAOjWYNER7J60HYtaLl3Q==",
                    SecurityStamp = "9D96BC88CAC7BC479DA8B901743749BF",
                    ConcurrencyStamp = "39b8e7f7-9b5d-4abd-826c-4af31d77f229",
                    LockoutEnd = new DateTimeOffset(new DateTime(2070, 5, 26, 0, 0, 0, 0, DateTimeKind.Unspecified)) }}
            };

            users.HasData(applicationUsers.Select(u => new ApplicationUser {
                Id = u.Value.Id,
                UserName = u.Key,
                NormalizedUserName = u.Key.ToUpper(),
                Email = u.Key,
                NormalizedEmail = u.Key.ToUpper(),
                EmailConfirmed = true,
                PasswordHash = u.Value.PasswordHash,
                // Security stamp is a GUID bytes to HEX string
                SecurityStamp = u.Value.SecurityStamp,
                ConcurrencyStamp = u.Value.ConcurrencyStamp,
                TwoFactorEnabled = false,
                RegistrationDate = new DateTime(2020, 5, 26, 11, 23, 40, 221, DateTimeKind.Utc),
                LockoutEnabled = true,
                LockoutEnd = u.Value.GetType().GetProperty("LockoutEnd") != null ? u.Value.LockoutEnd : null
            }));

            userRoles.HasData(applicationUsers.Select(u => new IdentityUserRole<string>
            {
                UserId = u.Value.Id,
                RoleId = u.Value.RoleId
            }));
        }

        private static string GenerateSecurityStamp()
        {
            var guid = Guid.NewGuid();
            return String.Concat(Array.ConvertAll(guid.ToByteArray(), b => b.ToString("X2")));
        }
    }
}
