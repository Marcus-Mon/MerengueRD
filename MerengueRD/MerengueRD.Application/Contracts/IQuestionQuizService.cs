using MerengueRD.Application.DTOs;

namespace MerengueRD.Application.Contracts
{
    public interface IQuestionQuizService
    {
        Task<QuestionQuizDto?> GetByIdAsync(int id);
        Task<IEnumerable<QuestionQuizDto>> GetAllAsync();
        Task AddAsync(QuestionQuizDto dto);
        Task UpdateAsync(QuestionQuizDto dto);
        Task DeleteAsync(int id);
    }
}
