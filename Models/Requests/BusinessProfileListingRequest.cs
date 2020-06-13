using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CERTHB2B.Models.Requests
{
    public class BusinessProfileListingRequest
    {
        BusinessProfileListingRequest()
        {
            ReturnActivitiesOptions = false;
            SearchTermCompanyName = null;
            SearchTermCountries = null;
            SearchTermActivities = null;
        }
        public bool ReturnActivitiesOptions { get; set; }
        public string SearchTermCompanyName { get; set; }
        public List<string> SearchTermCountries { get; set; }
        public List<string> SearchTermActivities { get; set; }
    }
}
