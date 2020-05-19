using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EKETAGreenmindB2B.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual DateTime? LastLoginTime { get; set; }
        public virtual DateTime? RegistrationDate { get; set; }
    }
}
