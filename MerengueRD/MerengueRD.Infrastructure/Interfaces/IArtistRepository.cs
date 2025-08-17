using MerengueRD.Domain.Entities;


namespace MerengueRD.Infrastructure.Interfaces
{
    public interface IArtistRepository
    {
        Task<Artist?> GetByIdAsync(int id);
        Task<IEnumerable<Artist>> GetAllAsync();
        Task AddAsync(Artist artist);
        Task UpdateAsync(Artist artist);
        Task DeleteAsync(int id);

    }
}
