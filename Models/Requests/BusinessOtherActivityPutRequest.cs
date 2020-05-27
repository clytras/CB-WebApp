using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class BusinessOtherActivityPutRequest
    {
        [Required]
        public string ActivityAlias { get; set; }

        public string OtherText { get; set; }
    }
}
