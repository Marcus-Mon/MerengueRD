using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Application.DTOs
{
    public class EventChronologicalDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public DateTime Fechainicio { get; set; }
        public string Description { get; set; } = null!;
        public string ImagenUrl { get; set; } = null!;

    }
}
