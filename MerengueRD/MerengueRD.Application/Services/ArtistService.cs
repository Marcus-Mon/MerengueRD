using MerengueRD.Application.DTOs;
using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Interfaces;


namespace MerengueRD.Infrastructure.Repositories
{
    public class ArtistService
    {
        private readonly IArtistRepository _repository;
        public ArtistService(IArtistRepository repository)
        {
            _repository = repository;
        }
        public async Task<ArtistDto?> GetByIdAsync(int id)
        {
            var Artist = await _repository.GetByIdAsync(id);
            if (Artist == null) return null;

            return new ArtistDto
            {
                Id = Artist.Id,
                Nombre = Artist.Nombre,
                FechaNacimiento = Artist.FechaNacimiento,
                Nacionalidad = Artist.Nacionalidad,
                Biografia = Artist.Biografia,
                FotoUrl = Artist.FotoUrl,

            };
        }
        public async Task<IEnumerable<ArtistDto>> GetAllAsync()
        {
            var songs = await _repository.GetAllAsync();
            return songs.Select(a => new ArtistDto
            {
                Id = a.Id,
                Nombre = a.Nombre,
                FechaNacimiento = a.FechaNacimiento,
                Nacionalidad = a.Nacionalidad,
                Biografia = a.Biografia,
                FotoUrl = a.FotoUrl,
            });
        }
        public async Task AddAsync(ArtistDto dto)
        {
            var artist = new Artist
            {
                Nombre = dto.Nombre,
                FechaNacimiento = dto.FechaNacimiento,
                Nacionalidad = dto.Nacionalidad,
                Biografia = dto.Biografia,
                FotoUrl = dto.FotoUrl,
            };
            await _repository.AddAsync(artist);
        }
        public async Task UpdateAsync(ArtistDto dto)
        {
            var song = new Artist
            {
                Id = dto.Id,
                Nombre = dto.Nombre,
                FechaNacimiento = dto.FechaNacimiento,
                Nacionalidad = dto.Nacionalidad,
                Biografia = dto.Biografia,
                FotoUrl = dto.FotoUrl,
            };
            await _repository.UpdateAsync(song);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
