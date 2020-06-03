using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CERTHB2B.Data.Migrations
{
    public partial class SiteConfig__ProfileContactRequests : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Shorting",
                table: "BusinessActivitiesOptions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "DeleteAccountInitiatedTS",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BusinessContactRequests",
                columns: table => new
                {
                    RequestId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromId = table.Column<long>(nullable: false),
                    ToId = table.Column<long>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    IsOpened = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessContactRequests", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_BusinessContactRequests_BusinessProfiles_FromId",
                        column: x => x.FromId,
                        principalTable: "BusinessProfiles",
                        principalColumn: "ProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteConfig",
                columns: table => new
                {
                    ConfigId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteConfig", x => x.ConfigId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusinessContactRequests_FromId",
                table: "BusinessContactRequests",
                column: "FromId");

            migrationBuilder.CreateIndex(
                name: "IX_SiteConfig_Name",
                table: "SiteConfig",
                column: "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusinessContactRequests");

            migrationBuilder.DropTable(
                name: "SiteConfig");

            migrationBuilder.DropColumn(
                name: "Shorting",
                table: "BusinessActivitiesOptions");

            migrationBuilder.DropColumn(
                name: "DeleteAccountInitiatedTS",
                table: "AspNetUsers");
        }
    }
}
