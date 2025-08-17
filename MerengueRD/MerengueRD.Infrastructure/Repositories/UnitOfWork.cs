using MerengueRD.Infrastructure.Data;
using MerengueRD.Infrastructure.Interfaces;


namespace MerengueRD.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly MerengueRDApplicationContext _context;

        private IArtistRepository? _artists;
        private IEventChronologicalRepository? _eventChronologicals;
        private IQuestionQuizRepository? _questionQuizzes;
        private IQuizMusicalRepository? _quizMusicals;
        private ISongRepository? _songs;

        public UnitOfWork(MerengueRDApplicationContext context)
        {
            _context = context;
        }
        public IArtistRepository Artists => _artists ??= new ArtistRepository(_context);
        public IEventChronologicalRepository EventChronologicals => _eventChronologicals ??= new EventChronologicalRepository(_context);
        public IQuestionQuizRepository QuestionQuizzes => _questionQuizzes ??= new QuestionQuizRepository(_context);
        public IQuizMusicalRepository QuizMusicals => _quizMusicals ??= new QuizMusicalRepository(_context);
        public ISongRepository Songs => _songs ??= new SongRepository(_context);

        public async Task<int> SaveChangesAsync()
        { 
            return await _context.SaveChangesAsync(); 
        }
        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
