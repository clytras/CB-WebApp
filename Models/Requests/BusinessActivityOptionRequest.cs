using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class BusinessActivityOptionRequest
    {
        [Required]
        [StringLength(1000)]
        public string ActivityOptionAlias { get; set; }
    }
}
