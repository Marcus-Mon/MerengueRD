using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using MerengueRD.Infrastructure.Interfaces;


namespace MerengueRD.Infrastructure.Repositories
{
    public class ArtistRepository : IArtistRepository
    {
        private readonly MerengueRDApplicationContext _context;

        public ArtistRepository(MerengueRDApplicationContext context)
        {
            _context = context;
        }
        public async Task<Artist?> GetByIdAsync(int id)
        {
            return await _context.Artists.FindAsync(id);
        }
        public async Task<IEnumerable<Artist>> GetAllAsync()
        {
            return await _context.Artists.ToListAsync();
        }
        public async Task AddAsync(Artist artist)
        {
            await _context.Artists.AddAsync(artist);
        }
        public async Task UpdateAsync(Artist artist)
        {
            _context.Artists.Update(artist);
        }
        public async Task DeleteAsync(int id)
        {
            var artist = await _context.Artists.FindAsync(id);
            if (artist != null)
            {
                _context.Artists.Remove(artist);
            }
        }
    }
}
