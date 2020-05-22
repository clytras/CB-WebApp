using Microsoft.EntityFrameworkCore.Migrations;

namespace EKETAGreenmindB2B.Data.Seeds
{
    public partial class BusinessProfileDataInitializer
    {
        public static void SeedBusinessActivityOptions(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "BusinessActivitiesOptions",
                columns: new[] { "ActivityOptionAlias" },
                values: new object[,] {
                    { "TopicsOfInterest.CleanPowerTransport.$Electromobility" },
                    { "TopicsOfInterest.CleanPowerTransport.$MicroMobility" },
                    { "TopicsOfInterest.CleanPowerTransport.$Biofuels" },
                    { "TopicsOfInterest.CleanPowerTransport.$HydrogenMobility" },
                    { "TopicsOfInterest.AirMobility.$DronesManufacturing" },
                    { "TopicsOfInterest.AirMobility.$DronesTrading" },
                    { "TopicsOfInterest.Logistics.$LastmileLogistics" },
                    { "TopicsOfInterest.Logistics.$DronesApplicationsForLogistics" },
                    { "TopicsOfInterest.UrbanMobility.$SharedMobility" },
                    { "TopicsOfInterest.UrbanMobility.$TrafficManagementSystems" },
                    { "TopicsOfInterest.TransportInfrastructure.$RailInfrastructure" },
                    { "TopicsOfInterest.TransportInfrastructure.$RoadInfrastructure" },
                    { "TopicsOfInterest.TransportInfrastructure.$MaritimeInfrastructure" },
                    { "TopicsOfInterest.TransportInfrastructure.$AirTransportInfrastructure" },
                    { "TopicsOfInterest.Automotive.$ElectricVehiclesManufacturing" },
                    { "TopicsOfInterest.Automotive.$ElectricVehiclesTrading" },
                    { "TopicsOfInterest.Automotive.$AutonomousVehiclesManufacturing" },
                    { "TopicsOfInterest.Automotive.$AutonomousVehiclesTrading" },
                    { "TopicsOfInterest.ICTTransport.$ITSSystems" },
                    { "TopicsOfInterest.ICTTransport.$CITSSystems" },
                    { "TopicsOfInterest.ICTTransport.$DataAnalyticsTransport" },
                    { "TopicsOfInterest.$TransportPolicy" },
                    { "TopicsOfInterest.$ConsultingServices" },
                    { "Offer.Collaboration.$ForFundingCall" },
                    { "Offer.Collaboration.$DevelopNewProduct" },
                    { "Offer.Collaboration.$DevelopNewService" },
                    { "Offer.$TechnicalCooperation" },
                    { "Offer.ConsultingServices.$BusinessConsultingServices" },
                    { "Offer.ConsultingServices.$TransportRelatedConsultingServices" },
                    { "Request.Collaboration.$ForFundingCall" },
                    { "Request.Collaboration.$DevelopNewProduct" },
                    { "Request.Collaboration.$DevelopNewService" },
                    { "Request.Supplier.$ForComponents" },
                    { "Request.Supplier.$ForServices" },
                    { "Request.Supplier.$ForData" },
                    { "Request.ConsultingServices.$BusinessConsultingServices" },
                    { "Request.ConsultingServices.$TransportRelatedConsultingServices" }
                }
            );
        }
    }
}
