using BookStore.Domain.Enums;

namespace BookStore.Api.DTOs.Requests
{
    public record OrderItemRequestDto(
        Guid BookId,
        int Quantity
    );

    public record CreateOrderRequestDto
    {
        public string? UserId { get; init; }
        public List<OrderItemRequestDto> Items { get; init; } = new();
    }

    public record UpdateOrderRequestDto(
    Guid Id,
    OrderStatus Status
)
    {
        public List<OrderItemRequestDto>? Items { get; init; }
    }
}
