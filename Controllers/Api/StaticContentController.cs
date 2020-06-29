using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using CERTHB2B.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;
using System.IO;
using CERTHB2B.Utils;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.SpaServices;
using System.Collections.Generic;

namespace CERTHB2B.Controllers.Api
{
    [Route("static")]
    public class StaticContentController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IHostEnvironment environment;

        public StaticContentController(ApplicationDbContext dbContext, IHostEnvironment env)
        {
            context = dbContext;
            environment = env;
        }
    
        [HttpGet("initial.js")]
        [ResponseCache(NoStore = true)]
        public ActionResult Initial()
        {
            string[] bindsTo = new string[] {
                "Welcome",
                "Contact",
                "PrivacyPolicy",
                "TermsAndConditions"
            };

            var results = context.ContentBlock
                .Where(b => bindsTo.Contains(b.BindToContent))
                .Select(b => new {
                    b.BindToContent,
                    b.Content
                }).ToList();

            var dic = results.ToDictionary(p => p.BindToContent, p => p.Content);
            string staticContent = DataConverters.DataToJson(dic);

            var packageJson = System.IO.File.ReadAllText(Path.Combine(environment.ContentRootPath, "ClientApp", "package.json"));
            var packageInfo = JsonSerializer.Deserialize<Dictionary<string, dynamic>>(packageJson);
            var spaVersion = packageInfo["version"];
            
            Response.ContentType = "application/javascript";
            return Content($"window.__SpaVersion = '{spaVersion}';\nwindow.__StaticContent = {staticContent};");
        }
    }
}
