using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EKETAGreenmindB2B.Models
{
    public class BusinessProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ProfileId { get; set; }

        [Required]
        public string CompanyName { get; set; }

        // We won't require email because we offer the option
        // to use the account email instead of providing it again
        public string Email { get; set; }

        [Required]
        public string Telephone { get; set; }

        // [Required]
        // [ForeignKey("ApplicationUser")]
        // public string UserId { get; set; }

        // [Required]
        [JsonIgnore]
        public ApplicationUser User { get; set; }

        // [Required]
        public BusinessAddress CompanyLocation { get; set; }

        // [ForeignKey("BusinessContact")]
        // public long ContactId { get; set; }

        // [ForeignKey("BusinessAddress")]
        // public long AddressId { get; set; }

        // [ForeignKey("BusinessContact")]
        // [Required]
        public BusinessContact ContactPerson { get; set; }

        // [ForeignKey("BusinessProfileActivities")]
        // public long ActivityId { get; set; }
        // public ICollection<BusinessProfileActivities> Activities { get; set; }

        // public ICollection<BusinessProfileActivities> Activities { get; } = new List<BusinessProfileActivities>();
        public ICollection<BusinessProfileActivities> Activities { get; set; }

        // public long OtherActivityId { get; set; }
        public ICollection<BusinessProfileOtherActivities> OtherActivities { get; set; }
    }
}
