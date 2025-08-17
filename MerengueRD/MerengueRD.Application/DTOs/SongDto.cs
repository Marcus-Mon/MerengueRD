using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Application.DTOs
{
    public class SongDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string Duracion { get; set; } = null!;
        public DateTime FechaLanzamiento { get; set; }
        public string Description { get; set; } = null!;
        public string AudioUrl { get; set; } = null!;

    }
}
