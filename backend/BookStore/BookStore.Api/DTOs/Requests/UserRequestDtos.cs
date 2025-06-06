using BookStore.Identity.Models;

namespace BookStore.Api.DTOs.Requests
{
    public record CreateUserRequestDto
    {
        public string Email { get; init; } = default!;
        public string Password { get; init; } = default!;
        public string FirstName { get; init; } = default!;
        public string LastName { get; init; } = default!;
        public string? PhoneNumber { get; init; }
        public string Role { get; init; } = Roles.Customer;
    }

    public record UpdateUserRequestDto(
        string Id,
        string FirstName,
        string LastName,
        string Role
    )
    {
        public string? PhoneNumber { get; init; }
    }
}
