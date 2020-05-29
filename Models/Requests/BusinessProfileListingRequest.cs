using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class BusinessProfileListingRequest
    {
        BusinessProfileListingRequest()
        {
            ReturnActivitiesOptions = false;
        }
        public bool ReturnActivitiesOptions { get; set; }
    }
}
