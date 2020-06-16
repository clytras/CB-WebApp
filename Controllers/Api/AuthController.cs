using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using CERTHB2B.Models;
using CERTHB2B.Models.Requests;
using CERTHB2B.CustomResults;
using CERTHB2B.ViewModels.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Devolutions.Zxcvbn;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using CERTHB2B.Data;
using CERTHB2B.Services;
using System.Collections.Generic;
using Microsoft.AspNetCore.Antiforgery;
using CERTHB2B.Utils;

namespace CERTHB2B.Controllers.Api
{
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
        // private readonly IAntiforgery antiforgery;

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
            return Ok();
        }

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
                    
                    var content = context.ContentBlock
                        .Where(b => b.BindToContent == "RegisterSuccess")
                        .Select(b => b.Content)
                        .ToArray();

                    return Ok(new { content });
                }

                var errors = new List<string>();

                foreach (var error in result.Errors)
                {
                    // ModelState.AddModelError(string.Empty, error.Description);
                    errors.Add(error.Description);
                }

                return BadRequest(errors);
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
                    if (user.LockoutEnabled && user.LockoutEnd.GetValueOrDefault() != null && user.LockoutEnd?.Date > DateTime.Now.ToUniversalTime())
                    {
                        return new UnauthorizedJsonResult("AccountLocked", user.LockoutEnd?.ToUniversalTime());
                    }

                    await sendPasswordResetMail(user, emailRequest.Email);
                    return Ok();
                }

                return new BadRequestJsonResult("CheckAccount");
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
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> LockoutAccount(LockoutAccountRequest lockoutRequest)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByIdAsync(lockoutRequest.UserId);
                if (user != null)
                {
                    if (user.LockoutEnabled)
                    {

                        var result = await userManager.SetLockoutEndDateAsync(user, 
                            lockoutRequest.DurationInSeconds > 0 ? 
                                DateTimeOffset.UtcNow.AddSeconds(Convert.ToDouble(lockoutRequest.DurationInSeconds)) : 
                                (DateTimeOffset?)null);

                        if (result.Succeeded)
                        {
                            return Ok(new { user.LockoutEnd });
                        }

                        var errors = new List<string>();
                        foreach (var error in result.Errors)
                        {
                            errors.Add(error.Description);
                        }

                        return BadRequest(errors);
                    }

                    return new BadRequestJsonResult("NoUserLockout");
                }

                return NotFound();
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

                    if(result.Succeeded) 
                    {
                        user.LastLoginTime = DateTime.UtcNow;
                        await userManager.UpdateAsync(user);
                        return Ok();
                    }
                    if(result.IsLockedOut)
                    {
                        return new UnauthorizedJsonResult("AccountLocked", user.LockoutEnd.GetValueOrDefault().ToUniversalTime());
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
            // return BadRequest(ModelState);
            return new BadRequestJsonResult("ModelError");
        }

        [HttpPost]
        [Authorize]
        // [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            // var tokens = antiforgery.GetAndStoreTokens(HttpContext);
            // antiforgery.SetCookieTokenAndHeader(HttpContext);
            // // HttpContext.Response.Cookies.Append("X-CSRF-TOKEN", tokens.RequestToken, 
            // //     new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Lax });
            // HttpContext.Response.Cookies.Append("CSRF-TOKEN", tokens.RequestToken, 
            //     new CookieOptions { HttpOnly = false, SameSite = SameSiteMode.Lax });
            
            return Ok();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest changePasswordRequest)
        {
            if (ModelState.IsValid)
            {
                // var user = await userManager.FindByEmailAsync(HttpContext.User.Identity.Name);
                var user = await userManager.FindByEmailAsync(User.Identity.Name);

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

                    if(!result.Succeeded)
                    {
                        return new UnauthorizedJsonResult("WrongPassword");
                    }

                    return Ok();
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

            await appEmailSender.SendEmailAsync(email, Constants.WithAppTitle("Reset your password"), htmlBody, textBody);
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

            await appEmailSender.SendEmailAsync(email, Constants.WithAppTitle("Confirm your email"), htmlBody, textBody);
        }
    }
}
