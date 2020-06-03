using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CERTHB2B.Models
{
    public class BusinessProfileActivities
    {
        [JsonIgnore]
        [ForeignKey("BusinessProfile")]
        public long ProfileId { get; set; }

        [JsonIgnore]
        public BusinessProfile Profile { get; set; }

        [ForeignKey("BusinessActivitiesOptions")]
        public long ActivityId { get; set; }
    }
}
