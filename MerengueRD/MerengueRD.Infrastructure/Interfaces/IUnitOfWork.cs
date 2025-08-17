
namespace MerengueRD.Infrastructure.Interfaces
{
    public interface IUnitOfWork
    {
        IArtistRepository Artists { get; }
        IEventChronologicalRepository EventChronologicals { get; }
        IQuestionQuizRepository QuestionQuizzes { get; }
        IQuizMusicalRepository QuizMusicals { get; }
        ISongRepository Songs { get; }

        Task<int> SaveChangesAsync();
    }
}
