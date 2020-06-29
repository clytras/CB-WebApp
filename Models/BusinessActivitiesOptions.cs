using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CERTHB2B.Models
{
    public class BusinessActivitiesOptions
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ActivityId { get; set; }

        [Required]
        [StringLength(1000)]
        public string ActivityOptionAlias { get; set; }

        [DefaultValue(0)]
        public int Shorting { get; set; }
    }
}
