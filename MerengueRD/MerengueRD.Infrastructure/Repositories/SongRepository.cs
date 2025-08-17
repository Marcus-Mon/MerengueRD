using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Data;
using MerengueRD.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace MerengueRD.Infrastructure.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly MerengueRDApplicationContext _context;
        public SongRepository(MerengueRDApplicationContext context)
        {
            _context = context;
        }
        public async Task<Song?> GetByIdAsync(int id)
        {
            return await _context.Songs.FindAsync(id);
        }
        public async Task<IEnumerable<Song>> GetAllAsync()
        {
            return await _context.Songs.ToListAsync();
        }
        public async Task AddAsync(Song song)
        {
            await _context.Songs.AddAsync(song);
        }
        public async Task UpdateAsync(Song song)
        {
            _context.Songs.Update(song);
        }
        public async Task DeleteAsync(int id)
        {
            var song = await _context.Songs.FindAsync(id);
            if (song != null)
            {
                _context.Songs.Remove(song);
            }
        }
    }
}
