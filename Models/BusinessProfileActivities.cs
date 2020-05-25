using CERTHB2B.Data;
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
    public class BusinessProfileActivities
    {
        [JsonIgnore]
        [ForeignKey("BusinessProfile")]
        public long ProfileId { get; set; }

        [JsonIgnore]
        public BusinessProfile Profile { get; set; }

        public long ActivityId { get; set; }
    }
}
