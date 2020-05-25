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
    public class BusinessAddress
    {
        [Key, ForeignKey("BusinessProfile")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long AddressId { get; set; }

        [Required]
        public string StreetAddress { get; set; }

        [Required]
        public string AddressLine2 { get; set; }

        [Required]
        [MaxLength(50)]
        public string City { get; set; }

        [Required]
        [MaxLength(50)]
        public string Region { get; set; }

        [Required]
        [MaxLength(10)]
        public string PostalCode { get; set; }

        [Required]
        [MaxLength(3)]
        public string Country { get; set; }

        public long ProfileId { get; set; }

        [JsonIgnore]
        public BusinessProfile Profile { get; set; }
    }
}
