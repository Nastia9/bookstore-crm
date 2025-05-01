using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Api.Mappings;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Endpoints;

public static class CategoryEndpoints
{
    public static RouteGroupBuilder MapCategoryEndpoints(this WebApplication app)
    {
        var grp = app.MapGroup("/categories").WithTags("Categories");

        grp.MapGet("/", GetAll)
           .AllowAnonymous()
           .Produces<CategoryResponseDto[]>(200);

        grp.MapGet("/{id:guid}", GetById)
           .AllowAnonymous()
           .Produces<CategoryResponseDto>(200)
           .Produces(404);

        grp.MapPost("/", Create)
           .RequireAuthorization("RequireEmployee")
           .Accepts<CreateCategoryDto>("application/json")
           .Produces<CategoryResponseDto>(201)
           .Produces(400);

        grp.MapPut("/{id:guid}", Update)
           .RequireAuthorization("RequireEmployee")
           .Accepts<UpdateCategoryDto>("application/json")
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
        var cats = await db.BookCategories
            .Select(c => c.ToDto())
            .ToListAsync(ct);
        return Results.Ok(cats);
    }

    private static async Task<IResult> GetById(
        Guid id,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var dto = await db.BookCategories
            .Where(c => c.Id == id)
            .Select(c => c.ToDto())
            .SingleOrDefaultAsync(ct);

        return dto is null
            ? Results.NotFound()
            : Results.Ok(dto);
    }

    private static async Task<IResult> Create(
        CreateCategoryDto dto,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var cat = dto.ToEntity();
        db.BookCategories.Add(cat);
        await db.SaveChangesAsync(ct);
        return Results.Created($"/categories/{cat.Id}", cat.ToDto());
    }

    private static async Task<IResult> Update(
        Guid id,
        UpdateCategoryDto dto,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        if (id != dto.Id)
            return Results.BadRequest();

        var cat = await db.BookCategories.FindAsync([id], ct);
        if (cat is null)
            return Results.NotFound();

        dto.ApplyToEntity(cat);
        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }

    private static async Task<IResult> Delete(
        Guid id,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var cat = await db.BookCategories.FindAsync([id], ct);
        if (cat is null)
            return Results.NotFound();

        db.BookCategories.Remove(cat);
        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}
