using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EKETAGreenmindB2B.Models.Requests
{
    public class ConfirmEmailRequest
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string ConfirmationCode { get; set; }
    }
}
