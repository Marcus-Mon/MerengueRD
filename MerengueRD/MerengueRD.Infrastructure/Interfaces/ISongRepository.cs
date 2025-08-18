using MerengueRD.Domain.Entities;

namespace MerengueRD.Infrastructure.Interfaces
{
    public interface ISongRepository
    {
        Task<Song?> GetByIdAsync(int id);
        Task<IEnumerable<Song>> GetAllAsync();
        Task AddAsync(Song song);
        Task UpdateAsync(Song song);
        Task DeleteAsync(int id);
    }
}
