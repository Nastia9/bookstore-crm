using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Api.Mappings;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Endpoints;

public static class AuthorEndpoints
{
    public static RouteGroupBuilder MapAuthorEndpoints(this WebApplication app)
    {
        var grp = app.MapGroup("/authors").WithTags("Authors");

        // anyone can list
        grp.MapGet("/", GetAll)
           .AllowAnonymous()
           .Produces<AuthorResponseDto[]>(200);

        // anyone can fetch by id
        grp.MapGet("/{id:guid}", GetById)
           .AllowAnonymous()
           .Produces<AuthorResponseDto>(200)
           .Produces(404);

        // only employee+admin
        grp.MapPost("/", Create)
           .RequireAuthorization("RequireEmployee")
           .Accepts<CreateAuthorDto>("application/json")
           .Produces<AuthorResponseDto>(201)
           .Produces(400);

        grp.MapPut("/{id:guid}", Update)
           .RequireAuthorization("RequireEmployee")
           .Accepts<UpdateAuthorDto>("application/json")
           .Produces(204)
           .Produces(400)
           .Produces(404);

        grp.MapDelete("/{id:guid}", Delete)
           .RequireAuthorization("RequireEmployee")
           .Produces(204)
           .Produces(404);

        return grp;
    }

    private static async Task<IResult> GetAll(
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var authors = await db.Authors
            .Select(a => a.ToDto())
            .ToListAsync(ct);
        return Results.Ok(authors);
    }

    private static async Task<IResult> GetById(
        Guid id,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var dto = await db.Authors
            .Where(a => a.Id == id)
            .Select(a => a.ToDto())
            .SingleOrDefaultAsync(ct);

        return dto is null
            ? Results.NotFound()
            : Results.Ok(dto);
    }

    private static async Task<IResult> Create(
        CreateAuthorDto dto,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var author = dto.ToEntity();
        db.Authors.Add(author);
        await db.SaveChangesAsync(ct);

        return Results.Created($"/authors/{author.Id}", author.ToDto());
    }

    private static async Task<IResult> Update(
        Guid id,
        UpdateAuthorDto dto,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        if (id != dto.Id)
            return Results.BadRequest();

        var author = await db.Authors.FindAsync([id], ct);
        if (author is null)
            return Results.NotFound();

        dto.ApplyToEntity(author);
        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }

    private static async Task<IResult> Delete(
        Guid id,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var author = await db.Authors.FindAsync(new object[] { id }, ct);
        if (author is null)
            return Results.NotFound();

        db.Authors.Remove(author);
        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}
