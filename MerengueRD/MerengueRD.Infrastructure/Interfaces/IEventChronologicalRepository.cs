using MerengueRD.Domain.Entities;


namespace MerengueRD.Infrastructure.Interfaces
{
    public interface IEventChronologicalRepository
    {
        Task<EventChronological?> GetByIdAsync(int id);
        Task<IEnumerable<EventChronological>> GetAllAsync();
        Task AddAsync(EventChronological eventChronological);
        Task UpdateAsync(EventChronological eventChronological);
        Task DeleteAsync(int id);
    }
}
