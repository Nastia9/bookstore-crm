using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Domain.Entities
{
    public class BookCategory
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }

        public ICollection<Book> Books { get; set; } = [];
    }
}
