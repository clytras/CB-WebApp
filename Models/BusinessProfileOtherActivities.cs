using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CERTHB2B.Models
{
    public class BusinessProfileOtherActivities
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long OtherActivityId { get; set; }

        [Required]
        public string ActivityAlias { get; set; }

        public string OtherText { get; set; }

        public long ProfileId { get; set; }

        [JsonIgnore]
        public BusinessProfile Profile { get; set; }
    }
}
