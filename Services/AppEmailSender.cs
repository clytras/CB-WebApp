using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace CERTHB2B.Services
{
    // Code from: https://github.com/aspnet/Entropy/blob/dev/samples/Mvc.RenderViewToString/RazorViewToStringRenderer.cs
    public interface IAppEmailSender
    {
        Task<Response> SendEmailAsync(string email, string subject, string htmlContent, string textContent);
    }

    public class AppEmailSender : IAppEmailSender
    {
        AuthMessageSenderOptions Options;

        public AppEmailSender(IOptions<AuthMessageSenderOptions> options)
        {
            Options = options.Value;
        }
        public Task<Response> SendEmailAsync(string email, string subject, string htmlContent, string textContent)
        {
            var client = new SendGridClient(Options.SendGridKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(Options.EmailSendFrom, Options.EmailSendAs),
                Subject = subject,
                PlainTextContent = textContent,
                HtmlContent = htmlContent
            };
            msg.AddTo(new EmailAddress(email));

            // // Disable click tracking.
            // // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }
    }
}
