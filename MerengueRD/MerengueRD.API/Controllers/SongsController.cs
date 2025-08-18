using Microsoft.AspNetCore.Mvc;
using MerengueRD.Application.DTOs;
using MerengueRD.Application.Services;

namespace MerengueRD.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SongsController : ControllerBase
    {
        private readonly SongService _service;

        public SongsController(SongService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SongDto>>> GetAll()
        {
            var songs = await _service.GetAllAsync();
            return Ok(songs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SongDto>> GetById(int id)
        {
            var song = await _service.GetByIdAsync(id);
            if (song == null)
                return NotFound();

            return Ok(song);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] SongDto dto)
        {
            if (dto == null)
                return BadRequest("La canción no puede ser nula.");

            await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] SongDto dto)
        {
            if (id != dto.Id)
                return BadRequest("El ID de la canción no coincide.");

            await _service.UpdateAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}