using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Api.Mappings;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Endpoints;

public static class BookEndpoints
{
    public static RouteGroupBuilder MapBookEndpoints(this WebApplication app)
    {
        var grp = app.MapGroup("/books").WithTags("Books");

        grp.MapGet("/", GetAll)
           .AllowAnonymous()
           .Produces<BookResponseDto[]>(200);

        grp.MapGet("/{id:guid}", GetById)
           .AllowAnonymous()
           .Produces<BookResponseDto>(200)
           .Produces(404);

        grp.MapPost("/", Create)
           .RequireAuthorization("RequireEmployee")
           .Accepts<CreateBookDto>("application/json")
           .Produces<BookResponseDto>(201)
           .Produces(400);

        grp.MapPut("/{id:guid}", Update)
           .RequireAuthorization("RequireEmployee")
           .Accepts<UpdateBookDto>("application/json")
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
        var books = await db.Books
            .Include(b => b.Author)
            .Include(b => b.Categories)
            .Select(b => b.ToDto())
            .ToListAsync(ct);
        return Results.Ok(books);
    }

    private static async Task<IResult> GetById(
        Guid id,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var dto = await db.Books
            .Include(b => b.Author)
            .Include(b => b.Categories)
            .Where(b => b.Id == id)
            .Select(b => b.ToDto())
            .SingleOrDefaultAsync(ct);

        return dto is null
            ? Results.NotFound()
            : Results.Ok(dto);
    }

    private static async Task<IResult> Create(
        CreateBookDto dto,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var book = dto.ToEntity();
        db.Books.Add(book);
        await db.SaveChangesAsync(ct);

        await db.Entry(book).Reference(b => b.Author).LoadAsync(ct);
        await db.Entry(book).Collection(b => b.Categories)
              .Query()
              .LoadAsync(ct);

        return Results.Created($"/books/{book.Id}", book.ToDto());
    }

    private static async Task<IResult> Update(
        Guid id,
        UpdateBookDto dto,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        if (id != dto.Id)
            return Results.BadRequest();

        var book = await db.Books
            .Include(b => b.Categories)
            .SingleOrDefaultAsync(b => b.Id == id, ct);

        if (book is null)
            return Results.NotFound();

        dto.ApplyToEntity(book);
        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }

    private static async Task<IResult> Delete(
        Guid id,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var book = await db.Books.FindAsync([id], ct);
        if (book is null)
            return Results.NotFound();

        db.Books.Remove(book);
        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}
