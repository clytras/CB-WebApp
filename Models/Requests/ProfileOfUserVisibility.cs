using System;
using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class ProfileOfUserVisibility
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public bool Visibility { get; set; }
    }
}
