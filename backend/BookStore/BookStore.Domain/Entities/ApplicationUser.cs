using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace BookStore.Domain.Entities
{
    public class ApplicationUser: IdentityUser
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
