using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Application.DTOs
{
    public class QuizMusicalDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string DuracionMax { get; set; } = null!;
        public string Nivel { get; set; } = null!;
        public List<QuestionQuizDto> Preguntas { get; set; } = new List<QuestionQuizDto>();

    }
}
