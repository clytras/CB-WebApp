using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
