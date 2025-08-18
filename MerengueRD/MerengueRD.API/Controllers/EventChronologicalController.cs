using MerengueRD.Application.Services;
using MerengueRD.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MerengueRD.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventChronologicalController : ControllerBase
    {
        private readonly EventChronologicalService _eventService;

        public EventChronologicalController(EventChronologicalService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventChronological>>> GetAllEvents()
        {
            try
            {
                var events = await _eventService.GetAllAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("chronological")]
        public async Task<ActionResult<IEnumerable<EventChronological>>> GetEventsChronologically()
        {
            try
            {
                var events = await _eventService.GetEventsChronologicallyAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventChronological>> GetEvent(int id)
        {
            try
            {
                var eventItem = await _eventService.GetByIdAsync(id);
                if (eventItem == null)
                    return NotFound($"Evento con ID {id} no encontrado");

                return Ok(eventItem);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("by-year/{year}")]
        public async Task<ActionResult<IEnumerable<EventChronological>>> GetEventsByYear(int year)
        {
            try
            {
                var events = await _eventService.GetEventsByYearAsync(year);
                return Ok(events);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<EventChronological>> CreateEvent([FromBody] EventChronological eventItem)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdEvent = await _eventService.AddAsync(eventItem);
                return CreatedAtAction(nameof(GetEvent), new { id = createdEvent.Id }, createdEvent);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EventChronological>> UpdateEvent(int id, [FromBody] EventChronological eventItem)
        {
            try
            {
                if (id != eventItem.Id)
                    return BadRequest("El ID no coincide");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedEvent = await _eventService.UpdateAsync(eventItem);
                return Ok(updatedEvent);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEvent(int id)
        {
            try
            {
                await _eventService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
}
