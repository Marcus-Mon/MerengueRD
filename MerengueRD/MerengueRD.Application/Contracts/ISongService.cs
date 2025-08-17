using MerengueRD.Application.DTOs;

namespace MerengueRD.Application.Contracts
{
    public interface ISongService
    {
        Task<SongDto?> GetByIdAsync(int id);
        Task<IEnumerable<SongDto>> GetAllAsync();
        Task AddAsync(SongDto dto);
        Task UpdateAsync(SongDto dto);
        Task DeleteAsync(int id);
    }
}
