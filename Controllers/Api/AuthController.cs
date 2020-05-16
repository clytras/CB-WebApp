using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using EKETAGreenmindB2B.Models;
using EKETAGreenmindB2B.CustomResults;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Text.Encodings.Web;
using Devolutions.Zxcvbn;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using EKETAGreenmindB2B.Data;

namespace EKETAGreenmindB2B.Controllers.Api
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
    public class AuthController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private SignInManager<ApplicationUser> signInManager;
        private readonly ApplicationDbContext context;
        private readonly IEmailSender emailSender;

        public AuthController(
            UserManager<ApplicationUser> userMgr, 
            SignInManager<ApplicationUser> signinMgr, 
            ApplicationDbContext dbContext,
            IEmailSender emailSndr)
        {
            userManager = userMgr;
            signInManager = signinMgr;
            context = dbContext;
            emailSender = emailSndr;
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

        [HttpGet]
        public IActionResult TestModelGet()
        {
            // return Ok(new { Test = "Testing!!!" });
            // return Ok(new[] { "Testing 1!!!", "Test 2" });
            return Ok(context.ContentBlock.Select(b => b.Content).ToArray());

            // return Ok((from b in context.ContentBlock where b.BindTo == "RegisterSuccess" select b).ToArray());
            // return Ok((from b in context.ContentBlock where b.BindTo == "RegisterSuccess" select b.Content).ToList().ToArray());
        }

        [HttpGet]
        public string[] TestModelStr()
        {
            // return Ok(new { Test = "Testing!!!" });
            return new[] { "Testing 3!!!", "Test 4" };
        }

        // [HttpGetAttribute("TestEmail")]
        // public IActionResult TestEmail()
        // {
        //     emailSender.SendEmailAsync("christos.lytras@gmail.com", "Confirm your email",
        //         $"Please confirm your account by clicking here.").Wait();
            
        //     return Ok();
        // }

        [HttpPost("TestParams")]
        public IActionResult TestPostParams(LoginRequest login)
        {
            if (ModelState.IsValid)
            {
                return Ok(new {
                    TheUser = login.Email,
                    login.Password
                });
            }

            return BadRequest(ModelState);
        }

        // [AllowAnonymous]
        // public IActionResult Login()
        // {
        //     LoginRequest login = new LoginRequest();
        //     login.ReturnUrl = returnUrl;
        //     return View(login);
        // }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterRequest registerRequest)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await userManager.FindByEmailAsync(registerRequest.Email);

                if(user != null)
                {
                    return Conflict(ModelState);
                }

                if(!registerRequest.Password.Equals(registerRequest.ConfirmPassword)) {
                    return new BadRequestJsonResult("PasswordNotMatch");
                }

                ZxcvbnResult passwordStrength = Zxcvbn.Evaluate(registerRequest.Password);

                if(passwordStrength.Score < 3)
                {
                    return new BadRequestJsonResult("PasswordLowStrength");
                }

                user = new ApplicationUser {
                    UserName = registerRequest.Email,
                    Email = registerRequest.Email,
                    EmailConfirmed = false,
                    LockoutEnabled = true,
                    TwoFactorEnabled = false
                };

                var result = await userManager.CreateAsync(user, registerRequest.Password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "User");

                    var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    var callbackUrl = Url.Page(
                        "/Account/ConfirmEmail",
                        pageHandler: null,
                        values: new { area = "Identity", userId = user.Id, code = code },
                        protocol: Request.Scheme);

                    await emailSender.SendEmailAsync(registerRequest.Email, "Confirm your email",
                        $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");
                    
                    var content = context.ContentBlock
                        .Where(b => b.BindTo == "RegisterSuccess")
                        .Select(b => b.Content)
                        .ToArray();

                    return Ok(new { content });

                    // if (userManager.Options.SignIn.RequireConfirmedAccount)
                    // {
                    //     return RedirectToPage("RegisterConfirmation", new { email = registerRequest.Email });
                    // }
                    // else
                    // {
                    //     await signInManager.SignInAsync(user, isPersistent: false);
                    //     return Ok();
                    // }
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPost("ResendEmailConfirmation")]
        [AllowAnonymous]
        public async Task<IActionResult> ResendEmailConfirmation(EmailRequest emailRequest)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByEmailAsync(emailRequest.Email);
                if (user != null)
                {
                    var userId = await userManager.GetUserIdAsync(user);
                    var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    var callbackUrl = Url.Page(
                        "/Account/ConfirmEmail",
                        pageHandler: null,
                        values: new { userId = userId, code = code },
                        protocol: Request.Scheme);
                    await emailSender.SendEmailAsync(
                        emailRequest.Email,
                        "Confirm your email",
                        $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await userManager.FindByEmailAsync(loginRequest.Email);
                if (user != null)
                {
                    await signInManager.SignOutAsync();
                    Microsoft.AspNetCore.Identity.SignInResult result = await signInManager.PasswordSignInAsync(user, loginRequest.Password, loginRequest.RememberMe, false);
                    // if (result.Succeeded)
                    //     return Redirect(login.ReturnUrl ?? "/");
                    if(result.Succeeded) 
                    {
                        return Ok();
                    }
                    if(result.IsLockedOut)
                    {
                        return new UnauthorizedJsonResult("AccountLocked");
                    }
                    if (result.RequiresTwoFactor)
                    {
                        return new UnauthorizedJsonResult("Account2FA");
                    }
                    else
                    {
                        return new UnauthorizedJsonResult("LoginFail");
                    }
                }
                // ModelState.AddModelError(nameof(login.Email), "Login Failed: Invalid Email or password");
                return Unauthorized();
            }
            // return View(login);
            return BadRequest(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }

        [HttpGet]
        [Authorize]
        public string Data()
        {
            return "You got the data!";
        }
    }
}
