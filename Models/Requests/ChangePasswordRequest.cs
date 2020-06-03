using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class ChangePasswordRequest
    {
        [Required]
        // [DataType(DataType.Password)]
        public string CurrentPassword { get; set; }

        [Required]
        // [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [Required]
        // [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
