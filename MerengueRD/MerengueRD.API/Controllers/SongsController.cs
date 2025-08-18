using MerengueRD.Application.DTOs;
using MerengueRD.Application.Services;
using MerengueRD.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MerengueRD.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SongsController : ControllerBase
    {
        private readonly SongService _songService;

        public SongsController(SongService songService)
        {
            _songService = songService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Song>>> GetAllSongs()
        {
            try
            {
                var songs = await _songService.GetAllAsync();
                return Ok(songs);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Song>> GetSong(int id)
        {
            try
            {
                var song = await _songService.GetByIdAsync(id);
                if (song == null)
                    return NotFound($"Canción con ID {id} no encontrada");

                return Ok(song);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("search/{title}")]
        public async Task<ActionResult<IEnumerable<Song>>> SearchSongsByTitle(string title)
        {
            try
            {
                var songs = await _songService.SearchByTitleAsync(title);
                return Ok(songs);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("by-year/{year}")]
        public async Task<ActionResult<IEnumerable<Song>>> GetSongsByYear(int year)
        {
            try
            {
                var songs = await _songService.GetSongsByYearAsync(year);
                return Ok(songs);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Song>> CreateSong([FromBody] Song song)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdSong = await _songService.AddAsync(song);
                return CreatedAtAction(nameof(GetSong), new { id = createdSong.Id }, createdSong);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Song>> UpdateSong(int id, [FromBody] Song song)
        {
            try
            {
                if (id != song.Id)
                    return BadRequest("El ID no coincide");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedSong = await _songService.UpdateAsync(song);
                return Ok(updatedSong);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSong(int id)
        {
            try
            {
                await _songService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
}
