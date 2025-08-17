using MerengueRD.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Infrastructure.Interfaces
{
    public interface IQuizMusicalRepository
    {
        Task<QuizMusical?> GetByIdAsync(int id);
        Task<IEnumerable<QuizMusical>> GetAllAsync();
        Task AddAsync(QuizMusical quizMusical);
        Task UpdateAsync(QuizMusical quizMusical);
        Task DeleteAsync(int id);
    }
}
