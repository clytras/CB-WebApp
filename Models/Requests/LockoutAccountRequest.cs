using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class LockoutAccountRequest
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public long DurationInSeconds { get; set; }
    }
}
