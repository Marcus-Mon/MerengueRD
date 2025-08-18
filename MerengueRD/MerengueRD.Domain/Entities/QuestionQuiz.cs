using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Domain.Entities
{
    public class QuestionQuiz
    {
        public int Id { get; set; }
        public string Enunciado { get; set; }
        public string Tipo { get; set; }
        public List<string> Opciones { get; set; }
        public string RespuestaCorrecta { get; set; }
    }
}
