using MerengueRD.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Infrastructure.Interfaces
{
    public interface IQuestionQuizRepository
    {
        Task<QuestionQuiz?> GetByIdAsync(int id);
        Task<IEnumerable<QuestionQuiz>> GetAllAsync();
        Task AddAsync(QuestionQuiz questionQuiz);
        Task UpdateAsync(QuestionQuiz questionQuiz);
        Task DeleteAsync(int id);
    }
}
