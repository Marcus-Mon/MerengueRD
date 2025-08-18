using Microsoft.AspNetCore.Mvc;
using MerengueRD.Application.DTOs;
using MerengueRD.Application.Services;

namespace MerengueRD.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionQuizzesController : ControllerBase
    {
        private readonly QuestionQuizService _service;

        public QuestionQuizzesController(QuestionQuizService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionQuizDto>>> GetAll()
        {
            var quizzes = await _service.GetAllAsync();
            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionQuizDto>> GetById(int id)
        {
            var quiz = await _service.GetByIdAsync(id);
            if (quiz == null)
                return NotFound();

            return Ok(quiz);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] QuestionQuizDto dto)
        {
            if (dto == null)
                return BadRequest("La pregunta no puede ser nula.");

            await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] QuestionQuizDto dto)
        {
            if (id != dto.Id)
                return BadRequest("El ID de la pregunta no coincide.");

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