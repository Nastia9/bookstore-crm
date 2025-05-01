using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Api.Mappings;
using BookStore.Domain.Entities;
using BookStore.Identity.Models;
using BookStore.Identity.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using System.Data;

namespace BookStore.Api.Endpoints
{
    public static class AuthorizationEndpoints
    {
        public static RouteGroupBuilder MapAuthEndpoints(this WebApplication app)
        {
            var grp = app
                .MapGroup("/auth")
                .WithTags("Authentication");

            grp.MapPost("/register", Register)
               .Accepts<RegisterRequestDto>("application/json")
               .Produces<RegisterResponseDto>(StatusCodes.Status201Created)
               .Produces(StatusCodes.Status400BadRequest)
               .Produces(StatusCodes.Status409Conflict);

            grp.MapPost("/login", Login)
               .Accepts<LoginRequestDto>("application/json")
               .Produces<LoginResponseDto>(StatusCodes.Status200OK)
               .Produces(StatusCodes.Status401Unauthorized);

            return grp;
        }

        private static async Task<IResult> Register(
            RegisterRequestDto dto,
            UserManager<ApplicationUser> userManager,
            CancellationToken ct)
        {
            if (await userManager.FindByEmailAsync(dto.Email) is not null)
                return Results.Conflict(new { Message = "Email already taken." });

            var user = dto.ToEntity();

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return Results.BadRequest(result.Errors);

            await userManager.AddToRoleAsync(user, Roles.Customer);

            var response = new RegisterResponseDto { UserId = user.Id };
            return Results.Created($"/auth/register/{user.Id}", response);
        }

        private static async Task<IResult> Login(
            LoginRequestDto dto,
            UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            CancellationToken ct)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user is null ||
                !await userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Results.Unauthorized();
            }

            var roles = await userManager.GetRolesAsync(user);
            var token = tokenService.CreateToken(user.Id, user.Email!, roles);

            return Results.Ok(new LoginResponseDto { Token = token });
        }
    }
}
