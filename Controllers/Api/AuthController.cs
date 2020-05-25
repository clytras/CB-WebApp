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

    [Route("api/[controller]/{action=Index}")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private SignInManager<ApplicationUser> signInManager;
        private readonly ApplicationDbContext context;
        private readonly IEmailSender emailSender;
        private readonly IRazorViewToStringRenderer razorRenderer;
        private readonly CERTHB2B.Services.IAppEmailSender appEmailSender;

        public AuthController(
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

        // [AllowAnonymous]
        // public IActionResult Login()
        // {
        //     LoginRequest login = new LoginRequest();
        //     login.ReturnUrl = returnUrl;
        //     return View(login);
        // }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
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
                    TwoFactorEnabled = false,
                    RegistrationDate = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(user, registerRequest.Password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "User");

                    await sendConfirmationMail(user, registerRequest.Email);

                    // var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    // code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    // // var callbackUrl = Url.Page(
                    // //     "/Account/ConfirmEmail",
                    // //     pageHandler: null,
                    // //     values: new { area = "Identity", userId = user.Id, code = code },
                    // //     protocol: Request.Scheme);

                    // // await emailSender.SendEmailAsync(registerRequest.Email, "Confirm your email",
                    // //     $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                    // const string view = "/Pages/Templates/Email/Account/ConfirmationCode";
                    // string callbackUrl = $"{Request.Scheme}://{Request.Host.Value}/account/confirm-email/{user.Id}/{code}";

                    // var model = new ConfirmationCodeViewModel(user.Id, code, callbackUrl);

                    // var htmlBody = await razorRenderer.RenderViewToStringAsync($"{view}Html.cshtml", model);
                    // var textBody = await razorRenderer.RenderViewToStringAsync($"{view}Text.cshtml", model);

                    // await appEmailSender.SendEmailAsync(registerRequest.Email, "Confirm your email", htmlBody, textBody);
                    
                    var content = context.ContentBlock
                        .Where(b => b.BindToContent == "RegisterSuccess")
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

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailRequest confirmEmailRequest)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByIdAsync(confirmEmailRequest.UserId);

                if(user != null)
                {
                    var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(confirmEmailRequest.ConfirmationCode));
                    var result = await userManager.ConfirmEmailAsync(user, code);

                    if(result.Succeeded)
                        return Ok();
                    else
                        return StatusCode(StatusCodes.Status410Gone);
                }

                return NotFound();
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendResetPasswordRequest(EmailRequest emailRequest)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByEmailAsync(emailRequest.Email);
                if (user != null)
                {
                    await sendPasswordResetMail(user, emailRequest.Email);
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest resetPasswordRequest)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByIdAsync(resetPasswordRequest.UserId);

                if(user != null)
                {
                    if(!user.Email.Equals(resetPasswordRequest.Email.Trim(), StringComparison.CurrentCultureIgnoreCase)) {
                        return new BadRequestJsonResult("EmailNotMatchRequest");
                    }

                    if(!resetPasswordRequest.NewPassword.Equals(resetPasswordRequest.ConfirmPassword)) {
                        return new BadRequestJsonResult("PasswordNotMatch");
                    }

                    ZxcvbnResult passwordStrength = Zxcvbn.Evaluate(resetPasswordRequest.NewPassword);

                    if(passwordStrength.Score < 3)
                    {
                        return new BadRequestJsonResult("PasswordLowStrength");
                    }

                    var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(resetPasswordRequest.ConfirmationCode));
                    var result = await userManager.ResetPasswordAsync(user, code, resetPasswordRequest.NewPassword);

                    if(result.Succeeded)
                        return Ok();
                    else
                        return StatusCode(StatusCodes.Status410Gone);
                }

                return NotFound();
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ResendEmailConfirmation(EmailRequest emailRequest)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByEmailAsync(emailRequest.Email);
                if (user != null)
                {
                    await sendConfirmationMail(user, emailRequest.Email);
                    // var userId = await userManager.GetUserIdAsync(user);
                    // var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    // var callbackUrl = Url.Page(
                    //     "/Account/ConfirmEmail",
                    //     pageHandler: null,
                    //     values: new { userId = userId, code = code },
                    //     protocol: Request.Scheme);
                    // await emailSender.SendEmailAsync(
                    //     emailRequest.Email,
                    //     "Confirm your email",
                    //     $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await userManager.FindByEmailAsync(loginRequest.Email);
                if (user != null)
                {
                    await signInManager.SignOutAsync();
                    var result = await signInManager.PasswordSignInAsync(user, loginRequest.Password, loginRequest.RememberMe, false);
                    // if (result.Succeeded)
                    //     return Redirect(login.ReturnUrl ?? "/");
                    if(result.Succeeded) 
                    {
                        user.LastLoginTime = DateTime.UtcNow;
                        await userManager.UpdateAsync(user);
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest changePasswordRequest)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByEmailAsync(HttpContext.User.Identity.Name);

                if(user != null)
                {
                    if(!changePasswordRequest.NewPassword.Equals(changePasswordRequest.ConfirmPassword)) {
                        return new BadRequestJsonResult("PasswordNotMatch");
                    }

                    ZxcvbnResult passwordStrength = Zxcvbn.Evaluate(changePasswordRequest.NewPassword);

                    if(passwordStrength.Score < 3)
                    {
                        return new BadRequestJsonResult("PasswordLowStrength");
                    }

                    var result = await userManager.ChangePasswordAsync(user, changePasswordRequest.CurrentPassword, changePasswordRequest.NewPassword);

                    if(result.Succeeded)
                    {
                        return Ok();
                    }
                }

                return Unauthorized();
            }

            return BadRequest(ModelState);
        }

        private async Task sendPasswordResetMail(ApplicationUser user, string email)
        {
            var userId = await userManager.GetUserIdAsync(user);
            var code = await userManager.GeneratePasswordResetTokenAsync(user);

            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            const string view = "/Pages/Templates/Email/Account/ResetPassword";
            string callbackUrl = $"{Request.Scheme}://{Request.Host.Value}/account/reset-password/?u={user.Id}&v={code}";

            var model = new ResetPasswordViewModel(user.Id, code, callbackUrl);

            var htmlBody = await razorRenderer.RenderViewToStringAsync($"{view}Html.cshtml", model);
            var textBody = await razorRenderer.RenderViewToStringAsync($"{view}Text.cshtml", model);

            await appEmailSender.SendEmailAsync(email, "Reset your password", htmlBody, textBody);
        }

        private async Task sendConfirmationMail(ApplicationUser user, string email)
        {
            var userId = await userManager.GetUserIdAsync(user);
            var code = await userManager.GenerateEmailConfirmationTokenAsync(user);

            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            // var callbackUrl = Url.Page(
            //     "/Account/ConfirmEmail",
            //     pageHandler: null,
            //     values: new { area = "Identity", userId = user.Id, code = code },
            //     protocol: Request.Scheme);

            // await emailSender.SendEmailAsync(registerRequest.Email, "Confirm your email",
            //     $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

            const string view = "/Pages/Templates/Email/Account/ConfirmationCode";
            string callbackUrl = $"{Request.Scheme}://{Request.Host.Value}/account/confirm-email/?u={user.Id}&v={code}";

            var model = new ConfirmationCodeViewModel(user.Id, code, callbackUrl);

            var htmlBody = await razorRenderer.RenderViewToStringAsync($"{view}Html.cshtml", model);
            var textBody = await razorRenderer.RenderViewToStringAsync($"{view}Text.cshtml", model);

            await appEmailSender.SendEmailAsync(email, "Confirm your email", htmlBody, textBody);
        }

        [HttpGet]
        [Authorize]
        public string Data()
        {
            return "You got the data!";
        }
    }
}
