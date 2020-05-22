using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EKETAGreenmindB2B.Models.Requests
{
    public class BusinessProfilePutRequest
    {
        [Required]
        public BusinessProfile Profile { get; set; }
        [Required]
        public string[] ActivitiesOptions { get; set; }
    }
}
