using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Data;
using MerengueRD.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace MerengueRD.Infrastructure.Repositories
{
    public class QuizMusicalRepository : IQuizMusicalRepository
    {
        private readonly MerengueRDApplicationContext _context;

        public QuizMusicalRepository(MerengueRDApplicationContext context)
        {
            _context = context;
        }
        public async Task<QuizMusical?> GetByIdAsync(int id)
        {
            return await _context.QuizMusicals.FindAsync(id);
        }
        public async Task<IEnumerable<QuizMusical>> GetAllAsync()
        {
            return await _context.QuizMusicals.ToListAsync();
        }
        public async Task AddAsync(QuizMusical quizMusical)
        {
            await _context.QuizMusicals.AddAsync(quizMusical);
        }
        public async Task UpdateAsync(QuizMusical quizMusical)
        {
            _context.QuizMusicals.Update(quizMusical);
        }
        public async Task DeleteAsync(int id)
        {
            var quizMusical = await _context.QuizMusicals.FindAsync(id);
            if (quizMusical != null)
            {
                _context.QuizMusicals.Remove(quizMusical);
            }
        }
    }
}
