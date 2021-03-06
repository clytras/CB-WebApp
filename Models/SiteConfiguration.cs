using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CERTHB2B.Models
{
    public class SiteConfiguration
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ConfigId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Value { get; set; }
    }
}
