using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using EKETAGreenmindB2B.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace EKETAGreenmindB2B.Controllers.Api
{
    public class CustomUnauthorizedResult : JsonResult
    {
        public CustomUnauthorizedResult(string errorCode, int statusCode = StatusCodes.Status401Unauthorized)
            : base(new { errorCode })
        {
            StatusCode = statusCode;
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private UserManager<ApplicationUser> userManager;
        private SignInManager<ApplicationUser> signInManager;

        public AuthController(UserManager<ApplicationUser> userMgr, SignInManager<ApplicationUser> signinMgr)
        {
            userManager = userMgr;
            signInManager = signinMgr;
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

        [HttpPost("Login")]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginRequest login)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await userManager.FindByEmailAsync(login.Email);
                if (user != null)
                {
                    await signInManager.SignOutAsync();
                    Microsoft.AspNetCore.Identity.SignInResult result = await signInManager.PasswordSignInAsync(user, login.Password, login.RememberMe, false);
                    // if (result.Succeeded)
                    //     return Redirect(login.ReturnUrl ?? "/");
                    if(result.Succeeded) 
                    {
                        return Ok();
                    }
                    if(result.IsLockedOut)
                    {
                        return new CustomUnauthorizedResult("AccountLocked");
                    }
                    if (result.RequiresTwoFactor)
                    {
                        return new CustomUnauthorizedResult("Account2FA");
                    }
                    else
                    {
                        return new CustomUnauthorizedResult("LoginFail");
                    }
                }
                // ModelState.AddModelError(nameof(login.Email), "Login Failed: Invalid Email or password");
                return Unauthorized();
            }
            // return View(login);
            return BadRequest(ModelState);
        }

        [HttpPost("Logout")]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }

        [HttpGet("Data")]
        [Authorize]
        public string Data()
        {
            return "You got the data!";
        }
    }
}
