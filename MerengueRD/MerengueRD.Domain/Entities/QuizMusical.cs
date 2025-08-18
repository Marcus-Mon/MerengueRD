using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Domain.Entities
{
    public class QuizMusical
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public int DuracionMax { get; set; }
        public string Nivel { get; set; }
        public List<QuestionQuiz> Preguntas { get; set; } = new List<QuestionQuiz>();

    }
}
