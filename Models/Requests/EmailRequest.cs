using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class EmailRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
