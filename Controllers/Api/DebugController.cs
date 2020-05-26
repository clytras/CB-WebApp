using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using CERTHB2B.Models;
using CERTHB2B.Models.Requests;
using CERTHB2B.CustomResults;
using CERTHB2B.ViewModels;
using CERTHB2B.ViewModels.Account;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Text.Encodings.Web;
using Devolutions.Zxcvbn;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using CERTHB2B.Data;
using CERTHB2B.Services;
using System.Collections.ObjectModel;

namespace CERTHB2B.Controllers.Api
{
    // public class CustomUnauthorizedResult : JsonResult
    // {
    //     public CustomUnauthorizedResult(string errorCode, int statusCode = StatusCodes.Status401Unauthorized)
    //         : base(new { errorCode })
    //     {
    //         StatusCode = statusCode;
    //     }
    // }

    // public class CustomBadRequestResult : JsonResult
    // {
    //     public CustomBadRequestResult(string errorCode, int statusCode = StatusCodes.Status400BadRequest)
    //         : base(new { errorCode })
    //     {
    //         StatusCode = statusCode;
    //     }
    // }

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DebugController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private SignInManager<ApplicationUser> signInManager;
        private readonly ApplicationDbContext context;
        private readonly IEmailSender emailSender;
        private readonly IRazorViewToStringRenderer razorRenderer;
        private readonly CERTHB2B.Services.IAppEmailSender appEmailSender;

        public DebugController(
            UserManager<ApplicationUser> userMgr, 
            SignInManager<ApplicationUser> signinMgr, 
            ApplicationDbContext dbContext,
            IEmailSender emailSndr,
            CERTHB2B.Services.IAppEmailSender appEmailSndr,
            IRazorViewToStringRenderer razorRndr)
        {
            userManager = userMgr;
            signInManager = signinMgr;
            context = dbContext;
            emailSender = emailSndr;
            appEmailSender = appEmailSndr;
            razorRenderer = razorRndr;
        }

        public ActionResult Index()
        {
            string TestingThis = "Όλα καλά!!!!";

            // return Ok(new string[] {"Auth Test!!!"});
            return Ok(new
            {
                TestingThis,
                Testing = "Όλα καλά!"
            });
        }

        public class Option
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        [HttpGet]
        public IActionResult TestObjectKeys()
        {
            // string Testing = "This test!!!";
            // var obj = new { ThisKey = "ThisKey" };

            // return Ok(new Dictionary<string, object>()
            // {
            //     { "MyTest", "MyValue" },
            //     { "MoreTest", "Some Value" },
            //     { obj.ThisKey, Testing }
            // });

            var options = new List<dynamic>()
            {
                new Option() {
                    Name = "First",
                    Value = "This is the first"
                },
                new Option() {
                    Name = "Second",
                    Value = "This is the second!"
                }
            };

            var result = new Dictionary<string, object>();

            options.ForEach(o => result.Add(o.Name, o.Value));

            return Ok(result);
        }

        [HttpGet]
        public IActionResult TestModelGet()
        {
            // return Ok(new { Test = "Testing!!!" });
            // return Ok(new[] { "Testing 1!!!", "Test 2" });
            return Ok(context.ContentBlock.Select(b => b.Content).ToArray());

            // return Ok((from b in context.ContentBlock where b.BindToContent == "RegisterSuccess" select b).ToArray());
            // return Ok((from b in context.ContentBlock where b.BindToContent == "RegisterSuccess" select b.Content).ToList().ToArray());
        }

        [HttpGet]
        public string[] TestModelStr()
        {
            // return Ok(new { Test = "Testing!!!" });

            string uid = "12345465";
            string code = "abcdefg";

            return new[] {
                Request.Host.Value,
                Request.Path.Value,
                Request.PathBase.Value,
                Request.Protocol,
                Request.Scheme,
                Url.ActionLink($"/confirm-email/{uid}/{code}", "account"),
                Url.RouteUrl($"account/confirm-email/{uid}/{code}")
            };
        }

        // [HttpGetAttribute("TestEmail")]
        // public IActionResult TestEmail()
        // {
        //     emailSender.SendEmailAsync("christos.lytras@gmail.com", "Confirm your email",
        //         $"Please confirm your account by clicking here.").Wait();
            
        //     return Ok();
        // }

        [HttpGet]
        public async Task<IActionResult> TestRazorTamplate()
        {
            const string view = "/Pages/Templates/Email/Account/ConfirmationCode";

            var model = new ConfirmationCodeViewModel("1234", "Code!", "https://myconfiormation");

            var htmlBody = await razorRenderer.RenderViewToStringAsync($"{view}Html.cshtml", model);
            var textBody = await razorRenderer.RenderViewToStringAsync($"{view}Text.cshtml", model);

            await appEmailSender.SendEmailAsync("christos.lytras@gmail.com", "Welcome and Confirm", htmlBody, textBody);

            return Ok();
        }

        [HttpPost]
        // [AllowAnonymous]
        [Authorize]
        // [ValidateAntiForgeryToken]
        public IActionResult TestPostParamsAntiForgery(LoginRequest login)
        {
            if (ModelState.IsValid)
            {
                return Ok(new {
                    TheUser = login.Email,
                    login.Password,
                    SessionUser = HttpContext.User.Identity.Name
                });
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        [Authorize]
        public string Data()
        {
            return "You got the data!";
        }
    }
}
