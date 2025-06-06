using BookStore.Domain.Entities;
using BookStore.Identity.Models;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace BookStore.Api.Extensions
{
    public static class ServiceProviderExtensions
    { 
        public static async Task SeedRolesAndAdminAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roles = [Roles.Admin, Roles.Employee, Roles.Customer];

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            const string adminEmail = "admin@bookstore.local";
            const string adminPass = "P@ssw0rd!";
            var admin = await userManager.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "System",
                    LastName = "Administrator",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, adminPass);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors);
                    throw new ApplicationException($"Не вдалося створити Admin-користувача: {errors}");
                }
            }

            if (!await userManager.IsInRoleAsync(admin, Roles.Admin))
            {
                await userManager.AddToRoleAsync(admin, Roles.Admin);
            }
        }
    }
}
