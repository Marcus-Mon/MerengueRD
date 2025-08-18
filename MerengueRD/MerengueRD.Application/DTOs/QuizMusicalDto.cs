
namespace MerengueRD.Application.DTOs
{
    public class QuizMusicalDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public int DuracionMax { get; set; }
        public string Nivel { get; set; } = null!;
        public List<QuestionQuizDto> Preguntas { get; set; } = new List<QuestionQuizDto>();

    }
}
