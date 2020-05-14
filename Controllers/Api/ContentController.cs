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
    [Route("api/[controller]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
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

        // [HttpPost("Login")]
        // [AllowAnonymous]
        // // [ValidateAntiForgeryToken]
        // public async Task<IActionResult> Login(LoginRequest login)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         ApplicationUser user = await userManager.FindByEmailAsync(login.Email);
        //         if (user != null)
        //         {
        //             await signInManager.SignOutAsync();
        //             Microsoft.AspNetCore.Identity.SignInResult result = await signInManager.PasswordSignInAsync(user, login.Password, false, false);
        //             // if (result.Succeeded)
        //             //     return Redirect(login.ReturnUrl ?? "/");
        //             if(result.Succeeded) 
        //             {
        //                 return Ok();
        //             }
        //         }
        //         // ModelState.AddModelError(nameof(login.Email), "Login Failed: Invalid Email or password");
        //         return Unauthorized();
        //     }
        //     // return View(login);
        //     return BadRequest(ModelState);
        // }

        // [HttpPost("Logout")]
        // [AllowAnonymous]
        // // [ValidateAntiForgeryToken]
        // public async Task<IActionResult> Logout()
        // {
        //     await signInManager.SignOutAsync();
        //     return Ok();
        // }

        [HttpGet("Data")]
        [Authorize]
        public string Data()
        {
            return "You got the data!";
        }
    }
}
