namespace BookStore.Api.DTOs.Responses
{
    public record AuthorResponseDto(
        Guid Id,
        string FirstName,
        string LastName,
        string? Bio
    );
}
