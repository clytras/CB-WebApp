using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CERTHB2B.Models;
using CERTHB2B.Models.Requests;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using CERTHB2B.Data;
using CERTHB2B.Services;

namespace CERTHB2B.Controllers.Api
{
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
            string TestingThis = "OK$";

            // return Ok(new string[] {"Auth Test"});
            return Ok(new
            {
                TestingThis,
                Testing = "OK$$"
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
            // string Testing = "Test obj keys";
            // var obj = new { ThisKey = "ThisKey" };

            // return Ok(new Dictionary<string, object>()
            // {
            //     { "MyTest", "MyValue" },
            //     { "MoreTest", "Some Value" },
            //     { obj.ThisKey, Testing }
            // });

            // Working ------------------------------------------------
            var options = new List<dynamic>()
            {
                new {
                    Name = "First",
                    Value = "This is the first"
                },
                new {
                    Name = "Second",
                    Value = "This is the second!"
                },
                new {
                    Name = "TRhird",
                    Value = "This is the 3rd!"
                }
            };

            // var result = new Dictionary<string, object>();
            var result = new ListToDictionary<dynamic>(options)
                .Convert(o => o.Name, o => o.Value);

            // options.ForEach(o => result.Add(o.Name, o.Value));

            return Ok(result);
        }

        private class ListToDictionary<T> : Dictionary<string, object>
        {
            // private readonly Dictionary<string, object> dictionary;

            private List<T> list;

            public ListToDictionary(List<T> list)
            {
                this.list = list;
            }

            public Dictionary<string, object> Convert(Func<T, string> key, Func<T, string> value)
            {
                var result = new Dictionary<string, object>();

                list.ForEach(item => result.Add(key(item), value(item)));

                return result;
            }
        }

        [HttpGet]
        public IActionResult TestModelGet()
        {
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
        //     emailSender.SendEmailAsync("@gmail.com", "Confirm your email",
        //         $"Please confirm your account by clicking here.").Wait();
            
        //     return Ok();
        // }

        // [HttpGet]
        // public async Task<IActionResult> TestRazorTamplate()
        // {
        //     const string view = "/Pages/Templates/Email/Account/ConfirmationCode";

        //     var model = new ConfirmationCodeViewModel("1234", "Code", "https://myconfirmation");

        //     var htmlBody = await razorRenderer.RenderViewToStringAsync($"{view}Html.cshtml", model);
        //     var textBody = await razorRenderer.RenderViewToStringAsync($"{view}Text.cshtml", model);

        //     await appEmailSender.SendEmailAsync("@gmail.com", "Welcome and Confirm", htmlBody, textBody);

        //     return Ok();
        // }

        [HttpPost]
        // [AllowAnonymous]
        // [Authorize]
        [ValidateAntiForgeryToken]
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

        [HttpPut]
        public IActionResult TestPutParams(List<string> testingParams)
        {
            return Ok(testingParams);
        }
    }
}
