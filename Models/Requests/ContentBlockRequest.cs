using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CERTHB2B.Models.Requests
{
    public class ContentBlockRequest
    {
        [Required]
        public string BindToContent { get; set; }
        public string Content { get; set; }
    }
}
