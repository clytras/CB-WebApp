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

namespace EKETAGreenmindB2B.Controllers.Api
{
    // [Route("api/[controller]/{action=Index}/{itemId?}")]
    // [Route("api/[controller]/{action=Index}/{itemId?}")]
    [Route("api/[controller]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public ContentController(ApplicationDbContext dbContext)
        {
            context = dbContext;
        }
    
        [HttpGet]
        [Authorize]
        public ActionResult Index()
        {
            return Ok(context.ContentBlock.Select(b => new {
                Id = b.BlockId,
                BindToContent = b.BindToContent
            }));
        }

        [HttpGet("{itemId}")]
        public async Task<ActionResult<ContentBlock>> GetContentItem(long itemId)
        {
            var contentBlockItem = await context.ContentBlock.FindAsync(itemId);

            if (contentBlockItem == null)
            {
                return NotFound();
            }

            return contentBlockItem;
        }

        [HttpPut("{itemId}")]
        [Authorize]
        public async Task<IActionResult> Update(long itemId, ContentBlockRequest contentBlockRequest)
        {
            if(ModelState.IsValid)
            {
                var contentBlockItem = await context.ContentBlock.FindAsync(itemId);

                if(contentBlockItem != null)
                {
                    contentBlockItem.BindToContent = contentBlockRequest.BindToContent;
                    contentBlockItem.Content = contentBlockRequest.Content;
                    context.ContentBlock.Update(contentBlockItem);

                    try
                    {
                        await context.SaveChangesAsync();
                        return Ok();
                    }
                    catch
                    {
                        throw;
                    }
                }

                return NotFound();
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(ContentBlockRequest contentBlockRequest)
        {
            if (ModelState.IsValid)
            {
                context.ContentBlock.Add(new ContentBlock
                {
                    BindToContent = contentBlockRequest.BindToContent,
                    Content = contentBlockRequest.Content
                });

                try
                {
                    await context.SaveChangesAsync();
                    return Ok();
                }
                catch
                {
                    return Ok(new { err = "db error" });
                    throw;
                }
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("{itemId}")]
        [Authorize]
        public async Task<IActionResult> Delete(long itemId)
        {
            var contentBlockItem = await context.ContentBlock.FindAsync(itemId);

            if(contentBlockItem != null)
            {
                context.ContentBlock.Remove(contentBlockItem);

                try
                {
                    await context.SaveChangesAsync();
                    return Ok();
                }
                catch
                {
                    return Ok(new { err = "db error" });
                    throw;
                }
            }

            return NotFound();
        }

        private bool ItemExists(long id)
        {
            return context.ContentBlock.Any(e => e.BlockId == id);
        }
    }
}
