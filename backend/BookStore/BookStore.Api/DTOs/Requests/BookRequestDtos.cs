namespace BookStore.Api.DTOs.Requests
{
    public record CreateBookDto(
        string Title,
        string? ISBN,
        int Pages,
        int Stock,
        decimal Price,
        Guid AuthorId,
        Guid[]? CategoryIds,
        string? ImagePath
    );

    public record UpdateBookDto(
        Guid Id,
        string Title,
        string? ISBN,
        int Pages,
        int Stock,
        decimal Price,
        Guid AuthorId,
        Guid[]? CategoryIds,
        string? ImagePath
    );
}
