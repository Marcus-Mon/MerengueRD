using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Domain.Entities
{
    public class Song
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Duracion { get; set; }
        public DateTime FechaLanzamiento { get; set; }
        public string Description { get; set; }
        public string AudioUrl { get; set; }

    }
}
