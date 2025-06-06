namespace BookStore.Api.DTOs.Requests
{
    public record CreateCategoryDto(
        string Name
    );

    public record UpdateCategoryDto(
        Guid Id,
        string Name
    );
}
