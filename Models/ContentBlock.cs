using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CERTHB2B.Models
{
    public class ContentBlock
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long BlockId { get; set; }
        public string BindToContent { get; set; }
        public string Content { get; set; }
        public bool? Locked { get; set; }
    }
}
