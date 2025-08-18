using Microsoft.AspNetCore.Mvc;
using MerengueRD.Application.DTOs;
using MerengueRD.Application.Services;

namespace MerengueRD.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventChronologicalsController : ControllerBase
    {
        private readonly EventChronologicalService _service;

        public EventChronologicalsController(EventChronologicalService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventChronologicalDto>>> GetAll()
        {
            var events = await _service.GetAllAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventChronologicalDto>> GetById(int id)
        {
            var eventChronological = await _service.GetByIdAsync(id);
            if (eventChronological == null)
                return NotFound();

            return Ok(eventChronological);
        }

        // POST: api/eventchronologicals
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] EventChronologicalDto dto)
        {
            if (dto == null)
                return BadRequest("El evento no puede ser nulo.");

            await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] EventChronologicalDto dto)
        {
            if (id != dto.Id)
                return BadRequest("El ID del evento no coincide.");

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