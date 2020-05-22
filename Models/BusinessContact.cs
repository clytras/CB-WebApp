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
    public class BusinessContact
    {
        [Key, ForeignKey("BusinessProfile")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ContactId { get; set; }

        [Required]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string Telephone { get; set; }

        // [ForeignKey("BusinessProfile")]
        // [JsonIgnore]
        public long ProfileId { get; set; }

        [JsonIgnore]
        // public ICollection<BusinessProfile> Profiles { get; set; }
        public BusinessProfile Profile { get; set; }
    }
}
