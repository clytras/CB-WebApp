using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using EKETAGreenmindB2B.Models.Requests;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using EKETAGreenmindB2B.Data;
using Microsoft.EntityFrameworkCore;
using EKETAGreenmindB2B.Models;
using System.Dynamic;
using System.Text.Json;
using System.Text;
using System.IO;

namespace EKETAGreenmindB2B.Controllers.Api
{
    [Route("static")]
    public class StaticContentController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public StaticContentController(ApplicationDbContext dbContext)
        {
            context = dbContext;
        }
    
        [HttpGet("content.js")]
        [ResponseCache(NoStore = true)]
        public ActionResult Content()
        {
            string[] bindsTo = new string[] {
                "Welcome",
                "Contact",
                "FooterCopyright"
            };

            var results = context.ContentBlock
                .Where(b => bindsTo.Contains(b.BindToContent))
                .Select(b => new {
                    b.BindToContent,
                    b.Content
                }).ToList();

            string content = "";

            using (var stream = new MemoryStream())
            {
                using (var writer = new Utf8JsonWriter(stream))
                {
                    writer.WriteStartObject();

                    foreach(var block in results)
                    {
                        writer.WriteString(block.BindToContent, block.Content);
                    }

                    writer.WriteEndObject();
                }

                string json = Encoding.UTF8.GetString(stream.ToArray());
                content = $"window.__StaticContent = {json};";
            }
            
            Response.ContentType = "application/javascript";
            return Content(content);
        }
    }
}
