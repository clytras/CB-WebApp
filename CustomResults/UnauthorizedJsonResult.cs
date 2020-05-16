using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EKETAGreenmindB2B.CustomResults
{
    public class UnauthorizedJsonResult : JsonResult
    {
        public UnauthorizedJsonResult(
            string errorCode,
            string content = null,
            int statusCode = StatusCodes.Status401Unauthorized
        )
            : base(new { errorCode, content })
        {
            StatusCode = statusCode;
        }
    }
}
