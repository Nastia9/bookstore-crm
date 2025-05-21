using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Api.Mappings;
using BookStore.Domain.Entities;
using BookStore.Identity.Models;
using BookStore.Identity.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookStore.Api.Endpoints;

public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this WebApplication app)
    {
        var grp = app.MapGroup("/users").WithTags("Users");

        // 1) Get my own profile
        grp.MapGet("/me", GetMyProfile)
           .RequireAuthorization()
           .Produces<UserResponseDto>(200);

        // 2) Admin: list all
        grp.MapGet("/", GetAllUsers)
           .RequireAuthorization("RequireAdmin")
           .Produces<UserResponseDto[]>(200);

        // 3) Admin: get by id
        grp.MapGet("/{id}", GetUserById)
           .RequireAuthorization("RequireAdmin")
           .Produces<UserResponseDto>(200)
           .Produces(404);

        // 4) Admin: create user
        grp.MapPost("/", CreateUser)
           .RequireAuthorization("RequireAdmin")
           .Accepts<CreateUserRequestDto>("application/json")
           .Produces<UserResponseDto>(201)
           .Produces(400);

        // 5) Admin: update user
        grp.MapPut("/{id}", UpdateUser)
           .RequireAuthorization("RequireAdmin")
           .Accepts<UpdateUserRequestDto>("application/json")
           .Produces(204)
           .Produces(400)
           .Produces(404);

        // 6) Admin: delete user
        grp.MapDelete("/{id}", DeleteUser)
           .RequireAuthorization("RequireAdmin")
           .Produces(204)
           .Produces(404);

        return grp;
    }

    private static async Task<IResult> GetMyProfile(
        HttpContext http,
        UserManager<ApplicationUser> users,
        CancellationToken ct)
    {
        var myId = http.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await users.FindByIdAsync(myId);
        if (user is null)
            return Results.NotFound();
        var roles = await users.GetRolesAsync(user);
        var highest = PickHighestRole(roles);
        

        return Results.Ok(user.ToResponseDto(role: highest));
    }

    private static async Task<IResult> GetAllUsers(
        UserManager<ApplicationUser> userManager,
        CancellationToken ct)
    {
        var users = await userManager.Users.ToListAsync(ct);
        var list = new List<UserResponseDto>(users.Count);

        foreach (var u in users)
        {
            var roles = await userManager.GetRolesAsync(u);
            var highest = PickHighestRole(roles);
            list.Add(u.ToResponseDto(highest));
        }

        return Results.Ok(list);
    }

    private static async Task<IResult> GetUserById(
        string id,
        UserManager<ApplicationUser> users,
        CancellationToken ct)
    {
        var user = await users.FindByIdAsync(id);
        if (user is null)
            return Results.NotFound();
        var roles = await users.GetRolesAsync(user);
        var highest = PickHighestRole(roles);

        return Results.Ok(user.ToResponseDto(role: highest));
    }

    private static async Task<IResult> CreateUser(
        CreateUserRequestDto dto,
        UserManager<ApplicationUser> users,
        RoleManager<IdentityRole> roles,
        ITokenService tokens,
        CancellationToken ct)
    {
        var user = dto.ToEntity();
        var result = await users.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return Results.BadRequest(result.Errors);

        if (!await roles.RoleExistsAsync(dto.Role))
            await roles.CreateAsync(new IdentityRole(dto.Role));

        await users.AddToRoleAsync(user, dto.Role);
        return Results.Created($"/users/{user.Id}", user.ToResponseDto(role: dto.Role));
    }

    private static async Task<IResult> UpdateUser(
        string id,
        UpdateUserRequestDto dto,
        UserManager<ApplicationUser> users,
        RoleManager<IdentityRole> roles,
        CancellationToken ct)
    {
        if (id != dto.Id)
            return Results.BadRequest();

        var user = await users.FindByIdAsync(id);
        if (user is null)
            return Results.NotFound();

        dto.ApplyToEntity(user);

        // handle role change
        var currentRoles = await users.GetRolesAsync(user);
        if (!currentRoles.Contains(dto.Role))
        {
            if (!await roles.RoleExistsAsync(dto.Role))
                await roles.CreateAsync(new IdentityRole(dto.Role));

            await users.RemoveFromRolesAsync(user, currentRoles);
            await users.AddToRoleAsync(user, dto.Role);
        }

        var update = await users.UpdateAsync(user);
        if (!update.Succeeded)
            return Results.BadRequest(update.Errors);

        return Results.NoContent();
    }

    private static async Task<IResult> DeleteUser(
        string id,
        UserManager<ApplicationUser> users,
        CancellationToken ct)
    {
        var user = await users.FindByIdAsync(id);
        if (user is null)
            return Results.NotFound();

        await users.DeleteAsync(user);
        return Results.NoContent();
    }

    private static string PickHighestRole(IList<string> roles)
    {
        if (roles.Contains(Roles.Admin)) return Roles.Admin;
        if (roles.Contains(Roles.Employee)) return Roles.Employee;
        return Roles.Customer;
    }
}
