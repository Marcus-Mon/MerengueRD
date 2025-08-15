using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerengueRD.Domain.Entities
{
    public class EventChronological
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public DateTime Fechainicio { get; set; }
        public string Description { get; set; }
        public string ImagenUrl { get; set; }

    }
}
