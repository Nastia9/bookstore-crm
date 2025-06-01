using BookStore.Domain.Enums;

namespace BookStore.Api.DTOs.Responses
{
    public record OrderItemResponseDto(
        Guid BookId,
        string Title,
        int Quantity,
        decimal UnitPrice
    );

    public record OrderResponseDto(
        Guid Id,
        UserResponseDto User,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        OrderStatus Status,
        IEnumerable<OrderItemResponseDto> Items,
        decimal TotalPrice
    );
}
