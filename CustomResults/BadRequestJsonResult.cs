using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EKETAGreenmindB2B.CustomResults
{
    public class BadRequestJsonResult : JsonResult
    {
        public BadRequestJsonResult(
            string errorCode,
            string content = null,
            int statusCode = StatusCodes.Status400BadRequest
        )
            : base(new { errorCode, content })
        {
            StatusCode = statusCode;
        }
    }
}
