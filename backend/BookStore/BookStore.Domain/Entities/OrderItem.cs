using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public required Order Order { get; set; }

        public Guid BookId { get; set; }
        public required Book Book { get; set; }

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
