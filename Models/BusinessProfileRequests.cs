using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CERTHB2B.Models
{
    public class BusinessProfileRequests
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long RequestId { get; set; }

        public long FromId { get; set; }
        // [ForeignKey("FromId")]
        public BusinessProfile From { get; set; }

        // public long? ToId { get; set; }
        public long? ToId { get; set; }
        // [ForeignKey("ToId")]
        // public BusinessProfile To { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [DefaultValue(false)]
        public bool IsOpened { get; set; } = false;
        // public string DeletedProfileInfo { get; set; }
    }


    // public class BusinessProfileRequests
    // {
    //     public long ProfileId { get; set; }
    //     public BusinessProfile Profile { get; set; }
    //     public long RequestId { get; set; }
    //     public BusinessProfileRequest Request { get; set; }
    // }
}
