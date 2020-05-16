using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EKETAGreenmindB2B.CustomResults
{
    public class OkJsonResult : JsonResult
    {
        public OkJsonResult(
            string content = null,
            int statusCode = StatusCodes.Status200OK
        )
            : base(new { content })
        {
            StatusCode = statusCode;
        }
    }
}
