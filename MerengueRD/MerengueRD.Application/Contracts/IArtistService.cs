using MerengueRD.Application.DTOs;


namespace MerengueRD.Application.Contracts
{
    public interface IArtistService 
    {
        Task<ArtistDto?> GetByIdAsync(int id);
        Task<IEnumerable<ArtistDto>> GetAllAsync();
        Task AddAsync(ArtistDto dto);
        Task UpdateAsync(ArtistDto dto);
        Task DeleteAsync(int id);

    }
}
