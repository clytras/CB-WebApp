using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class ContentBlockRequest
    {
        [Required]
        public string BindToContent { get; set; }
        public string Content { get; set; }
    }
}
