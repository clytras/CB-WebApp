using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using CERTHB2B.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;
using System.IO;

namespace CERTHB2B.Controllers.Api
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
                "Contact"
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
