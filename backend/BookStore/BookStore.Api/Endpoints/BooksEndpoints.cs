using BookStore.Api.DTOs.Requests;
using BookStore.Api.Mappings;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Endpoints
{
    public static class BooksEndpoints
    {
        public static void Map(WebApplication app)
        {
            var group = app.MapGroup("/api/books");

            group.MapGet("", async (BookStoreDbContext db) =>
            {
                var books = await db.Books
                    .Include(b => b.Author)
                    .Include(b => b.Categories)
                    .ToListAsync();

                return Results.Ok(books.Select(b => b.ToDto()));
            });

            group.MapGet("/{id}", async (Guid id, BookStoreDbContext db) =>
            {
                var book = await db.Books
                    .Include(b => b.Author)
                    .Include(b => b.Categories)
                    .FirstOrDefaultAsync(b => b.Id == id);

                return book is not null
                    ? Results.Ok(book.ToDto())
                    : Results.NotFound();
            });

            group.MapPost("", async (CreateBookDto dto, BookStoreDbContext db) =>
            {
                var book = dto.ToEntity();
                // додаткові категорії
                if (dto.CategoryIds?.Any() == true)
                {
                    book.Categories = await db.BookCategories
                        .Where(c => dto.CategoryIds.Contains(c.Id))
                        .ToListAsync();
                }

                db.Books.Add(book);
                await db.SaveChangesAsync();

                // завантажуємо навігаційні своїства
                await db.Entry(book).Reference(b => b.Author).LoadAsync();
                await db.Entry(book).Collection(b => b.Categories).LoadAsync();

                return Results.Created($"/api/books/{book.Id}", book.ToDto());
            });

            group.MapPut("/{id}", async (UpdateBookDto dto, BookStoreDbContext db) =>
            {
                if (!await db.Books.AnyAsync(b => b.Id == dto.Id))
                    return Results.NotFound();

                var book = dto.ToEntity();
                db.Books.Attach(book);

                if (dto.CategoryIds?.Any() == true)
                {
                    book.Categories = await db.BookCategories
                        .Where(c => dto.CategoryIds.Contains(c.Id))
                        .ToListAsync();
                }

                await db.SaveChangesAsync();
                await db.Entry(book).Reference(b => b.Author).LoadAsync();
                await db.Entry(book).Collection(b => b.Categories).LoadAsync();

                return Results.Ok(book.ToDto());
            });

            group.MapDelete("/{id}", async (Guid id, BookStoreDbContext db) =>
            {
                var deletedRecords = await db.Books.Where(c => c.Id == id).ExecuteDeleteAsync();

                if (deletedRecords.Equals(0))
                {
                    return Results.NotFound();
                }
                else
                {
                    await db.SaveChangesAsync();
                    return Results.NoContent();
                }
            });
        }
    }
}
