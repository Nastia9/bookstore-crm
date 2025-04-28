namespace BookStore.Api.DTOs.Requests
{
    public record CreateAuthorDto(
       string Name,
       string? Bio
    );

    public record UpdateAuthorDto(
        Guid Id,
        string Name,
        string? Bio
    );
}
