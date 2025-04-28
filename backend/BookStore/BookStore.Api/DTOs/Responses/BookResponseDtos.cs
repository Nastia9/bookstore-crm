namespace BookStore.Api.DTOs.Responses
{
    public record BookResponseDto(
        Guid Id,
        string Title,
        string? ISBN,
        int Pages,
        int Stock,
        decimal Price,
        AuthorResponseDto Author,
        CategoryResponseDto[] Categories
    );
}
