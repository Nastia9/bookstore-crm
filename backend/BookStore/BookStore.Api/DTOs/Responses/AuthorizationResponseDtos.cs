namespace BookStore.Api.DTOs.Responses
{
    public class RegisterResponseDto
    {
        public required string UserId { get; set; }
    }

    public class LoginResponseDto
    {
        public required string Token { get; set; }
    }
}
