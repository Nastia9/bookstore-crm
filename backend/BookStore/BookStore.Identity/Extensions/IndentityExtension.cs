using BookStore.Domain.Entities;
using BookStore.Identity.Models;
using BookStore.Identity.Services;
using BookStore.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Identity.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddIdentityServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddIdentity<ApplicationUser, IdentityRole>(opts =>
            {
                opts.Password.RequireDigit = false;
                opts.Password.RequiredLength = 6;
                opts.Password.RequireNonAlphanumeric = false;
                opts.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<BookStoreDbContext>()
                .AddDefaultTokenProviders();

            var jwt = configuration.GetSection("Jwt");
            services.Configure<JwtSettings>(jwt);
            var keyBase64 = jwt["Key"]!;
            var keyBytes = Convert.FromBase64String(keyBase64);
            var key = new SymmetricSecurityKey(keyBytes);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
              .AddJwtBearer(opt =>
              {
                  opt.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuerSigningKey = true,
                      IssuerSigningKey = key,
                      ValidateIssuer = true,
                      ValidIssuer = jwt["Issuer"],
                      ValidateAudience = true,
                      ValidAudience = jwt["Audience"]
                  };
              });

            services.AddAuthorizationBuilder()
                .AddPolicy(Policies.RequireEmployee, p => p.RequireRole(Roles.Employee, Roles.Admin))
                .AddPolicy(Policies.RequireAdmin, p => p.RequireRole(Roles.Admin));

            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
