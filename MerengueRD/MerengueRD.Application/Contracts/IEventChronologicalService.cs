using MerengueRD.Application.DTOs;

namespace MerengueRD.Application.Contracts
{
    public interface IEventChronologicalService
    {
        Task<EventChronologicalDto?> GetByIdAsync(int id);
        Task<IEnumerable<EventChronologicalDto>> GetAllAsync();
        Task AddAsync(EventChronologicalDto Dto);
        Task UpdateAsync(EventChronologicalDto Dto);
        Task DeleteAsync(int id);
    }
}
