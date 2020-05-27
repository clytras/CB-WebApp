﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace CERTHB2B.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual DateTime? LastLoginTime { get; set; }
        public virtual DateTime? RegistrationDate { get; set; }
        public ICollection<IdentityRole> Roles { get; set; }
    }
}
