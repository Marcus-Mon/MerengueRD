using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Data;
using MerengueRD.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace MerengueRD.Infrastructure.Repositories
{
    public class QuestionQuizRepository : IQuestionQuizRepository
    {
        private readonly MerengueRDApplicationContext _context;

        public QuestionQuizRepository(MerengueRDApplicationContext context)
        {
            _context = context;
        }
        public async Task<QuestionQuiz?> GetByIdAsync(int id)
        {
            return await _context.QuestionQuizzes.FindAsync(id);
        }
        public async Task<IEnumerable<QuestionQuiz>> GetAllAsync()
        {
            return await _context.QuestionQuizzes.ToListAsync();
        }
        public async Task AddAsync(QuestionQuiz questionQuiz)
        {
            await _context.QuestionQuizzes.AddAsync(questionQuiz);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(QuestionQuiz questionQuiz)
        {
            _context.QuestionQuizzes.Update(questionQuiz);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var questionQuiz = await _context.QuestionQuizzes.FindAsync(id);
            if (questionQuiz != null)
            {
                _context.QuestionQuizzes.Remove(questionQuiz);
                await _context.SaveChangesAsync();
            }
        }
    }
}
