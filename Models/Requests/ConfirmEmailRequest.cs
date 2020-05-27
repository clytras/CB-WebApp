using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class ConfirmEmailRequest
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string ConfirmationCode { get; set; }
    }
}
