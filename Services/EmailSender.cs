using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace CERTHB2B.Services
{
    public class EmailSender : IEmailSender
    {
        public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; } // Set only via Secret Manager

        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Execute(Options.SendGridKey, subject, message, email);
        }

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("noreply@nekya.com", Options.SendGridUser),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            // // Disable click tracking.
            // // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);

            // var client = new SendGridClient(apiKey);
            // var from = new EmailAddress("noreply@greenmind.gr", "Greenmind B2B");
            // var to = new EmailAddress(email, "Example User");
            // var plainTextContent = "and easy to do anywhere, even with C#";
            // var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
            // var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            // return client.SendEmailAsync(msg);


            // Generated from https://app.sendgrid.com/settings/api_keys

            // var sendGridClient = new SendGridClient(apiKey);

            // EmailAddress fromEmail = new EmailAddress("noreply@greenmind.gr");
            // EmailAddress toEmail = new EmailAddress(email);
            // Content content = new Content("text/plain", plainTextContent);
            // // Mail mail = new Mail(fromEmail, subject, toEmail, content);
            // var msg = MailHelper.CreateSingleEmail(fromEmail, toEmail, subject, plainTextContent, plainTextContent);

            // dynamic response = await sendGridClient.SendEmailAsync(msg);
        }
    }
}
