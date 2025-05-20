namespace BookStore.Api.DTOs.Requests
{
    public record CreateAuthorDto(
       string FirstName,
       string LastName,
       string? Bio
    );

    public record UpdateAuthorDto(
        Guid Id,
        string FirstName,
        string LastName,
        string? Bio
    );
}
