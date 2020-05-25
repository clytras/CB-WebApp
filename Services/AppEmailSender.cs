using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CERTHB2B.Services
{
    // Code from: https://github.com/aspnet/Entropy/blob/dev/samples/Mvc.RenderViewToString/RazorViewToStringRenderer.cs
    public interface IAppEmailSender
    {
        Task SendEmailAsync(string email, string subject, string htmlContent, string textContent);
    }

    public class AppEmailSender : IAppEmailSender
    {
        AuthMessageSenderOptions Options;

        public AppEmailSender(IOptions<AuthMessageSenderOptions> options)
        {
            Options = options.Value;
        }
        public Task SendEmailAsync(string email, string subject, string htmlContent, string textContent)
        {
            var client = new SendGridClient(Options.SendGridKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("noreply@nekya.com", Options.SendGridUser),
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
