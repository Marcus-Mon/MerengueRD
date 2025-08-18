using MerengueRD.Application.Services;
using MerengueRD.Infrastructure.Data;
using MerengueRD.Infrastructure.Interfaces;
using MerengueRD.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<MerengueRDApplicationContext>(o =>
o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<UnitOfWork>();

builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
builder.Services.AddScoped<IEventChronologicalRepository, EventChronologicalRepository>();
builder.Services.AddScoped<IQuestionQuizRepository, QuestionQuizRepository>();
builder.Services.AddScoped<IQuizMusicalRepository, QuizMusicalRepository>();
builder.Services.AddScoped<ISongRepository, SongRepository>();

builder.Services.AddScoped<ArtistService>();
builder.Services.AddScoped<EventChronologicalService>();
builder.Services.AddScoped<QuestionQuizService>();
builder.Services.AddScoped<QuizMusicalService>();
builder.Services.AddScoped<SongService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
