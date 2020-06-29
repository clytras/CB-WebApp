namespace CERTHB2B.Models
{
    public class BusinessProfilesDiscoverResults
    {
        public long ProfileId { get; set; }
        public string CompanyName { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string Country { get; set; }
        public int MatchingActivities { get; set; }
    }
}
