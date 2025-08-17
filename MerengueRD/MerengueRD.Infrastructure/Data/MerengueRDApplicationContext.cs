using Microsoft.EntityFrameworkCore;
using MerengueRD.Domain.Entities;


namespace MerengueRD.Infrastructure.Data
{
    public class MerengueRDApplicationContext : DbContext
    {
        public MerengueRDApplicationContext(DbContextOptions op) : base(op) {}

        public DbSet<Artist> Artists { get; set; }
        public DbSet<EventChronological> EventChronologicals { get; set; }
        public DbSet<QuestionQuiz> QuestionQuizzes { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<QuizMusical> QuizMusicals { get; set; } 

        protected MerengueRDApplicationContext()
        {
        }
    }
}
