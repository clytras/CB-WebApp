using Microsoft.EntityFrameworkCore.Migrations;

namespace EKETAGreenmindB2B.Data.Migrations
{
    public partial class ContentBlockChangeBindToColumnName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BindTo",
                table: "ContentBlock",
                newName: "BindToContent");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BindToContent",
                table: "ContentBlock",
                newName: "BindTo");
        }
    }
}
