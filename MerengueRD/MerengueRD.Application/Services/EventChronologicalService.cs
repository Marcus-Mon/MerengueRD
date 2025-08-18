using MerengueRD.Application.DTOs;
using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Interfaces;

namespace MerengueRD.Application.Services
{
    public class EventChronologicalService
    {
        private readonly IEventChronologicalRepository _repository;
        public EventChronologicalService(IEventChronologicalRepository repository)
        {
            _repository = repository;
        }
        public async Task<EventChronologicalDto?> GetByIdAsync(int id)
        {
            var EventChronological = await _repository.GetByIdAsync(id);
            if (EventChronological == null) return null;

            return new EventChronologicalDto
            {
                Id = EventChronological.Id,
                Titulo = EventChronological.Titulo,
                Fechainicio = EventChronological.Fechainicio,
                Description = EventChronological.Description,
                ImagenUrl = EventChronological.ImagenUrl,

            };

        }
        public async Task<IEnumerable<EventChronologicalDto>> GetAllAsync()
        {
            var eventchronologicals = await _repository.GetAllAsync();
            return eventchronologicals.Select(e => new EventChronologicalDto
            {
                Id = e.Id,
                Titulo = e.Titulo,
                Fechainicio = e.Fechainicio,
                Description = e.Description,
                ImagenUrl = e.ImagenUrl,
            });
        }
        public async Task AddAsync(EventChronologicalDto dto)
        {
            var eventchronological = new EventChronological
            {
                Titulo = dto.Titulo,
                Fechainicio = dto.Fechainicio,
                Description = dto.Description,
                ImagenUrl = dto.ImagenUrl,
            };
            await _repository.AddAsync(eventchronological);
        }
        public async Task UpdateAsync(EventChronologicalDto dto)
        {
            var eventChronological = new EventChronological
            {
                Id = dto.Id,
                Titulo = dto.Titulo,
                Fechainicio = dto.Fechainicio,
                Description = dto.Description,
                ImagenUrl = dto.ImagenUrl,
            };
            await _repository.UpdateAsync(eventChronological);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
