using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MerengueRD.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDuracionMaxToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "DuracionMax",
                table: "QuizMusicals",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "DuracionMax",
                table: "QuizMusicals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
