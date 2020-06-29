using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class DeleteAccountRequest
    {
        [Required]
        // [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
