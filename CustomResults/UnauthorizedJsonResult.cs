using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CERTHB2B.CustomResults
{
    public class UnauthorizedJsonResult : JsonResult
    {
        public UnauthorizedJsonResult(
            string errorCode,
            dynamic content = null,
            int statusCode = StatusCodes.Status401Unauthorized
        )
            : base(new { errorCode, content })
        {
            StatusCode = statusCode;
        }
    }
}
