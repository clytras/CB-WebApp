using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EKETAGreenmindB2B.Models
{
    public class ContentBlock
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long BlockId { get; set; }
        [Column("BindToContent")]
        public string BindTo { get; set; }
        public string Content { get; set; }
    }
}
