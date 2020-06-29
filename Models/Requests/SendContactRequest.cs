using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class SendContactRequest
    {
        [Required]
        public long ToProfileId { get; set; }
    }
}
