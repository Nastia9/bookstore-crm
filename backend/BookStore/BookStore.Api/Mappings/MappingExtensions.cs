using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Domain.Entities;
using BookStore.Domain.Enums;
using BookStore.Identity.Models;
using System.Linq;

namespace BookStore.Api.Mappings
{
    public static class MappingExtensions
    {
        public static Book ToEntity(this CreateBookDto dto)
            => new()
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                ISBN = dto.ISBN,
                Pages = dto.Pages,
                Stock = dto.Stock,
                Price = dto.Price,
                AuthorId = dto.AuthorId,
                Author = null!,
                Categories = new List<BookCategory>()
            };

        public static Book ToEntity(this UpdateBookDto dto)
            => new()
            {
                Id = dto.Id,
                Title = dto.Title,
                ISBN = dto.ISBN,
                Pages = dto.Pages,
                Stock = dto.Stock,
                Price = dto.Price,
                AuthorId = dto.AuthorId,
                Author = null!,
                Categories = new List<BookCategory>()
            };

        public static void ApplyToEntity(this UpdateBookDto dto, Book entity)
        {
            entity.Title = dto.Title;
            entity.ISBN = dto.ISBN;
            entity.Pages = dto.Pages;
            entity.Stock = dto.Stock;
            entity.Price = dto.Price;
            entity.AuthorId = dto.AuthorId;
        }

        public static BookResponseDto ToDto(this Book book)
            => new(
                book.Id,
                book.Title,
                book.ISBN,
                book.Pages,
                book.Stock,
                book.Price,
                new AuthorResponseDto(
                    book.Author.Id,
                    book.Author.FirstName,
                    book.Author.LastName,
                    book.Author.Bio
                ),
                book.Categories
                     .Select(c => new CategoryResponseDto(c.Id, c.Name))
                     .ToArray()
            );

        public static Author ToEntity(this CreateAuthorDto dto)
            => new()
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Bio = dto.Bio
            };

        public static void ApplyToEntity(this UpdateAuthorDto dto, Author entity)
        {
            entity.FirstName = dto.FirstName;
            entity.LastName = dto.LastName;
            entity.Bio = dto.Bio;
        }

        public static AuthorResponseDto ToDto(this Author author)
            => new(
                author.Id,
                author.FirstName,
                author.LastName,
                author.Bio
            );

        public static BookCategory ToEntity(this CreateCategoryDto dto)
            => new()
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };

        public static void ApplyToEntity(this UpdateCategoryDto dto, BookCategory entity)
        {
            entity.Name = dto.Name;
        }

        public static CategoryResponseDto ToDto(this BookCategory category)
            => new(
                category.Id,
                category.Name
            );

        public static ApplicationUser ToEntity(this RegisterRequestDto dto)
            => new()
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName
            };

        public static ApplicationUser ToEntity(this CreateUserRequestDto dto)
        {
            return new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber
            };
        }

        public static void ApplyToEntity(this UpdateUserRequestDto dto, ApplicationUser user)
        {
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;
        }

        public static UserResponseDto ToResponseDto(this ApplicationUser u, String role)
            => new(
                u.Id,
                u.Email!,
                u.FirstName!,
                u.LastName!,
                u.PhoneNumber,
                role.ToLower()
             );

        public static Order ToEntity(this CreateOrderRequestDto dto)
        {
            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = dto.UserId!,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = OrderStatus.Pending
            };

            foreach (var item in dto.Items)
            {
                order.Items.Add(new OrderItem
                {
                    BookId = item.BookId,
                    Quantity = item.Quantity,
                    UnitPrice = 0m
                });
            }

            return order;
        }

        public static void ApplyToEntity(this UpdateOrderRequestDto dto, Order order)
        {
            order.Status = dto.Status;
            order.UpdatedAt = DateTime.UtcNow;
            if (dto.Items is not null)
            {
                order.Items.Clear();
                foreach (var i in dto.Items)
                {
                    order.Items.Add(new OrderItem
                    {
                        BookId = i.BookId,
                        Quantity = i.Quantity,
                        UnitPrice = 0m
                    });
                }
            }
        }

        public static OrderResponseDto ToResponseDto(this Order o)
        {
            var items = o.Items.Select(i =>
                new OrderItemResponseDto(
                    i.BookId,
                    i.Book.Title,
                    i.Quantity,
                    i.Book.Price))
                .ToList();

            return new OrderResponseDto(
                o.Id,
                o.User.ToResponseDto(""),
                o.CreatedAt,
                o.UpdatedAt,
                o.Status,
                items,
                items.Aggregate(decimal.Zero, (acc, x) => acc + (x.UnitPrice * x.Quantity)));
        }
    }
}