using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class BusinessProfilePutRequest
    {
        [Required]
        public BusinessProfile Profile { get; set; }
        [Required]
        public string[] ActivitiesOptions { get; set; }
    }
}
