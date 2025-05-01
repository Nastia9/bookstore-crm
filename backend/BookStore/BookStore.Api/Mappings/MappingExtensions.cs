using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Domain.Entities;

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
                    book.Author.Name,
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
                Name = dto.Name,
                Bio = dto.Bio
            };

        public static Author ToEntity(this UpdateAuthorDto dto)
            => new()
            {
                Id = dto.Id,
                Name = dto.Name,
                Bio = dto.Bio
            };

        public static AuthorResponseDto ToDto(this Author author)
            => new(
                author.Id,
                author.Name,
                author.Bio
            );

        public static BookCategory ToEntity(this CreateCategoryDto dto)
            => new()
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };

        public static BookCategory ToEntity(this UpdateCategoryDto dto)
            => new()
            {
                Id = dto.Id,
                Name = dto.Name
            };

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
    }
}
