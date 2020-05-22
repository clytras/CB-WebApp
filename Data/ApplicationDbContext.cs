using EKETAGreenmindB2B.Models;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EKETAGreenmindB2B.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<BusinessProfileActivities>()
                .HasKey(t => new { t.ProfileId, t.ActivityId });

            modelBuilder.Entity<BusinessActivitiesOptions>()
                .HasAlternateKey(a => a.ActivityOptionAlias);
        }


        public DbSet<ContentBlock> ContentBlock { get; set; }
        public DbSet<BusinessProfile> BusinessProfiles { get; set; }
        public DbSet<BusinessActivitiesOptions> BusinessActivitiesOptions { get; set; }
        public DbSet<BusinessContact> BusinessContact { get; set; }
        public DbSet<BusinessAddress> BusinessAddress { get; set; }
        public DbSet<BusinessProfileOtherActivities> BusinessProfileOtherActivities { get; set; }
        public DbSet<BusinessProfileActivities> BusinessProfileActivities { get; set; }
    }
}
