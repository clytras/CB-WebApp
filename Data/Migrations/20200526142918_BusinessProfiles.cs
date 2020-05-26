using Microsoft.EntityFrameworkCore.Migrations;

namespace CERTHB2B.Data.Migrations
{
    public partial class BusinessProfiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BusinessActivitiesOptions",
                columns: table => new
                {
                    ActivityId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActivityOptionAlias = table.Column<string>(maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessActivitiesOptions", x => x.ActivityId);
                    table.UniqueConstraint("AK_BusinessActivitiesOptions_ActivityOptionAlias", x => x.ActivityOptionAlias);
                });

            migrationBuilder.CreateTable(
                name: "BusinessProfiles",
                columns: table => new
                {
                    ProfileId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsProfileVisible = table.Column<bool>(nullable: true, defaultValue: true),
                    CompanyName = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: true),
                    Telephone = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessProfiles", x => x.ProfileId);
                    table.ForeignKey(
                        name: "FK_BusinessProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BusinessAddress",
                columns: table => new
                {
                    AddressId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StreetAddress = table.Column<string>(nullable: false),
                    AddressLine2 = table.Column<string>(nullable: true),
                    City = table.Column<string>(maxLength: 50, nullable: false),
                    Region = table.Column<string>(maxLength: 50, nullable: true),
                    PostalCode = table.Column<string>(maxLength: 10, nullable: false),
                    Country = table.Column<string>(maxLength: 3, nullable: false),
                    ProfileId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessAddress", x => x.AddressId);
                    table.ForeignKey(
                        name: "FK_BusinessAddress_BusinessProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "BusinessProfiles",
                        principalColumn: "ProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessContact",
                columns: table => new
                {
                    ContactId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: true),
                    Telephone = table.Column<string>(nullable: true),
                    ProfileId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessContact", x => x.ContactId);
                    table.ForeignKey(
                        name: "FK_BusinessContact_BusinessProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "BusinessProfiles",
                        principalColumn: "ProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessProfileActivities",
                columns: table => new
                {
                    ProfileId = table.Column<long>(nullable: false),
                    ActivityId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessProfileActivities", x => new { x.ProfileId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_BusinessProfileActivities_BusinessProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "BusinessProfiles",
                        principalColumn: "ProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessProfileOtherActivities",
                columns: table => new
                {
                    OtherActivityId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActivityAlias = table.Column<string>(nullable: false),
                    OtherText = table.Column<string>(nullable: true),
                    ProfileId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessProfileOtherActivities", x => x.OtherActivityId);
                    table.ForeignKey(
                        name: "FK_BusinessProfileOtherActivities_BusinessProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "BusinessProfiles",
                        principalColumn: "ProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "BusinessActivitiesOptions",
                columns: new[] { "ActivityId", "ActivityOptionAlias" },
                values: new object[,]
                {
                    { 1L, "TopicsOfInterest.CleanPowerTransport.$Electromobility" },
                    { 21L, "TopicsOfInterest.ICTTransport.$DataAnalyticsTransport" },
                    { 22L, "TopicsOfInterest.$TransportPolicy" },
                    { 23L, "TopicsOfInterest.$ConsultingServices" },
                    { 24L, "Offer.Collaboration.$ForFundingCall" },
                    { 25L, "Offer.Collaboration.$DevelopNewProduct" },
                    { 26L, "Offer.Collaboration.$DevelopNewService" },
                    { 27L, "Offer.$TechnicalCooperation" },
                    { 28L, "Offer.ConsultingServices.$BusinessConsultingServices" },
                    { 29L, "Offer.ConsultingServices.$TransportRelatedConsultingServices" },
                    { 30L, "Request.Collaboration.$ForFundingCall" },
                    { 31L, "Request.Collaboration.$DevelopNewProduct" },
                    { 32L, "Request.Collaboration.$DevelopNewService" },
                    { 33L, "Request.Supplier.$ForComponents" },
                    { 34L, "Request.Supplier.$ForServices" },
                    { 35L, "Request.Supplier.$ForData" },
                    { 20L, "TopicsOfInterest.ICTTransport.$CITSSystems" },
                    { 36L, "Request.ConsultingServices.$BusinessConsultingServices" },
                    { 19L, "TopicsOfInterest.ICTTransport.$ITSSystems" },
                    { 17L, "TopicsOfInterest.Automotive.$AutonomousVehiclesManufacturing" },
                    { 2L, "TopicsOfInterest.CleanPowerTransport.$MicroMobility" },
                    { 3L, "TopicsOfInterest.CleanPowerTransport.$Biofuels" },
                    { 4L, "TopicsOfInterest.CleanPowerTransport.$HydrogenMobility" },
                    { 5L, "TopicsOfInterest.AirMobility.$DronesManufacturing" },
                    { 6L, "TopicsOfInterest.AirMobility.$DronesTrading" },
                    { 7L, "TopicsOfInterest.Logistics.$LastmileLogistics" },
                    { 8L, "TopicsOfInterest.Logistics.$DronesApplicationsForLogistics" },
                    { 9L, "TopicsOfInterest.UrbanMobility.$SharedMobility" },
                    { 10L, "TopicsOfInterest.UrbanMobility.$TrafficManagementSystems" },
                    { 11L, "TopicsOfInterest.TransportInfrastructure.$RailInfrastructure" },
                    { 12L, "TopicsOfInterest.TransportInfrastructure.$RoadInfrastructure" },
                    { 13L, "TopicsOfInterest.TransportInfrastructure.$MaritimeInfrastructure" },
                    { 14L, "TopicsOfInterest.TransportInfrastructure.$AirTransportInfrastructure" },
                    { 15L, "TopicsOfInterest.Automotive.$ElectricVehiclesManufacturing" },
                    { 16L, "TopicsOfInterest.Automotive.$ElectricVehiclesTrading" },
                    { 18L, "TopicsOfInterest.Automotive.$AutonomousVehiclesTrading" },
                    { 37L, "Request.ConsultingServices.$TransportRelatedConsultingServices" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusinessAddress_ProfileId",
                table: "BusinessAddress",
                column: "ProfileId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BusinessContact_ProfileId",
                table: "BusinessContact",
                column: "ProfileId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BusinessProfileOtherActivities_ProfileId",
                table: "BusinessProfileOtherActivities",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessProfiles_UserId",
                table: "BusinessProfiles",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusinessActivitiesOptions");

            migrationBuilder.DropTable(
                name: "BusinessAddress");

            migrationBuilder.DropTable(
                name: "BusinessContact");

            migrationBuilder.DropTable(
                name: "BusinessProfileActivities");

            migrationBuilder.DropTable(
                name: "BusinessProfileOtherActivities");

            migrationBuilder.DropTable(
                name: "BusinessProfiles");
        }
    }
}
