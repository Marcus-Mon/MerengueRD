using Microsoft.AspNetCore.Mvc;
using MerengueRD.Application.DTOs;
using MerengueRD.Infrastructure.Repositories;

namespace MerengueRD.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArtistsController : ControllerBase
    {
        private readonly ArtistService _artistService;

        public ArtistsController(ArtistService artistService)
        {
            _artistService = artistService;
        }

        // GET: api/artists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArtistDto>>> GetAll()
        {
            var artists = await _artistService.GetAllAsync();
            return Ok(artists);
        }

        // GET: api/artists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ArtistDto>> GetById(int id)
        {
            var artist = await _artistService.GetByIdAsync(id);
            if (artist == null)
                return NotFound();

            return Ok(artist);
        }

        // POST: api/artists
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] ArtistDto dto)
        {
            if (dto == null)
                return BadRequest("El artista no puede ser nulo.");

            await _artistService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        // PUT: api/artists/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] ArtistDto dto)
        {
            if (id != dto.Id)
                return BadRequest("El ID del artista no coincide.");

            await _artistService.UpdateAsync(dto);
            return NoContent();
        }

        // DELETE: api/artists/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _artistService.DeleteAsync(id);
            return NoContent();
        }
    }
}