using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CERTHB2B.Models.Requests;
using CERTHB2B.Data;
using Microsoft.EntityFrameworkCore;
using CERTHB2B.Models;
using CERTHB2B.CustomResults;

namespace CERTHB2B.Controllers.Api
{
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
                b.BindToContent,
                b.Locked
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
        [Authorize(Roles = "Admin,Editor")]
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
        [Authorize(Roles = "Admin,Editor")]
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
                    // return Ok(new { err = "db error" });
                    throw;
                }
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("{itemId}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> Delete(long itemId)
        {
            var contentBlockItem = await context.ContentBlock.FindAsync(itemId);

            if(contentBlockItem != null)
            {
                if (contentBlockItem.Locked == true)
                {
                    return new BadRequestJsonResult("Locked", statusCode: 403);
                }

                context.ContentBlock.Remove(contentBlockItem);

                try
                {
                    await context.SaveChangesAsync();
                    return Ok();
                }
                catch
                {
                    // return Ok(new { err = "db error" });
                    throw;
                }
            }

            return NotFound();
        }

        [HttpGet("BindTo/{bindToContent}")]
        public async Task<IActionResult> GetBindTo(string bindToContent)
        {
            var binds = bindToContent.Split(',');
            var contentBlocks = await context.ContentBlock.Where(b => binds.Contains(b.BindToContent)).ToListAsync();

            if(contentBlocks.Count > 0) {
                return Ok(contentBlocks);
            }

            return NotFound();
        }

        private bool ItemExists(long id)
        {
            return context.ContentBlock.Any(e => e.BlockId == id);
        }
    }
}
