using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CERTHB2B.Models
{
    public class BusinessProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ProfileId { get; set; }

        public bool? IsProfileVisible { get; set; }

        [Required]
        public string CompanyName { get; set; }

        // We won't require email because we offer the option
        // to use the account email instead of providing it again
        public string Email { get; set; }

        [Required]
        public string Telephone { get; set; }

        [JsonIgnore]
        public ApplicationUser User { get; set; }

        public BusinessAddress CompanyLocation { get; set; }

        public BusinessContact ContactPerson { get; set; }

        public ICollection<BusinessProfileActivities> Activities { get; set; }

        public ICollection<BusinessProfileOtherActivities> OtherActivities { get; set; }
    }
}
