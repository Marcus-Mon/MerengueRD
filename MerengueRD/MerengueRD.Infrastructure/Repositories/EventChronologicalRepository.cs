using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Data;
using MerengueRD.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace MerengueRD.Infrastructure.Repositories 
{
    public class EventChronologicalRepository : IEventChronologicalRepository
    {
        private readonly MerengueRDApplicationContext _context;
        public EventChronologicalRepository(MerengueRDApplicationContext context)
        {
            _context = context;
        }
        public async Task<EventChronological?> GetByIdAsync(int id)
        {
            return await _context.EventChronologicals.FindAsync(id);
        }
        public async Task<IEnumerable<EventChronological>> GetAllAsync()
        {
            return await _context.EventChronologicals.ToListAsync();
        }
        public async Task AddAsync(EventChronological eventChronological)
        {
            await _context.EventChronologicals.AddAsync(eventChronological);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(EventChronological eventChronological)
        {
            _context.EventChronologicals.Update(eventChronological);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var eventChronological = await _context.EventChronologicals.FindAsync(id);
            if (eventChronological != null)
            {
                _context.EventChronologicals.Remove(eventChronological);
                await _context.SaveChangesAsync();
            }
        }
    }
 }

