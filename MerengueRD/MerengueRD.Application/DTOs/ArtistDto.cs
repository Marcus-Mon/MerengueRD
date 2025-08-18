using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Application.DTOs
{
    public class ArtistDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public string Nacionalidad { get; set; } = null!;
        public string Biografia { get; set; } = null!;
        public string FotoUrl { get; set; } = null!;


    }
}
