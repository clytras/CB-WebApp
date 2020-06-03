using CERTHB2B.Data.Seeds;
using CERTHB2B.Models;
using CERTHB2B.Utils;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CERTHB2B.Data
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

            modelBuilder.Entity<SiteConfiguration>()
                .HasIndex(p => p.Name)
                .IsUnique(true);

            IdentityModelInitializer.SeedUsersAndRoles(
                modelBuilder.Entity<IdentityRole>(), 
                modelBuilder.Entity<ApplicationUser>(), 
                modelBuilder.Entity<IdentityUserRole<string>>());

            modelBuilder.Entity<ContentBlock>()
                .Property(p => p.Locked)
                .HasDefaultValue(false);

            modelBuilder.Entity<BusinessProfileActivities>()
                .HasKey(t => new { t.ProfileId, t.ActivityId });

            modelBuilder.Entity<BusinessActivitiesOptions>()
                .HasAlternateKey(a => a.ActivityOptionAlias);

            // modelBuilder.Entity<BusinessProfileContactRequests>()
            //     .HasKey(e => new { e.ProfileId, e.SentToProfileId });

            // modelBuilder.Entity<BusinessProfileContactRequests>()
            //     .Property(p => p.SentToProfileId)
            //     .IsRequired(false);

            // modelBuilder.Entity<BusinessProfileContactRequests>()
            //     .HasOne(p => p.Profile)
            //     .WithMany(p => p.ContactRequestsSent)
            //     .HasForeignKey(p => p.ProfileId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<BusinessProfileContactRequests>()
            //     .HasMany(p => p.SentToProfile)
            //     .WithOne(p => p.)
            //     // .WithMany(p => p.ContactRequestsReceived)
            //     // .WithOne(p => p.ContactRequestsSent)
            //     .OnDelete(DeleteBehavior.Restrict);


            // modelBuilder.Entity<BusinessContactRequestsSent>()
            //     .HasOne(p => p.Profile)
            //     .WithMany(p => p.RequestsSent)
            //     .HasPrincipalKey(p => p.ProfileId)
            //     .HasForeignKey(p => p.ProfileSentToId);

            // modelBuilder.Entity<BusinessContactRequestsSent>()
            //     .HasMany(p => p.SentTo)
            //     .WithOne(p => p.)

            // modelBuilder.Entity<BusinessContactRequestsReceived>()
            //     .HasOne(p => p.Profile);

            // modelBuilder.Entity<BusinessProfile>()
            //     .HasMany(p => p.RequestsReceived)
            //     .WithOne(p => p.Profile)
            //     .HasForeignKey(p => p.ProfileId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<BusinessProfile>()
            //     .HasMany(p => p.RequestsSent)
            //     .WithOne(p => p.Profile)
            //     .OnDelete(DeleteBehavior.Cascade);


            // modelBuilder.Entity<BusinessContactRequestsSent>()
            //     .HasOne(p => p.Profile)
            //     .WithMany(p => p.RequestsSent)
            //     // .HasForeignKey(p => p.ProfileSentToId)
            //     .OnDelete(DeleteBehavior.Cascade);
            //     // .HasPrincipalKey(p => p.ProfileId);



            // modelBuilder.Entity<BusinessContactRequestsReceived>()
            //     .HasOne(p => p.Profile)
            //     .WithMany(p => p.RequestsReceived)
            //     .HasForeignKey(p => p.ReceivedFromId);
            //     // .OnDelete(DeleteBehavior.SetNull);
            //     // .HasPrincipalKey(p => p.ProfileId)
            //     // .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<BusinessContactRequestsReceived>()
            //     .HasOne(p => p.Profile)
            //     .WithMany(p => p.RequestsReceived)
            //     // .HasForeignKey(p => p.ReceivedFromId);
            //     .OnDelete(DeleteBehavior.SetNull);

            // modelBuilder.Entity<BusinessContactRequestsReceived>()
            //     .HasOne(p => p.ReceivedFrom)
            //     .WithMany()
            //     .OnDelete(DeleteBehavior.SetNull);


            // modelBuilder.Entity<BusinessContactRequestsReceived>()
            //     .Property(p => p.IsOpened)
            //     .HasDefaultValue(false);


            // modelBuilder.Entity<BusinessProfileRequests>()
            //     .HasKey(t => new { t.ProfileId, t.RequestId });

            // modelBuilder.Entity<BusinessProfileRequests>()
            //     .HasOne(p => p.Profile)
            //     .WithMany()
            //     .OnDelete()



            // modelBuilder.Entity<BusinessProfileRequests>()
            //     .HasOne<BusinessProfile>(p => p.To)
            //     .WithMany()
            //     .HasForeignKey(p => p.FromId)
            //     .OnDelete(DeleteBehavior.SetNull);

            // modelBuilder.Entity<BusinessProfileRequests>()
            //     .HasOne(p => p.From)
            //     .WithMany(p => p.ContactRequests)
            //     .HasForeignKey(p => p.FromId)
            //     // .IsRequired(false)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<BusinessProfileRequests>()
            //     .HasOne(p => p.To)
            //     .WithMany(p => p.ContactRequests)
            //     .HasForeignKey(p => p.ToId)
            //     .IsRequired(false)
            //     .OnDelete(DeleteBehavior.SetNull);

            // modelBuilder.Entity<BusinessProfile>()
            //     .HasMany(p => p.RequestsSent)
            //     .WithOne(p => p.From)
            //     .OnDelete(DeleteBehavior.NoAction);

            // modelBuilder.Entity<BusinessProfile>()
            //     .HasMany(p => p.RequestsReceived)
            //     .WithOne(p => p.To)
            //     .IsRequired(false)
            //     .OnDelete(DeleteBehavior.SetNull);

            // modelBuilder.Entity<BusinessProfileRequest>()
            //     .Property(p => p.IsOpened)
            //     .HasDefaultValue(false);

            modelBuilder.Entity<BusinessProfile>()
                .Property(p => p.IsProfileVisible)
                .HasDefaultValue(true);

            BusinessProfileDataInitializer.SeedBusinessActivityOptions(
                modelBuilder.Entity<BusinessActivitiesOptions>());
        }

        public DbSet<SiteConfiguration> SiteConfig { get; set; }
        public DbSet<ContentBlock> ContentBlock { get; set; }
        public DbSet<BusinessProfile> BusinessProfiles { get; set; }
        public DbSet<BusinessActivitiesOptions> BusinessActivitiesOptions { get; set; }
        public DbSet<BusinessContact> BusinessContact { get; set; }
        public DbSet<BusinessAddress> BusinessAddress { get; set; }
        public DbSet<BusinessProfileOtherActivities> BusinessProfileOtherActivities { get; set; }
        // public DbSet<BusinessProfileActivities> BusinessProfileActivities { get; set; }
        // public DbSet<BusinessContactRequestsSent> BusinessRequestsSent { get; set; }
        // public DbSet<BusinessContactRequestsReceived> BusinessRequestsReceived { get; set; }

        // public DbSet<BusinessProfileRequests> BusinessRequests { get; set; }
        public DbSet<BusinessProfileRequests> BusinessContactRequests { get; set; }
    }
}
