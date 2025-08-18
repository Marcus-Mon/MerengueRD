using MerengueRD.Application.DTOs;
using MerengueRD.Application.Services;
using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace MerengueRD.API.Controllers
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artist>>> GetAllArtists()
        {
            try
            {
                var artists = await _artistService.GetAllAsync();
                return Ok(artists);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Artist>> GetArtist(int id)
        {
            try
            {
                var artist = await _artistService.GetByIdAsync(id);
                if (artist == null)
                    return NotFound($"Artista con ID {id} no encontrado");

                return Ok(artist);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("search/{name}")]
        public async Task<ActionResult<IEnumerable<Artist>>> SearchArtistsByName(string name)
        {
            try
            {
                var artists = await _artistService.SearchByNameAsync(name);
                return Ok(artists);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Artist>> CreateArtist([FromBody] Artist artist)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdArtist = await _artistService.AddAsync(artist);
                return CreatedAtAction(nameof(GetArtist), new { id = createdArtist.Id }, createdArtist);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Artist>> UpdateArtist(int id, [FromBody] Artist artist)
        {
            try
            {
                if (id != artist.Id)
                    return BadRequest("El ID no coincide");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedArtist = await _artistService.UpdateAsync(artist);
                return Ok(updatedArtist);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteArtist(int id)
        {
            try
            {
                await _artistService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
}