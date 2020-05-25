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
    public class BusinessActivitiesOptions
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ActivityId { get; set; }

        [Required]
        [StringLength(1000)]
        public string ActivityOptionAlias { get; set; }
        
    }
}
