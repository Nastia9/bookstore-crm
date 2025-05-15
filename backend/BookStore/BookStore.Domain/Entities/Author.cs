using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Domain.Entities
{
    public class Author
    {
        public Guid Id { get; set; }
        public required string FirstName { get; set; }

        public required string LastName { get; set; }
        public string? Bio { get; set; }

        public ICollection<Book> Books { get; set; } = [];
    }
}
