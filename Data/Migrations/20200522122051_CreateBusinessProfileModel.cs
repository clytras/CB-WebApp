using EKETAGreenmindB2B.Data.Seeds;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EKETAGreenmindB2B.Data.Migrations
{
    public partial class CreateBusinessProfileModel : Migration
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
                    AddressLine2 = table.Column<string>(nullable: false),
                    City = table.Column<string>(maxLength: 50, nullable: false),
                    Region = table.Column<string>(maxLength: 50, nullable: false),
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

            // Apply static database data
            BusinessProfileDataInitializer.SeedBusinessActivityOptions(migrationBuilder);
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
