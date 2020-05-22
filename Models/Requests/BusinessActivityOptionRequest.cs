using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EKETAGreenmindB2B.Models.Requests
{
    public class BusinessActivityOptionRequest
    {
        [Required]
        [StringLength(1000)]
        public string ActivityOptionAlias { get; set; }
    }
}
