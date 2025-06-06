using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Domain.Entities
{
    public class Book
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? ISBN { get; set; }
        public int Pages { get; set; }
        public Guid AuthorId { get; set; }
        public Author? Author { get; set; }

        public ICollection<BookCategory> Categories { get; set; } = [];
        public ICollection<OrderItem> OrderItems { get; set; } = [];

        public int Stock { get; set; }
        public decimal Price { get; set; }
        public string? ImagePath { get; set; }
    }
}
