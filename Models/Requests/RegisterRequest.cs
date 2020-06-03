using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Password")]
        // [DataType(DataType.Password)]
        public string Password { get; set; }

        // [DataType(DataType.Password)]
        [Display(Name = "ConfirmPassword")]
        public string ConfirmPassword { get; set; }
    }
}
