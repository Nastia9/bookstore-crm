using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Identity.Models
{
    public static class Policies
    {
        public const string RequireAdmin = "RequireAdmin";
        public const string RequireEmployee = "RequireEmployee";
    }
}
