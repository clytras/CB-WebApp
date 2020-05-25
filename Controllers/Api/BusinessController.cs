using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using CERTHB2B.Data;
using Microsoft.EntityFrameworkCore;
using CERTHB2B.Models;
using System.Dynamic;
using CERTHB2B.Models.Requests;
using System.Text.Json;

namespace CERTHB2B.Controllers.Api
{
    // [Route("api/[controller]/{action=Index}/{itemId?}")]
    // [Route("api/[controller]/{action=Index}/{itemId?}")]
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public BusinessController(ApplicationDbContext dbContext)
        {
            context = dbContext;
        }
    
        [HttpGet]
        // [Authorize]
        public ActionResult Index()
        {
            // return Ok(context.ContentBlock.Select(b => new {
            //     Id = b.BlockId,
            //     BindToContent = b.BindToContent
            // }));
            return Ok();
        }


        [HttpPost("AddActivityOptions")]
        public async Task<IActionResult> AddActivityOptions(List<BusinessActivitiesOptions> businessActivitiesOptions)
        {
            if (ModelState.IsValid)
            {
                context.AddRange(businessActivitiesOptions);

                try
                {
                    await context.SaveChangesAsync();
                    return Ok();
                }
                catch (DbUpdateException e)
                {
                    return Conflict(e?.InnerException?.Message);
                }
            }

            return BadRequest(ModelState);
        }


        // [HttpPost]
        // public async Task<IActionResult> OnPostCreate(string[] businessActivitiesOptions)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         // context.ContentBlock.Add(new ContentBlock
        //         // {
        //         //     BindToContent = contentBlockRequest.BindToContent,
        //         //     Content = contentBlockRequest.Content
        //         // });

        //         // return Ok(businessActivitiesOptions);

        //         context.BusinessActivitiesOptions.Add(new BusinessActivitiesOptions
        //         {
        //             ActivityOptionAlias = "gsdfgfdg"
        //         });

        //         context.BusinessActivitiesOptions.AddRange(businessActivitiesOptions.Select(a => new BusinessActivitiesOptions
        //         {
        //             ActivityOptionAlias = a[0].ToString()
        //         }
        //         ).ToListAsync());
        //         // context.BusinessActivitiesOptions.Add(new BusinessActivitiesOptions (businessActivitiesOptions));

        //         // try
        //         // {
        //         //     await context.SaveChangesAsync();
        //         //     return Ok();
        //         // }
        //         // catch
        //         // {
        //         //     throw;
        //         // }
        //     }

        //     return BadRequest(ModelState);
        // }

        // [HttpGet("{itemId}")]
        // public async Task<ActionResult<ContentBlock>> GetContentItem(long itemId)
        // {
        //     var contentBlockItem = await context.ContentBlock.FindAsync(itemId);

        //     if (contentBlockItem == null)
        //     {
        //         return NotFound();
        //     }

        //     return contentBlockItem;
        // }

        // [HttpPut("{itemId}")]
        // [Authorize]
        // public async Task<IActionResult> Update(long itemId, ContentBlockRequest contentBlockRequest)
        // {
        //     if(ModelState.IsValid)
        //     {
        //         var contentBlockItem = await context.ContentBlock.FindAsync(itemId);

        //         if(contentBlockItem != null)
        //         {
        //             contentBlockItem.BindToContent = contentBlockRequest.BindToContent;
        //             contentBlockItem.Content = contentBlockRequest.Content;
        //             context.ContentBlock.Update(contentBlockItem);

        //             try
        //             {
        //                 await context.SaveChangesAsync();
        //                 return Ok();
        //             }
        //             catch
        //             {
        //                 throw;
        //             }
        //         }

        //         return NotFound();
        //     }

        //     return BadRequest(ModelState);
        // }

        // [HttpPost]
        // [Authorize]
        // public async Task<IActionResult> Create(ContentBlockRequest contentBlockRequest)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         context.ContentBlock.Add(new ContentBlock
        //         {
        //             BindToContent = contentBlockRequest.BindToContent,
        //             Content = contentBlockRequest.Content
        //         });

        //         try
        //         {
        //             await context.SaveChangesAsync();
        //             return Ok();
        //         }
        //         catch
        //         {
        //             return Ok(new { err = "db error" });
        //             throw;
        //         }
        //     }

        //     return BadRequest(ModelState);
        // }

        // [HttpDelete("{itemId}")]
        // [Authorize]
        // public async Task<IActionResult> Delete(long itemId)
        // {
        //     var contentBlockItem = await context.ContentBlock.FindAsync(itemId);

        //     if(contentBlockItem != null)
        //     {
        //         context.ContentBlock.Remove(contentBlockItem);

        //         try
        //         {
        //             await context.SaveChangesAsync();
        //             return Ok();
        //         }
        //         catch
        //         {
        //             return Ok(new { err = "db error" });
        //             throw;
        //         }
        //     }

        //     return NotFound();
        // }

        // [HttpGet("BindTo/{bindToContent}")]
        // public async Task<IActionResult> GetBintTo(string bindToContent)
        // {
        //     var binds = bindToContent.Split(',');
        //     var contentBlocks = await context.ContentBlock.Where(b => binds.Contains(b.BindToContent)).ToListAsync();

        //     if(contentBlocks.Count > 0) {
        //         return Ok(contentBlocks);
        //     }

        //     return NotFound();
        // }

        // private bool ItemExists(long id)
        // {
        //     return context.ContentBlock.Any(e => e.BlockId == id);
        // }
    }
}
