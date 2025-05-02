namespace BookStore.Api.DTOs.Responses
{
    public record UserResponseDto(
        string Id,
        string Email,
        string FirstName,
        string LastName,
        string? PhoneNumber,
        string Role
    );
}
