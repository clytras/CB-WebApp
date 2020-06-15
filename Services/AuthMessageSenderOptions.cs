
namespace CERTHB2B.Services
{
    public class AuthMessageSenderOptions
    {
        public string SendGridUser { get; set; }
        public string SendGridKey { get; set; }
        public string EmailSendFrom { get; set; }
        public string EmailSendAs { get; set; }
    }
}
