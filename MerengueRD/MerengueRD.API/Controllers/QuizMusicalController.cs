using Microsoft.AspNetCore.Mvc;
using MerengueRD.Application.DTOs;
using MerengueRD.Application.Services;

namespace MerengueRD.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizMusicalsController : ControllerBase
    {
        private readonly QuizMusicalService _service;

        public QuizMusicalsController(QuizMusicalService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizMusicalDto>>> GetAll()
        {
            var quizzes = await _service.GetAllAsync();
            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuizMusicalDto>> GetById(int id)
        {
            var quiz = await _service.GetByIdAsync(id);
            if (quiz == null)
                return NotFound();

            return Ok(quiz);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] QuizMusicalDto dto)
        {
            if (dto == null)
                return BadRequest("El quiz no puede ser nulo.");

            await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] QuizMusicalDto dto)
        {
            if (id != dto.Id)
                return BadRequest("El ID del quiz no coincide.");

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

