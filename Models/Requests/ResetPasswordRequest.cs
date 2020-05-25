using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class ResetPasswordRequest
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string ConfirmationCode { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
