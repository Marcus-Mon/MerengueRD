using MerengueRD.Application.DTOs;

namespace MerengueRD.Application.Contracts
{
    public interface IQuizMusicalService
    {
        Task<QuizMusicalDto?> GetByIdAsync(int id);
        Task<IEnumerable<QuizMusicalDto>> GetAllAsync();
        Task AddAsync(QuizMusicalDto dto);
        Task UpdateAsync(QuizMusicalDto dto);
        Task DeleteAsync(int id);
    }
}
