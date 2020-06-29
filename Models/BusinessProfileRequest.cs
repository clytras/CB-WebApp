using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CERTHB2B.Models
{
    public class BusinessProfileRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long RequestId { get; set; }


        public long FromId { get; set; }
        public BusinessProfile From { get; set; }

        // public long? ToId { get; set; }
        public long ToId { get; set; }
        public BusinessProfile To { get; set; }

        // [Required]
        // public DateTime Date { get; set; }

        // [DefaultValue(false)]
        // public bool IsOpened { get; set; } = false;
    }
}
