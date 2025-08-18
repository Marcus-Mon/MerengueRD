using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Application.DTOs
{
    public class QuestionQuizDto
    {
        public int Id { get; set; }
        public string Enunciado { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public List<string> Opciones { get; set; } = null!;
        public string RespuestaCorrecta { get; set; } = null!;
    }
}
