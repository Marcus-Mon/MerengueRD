using Microsoft.EntityFrameworkCore;
using MerengueRD.Domain.Entities;


namespace MerengueRD.Infrastructure.Data
{
    public class MerengueRDApplicationContext : DbContext
    {
        public MerengueRDApplicationContext(DbContextOptions op) : base(op) {}

        public DbSet<Artist> Artists { get; set; }
        public DbSet<EventChronological> EventChronological { get; set; }
        public DbSet<QuestionQuiz> questionQuizzes { get; set; }
        public DbSet<Song> Song { get; set; }
        public DbSet<QuizMusical> quizMusicals { get; set; } 

        protected MerengueRDApplicationContext()
        {
        }
    }
}
