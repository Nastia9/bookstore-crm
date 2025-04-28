namespace BookStore.Api.DTOs.Responses
{
    public record AuthorResponseDto(
        Guid Id,
        string Name,
        string? Bio
    );
}
