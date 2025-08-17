using MerengueRD.Domain.Entities;
using MerengueRD.Application.DTOs;
using MerengueRD.Infrastructure.Interfaces;

namespace MerengueRD.Application.Services
{
    public class SongService
    {
        private readonly ISongRepository _repository;
        public SongService(ISongRepository repository)
        {
            _repository = repository;
        }
        public async Task<SongDto?> GetByIdAsync(int id)
        {
            var Song = await _repository.GetByIdAsync(id);
            if (Song == null) return null;

            return new SongDto
            {
                Id = Song.Id,
                Titulo = Song.Titulo,
                Duracion = Song.Duracion,
                FechaLanzamiento = Song.FechaLanzamiento,
                Description = Song.Description,
                AudioUrl = Song.AudioUrl,

            };
        }
        public async Task<IEnumerable<SongDto>> GetAllAsync()
        {
            var songs = await _repository.GetAllAsync();
            return songs.Select(s => new SongDto
            {
                Id = s.Id,
                Titulo = s.Titulo,
                Duracion = s.Duracion,
                FechaLanzamiento = s.FechaLanzamiento,
                Description = s.Description,
                AudioUrl = s.AudioUrl,
            });
        }
        public async Task AddAsync(SongDto dto)
        {
            var song = new Song
            {
                Titulo = dto.Titulo,
                Duracion = dto.Duracion,
                FechaLanzamiento = dto.FechaLanzamiento,
                Description = dto.Description,
                AudioUrl = dto.AudioUrl,
            };
        }
        public async Task UpdateAsync(SongDto dto)
        {
            var song = new Song
            {
                Id = dto.Id,
                Titulo = dto.Titulo,
                Duracion = dto.Duracion,
                FechaLanzamiento = dto.FechaLanzamiento,
                Description = dto.Description,
                AudioUrl = dto.AudioUrl,
            };
            await _repository.UpdateAsync(song);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
