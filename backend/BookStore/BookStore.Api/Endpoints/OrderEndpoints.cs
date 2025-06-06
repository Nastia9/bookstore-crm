using BookStore.Api.DTOs.Requests;
using BookStore.Api.DTOs.Responses;
using BookStore.Api.Mappings;
using BookStore.Domain.Enums;
using BookStore.Identity.Models;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookStore.Api.Endpoints;

public static class OrderEndpoints
{
    public static RouteGroupBuilder MapOrderEndpoints(this WebApplication app)
    {
        var grp = app.MapGroup("/orders").WithTags("Orders");

        grp.MapGet("/", GetAllOrders)
           .RequireAuthorization()  // any authenticated user
           .Produces<OrderResponseDto[]>(200);

        grp.MapGet("/my", GetAllOrdersMy)
           .RequireAuthorization()  // any authenticated user
           .Produces<OrderResponseDto[]>(200);

        grp.MapGet("/{id:guid}", GetOrderById)
           .RequireAuthorization()
           .Produces<OrderResponseDto>(200)
           .Produces(404);

        grp.MapPost("/", CreateOrder)
           .RequireAuthorization() // we'll check roles/ownership in handler
           .Accepts<CreateOrderRequestDto>("application/json")
           .Produces<OrderResponseDto>(201)
           .Produces(400);

        grp.MapPut("/{id:guid}", UpdateOrder)
           .RequireAuthorization()
           .Accepts<UpdateOrderRequestDto>("application/json")
           .Produces(204)
           .Produces(400)
           .Produces(403)
           .Produces(404);

        grp.MapDelete("/{id:guid}", DeleteOrder)
           .RequireAuthorization("RequireEmployee")
           .Produces(204)
           .Produces(404);

        return grp;
    }

    private static async Task<IResult> GetAllOrders(
        HttpContext http,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var userId = http.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isEmpOrAdmin = http.User.IsInRole(Roles.Employee) || http.User.IsInRole(Roles.Admin);

        var query = db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                    .ThenInclude(b => b.Author)
            .AsQueryable();

        if (!isEmpOrAdmin)
        {
            // customers only see their own
            query = query.Where(o => o.UserId == userId);
        }

        var list = await query
            .Select(o => o.ToResponseDto())
            .ToListAsync(ct);

        return Results.Ok(list);
    }

    private static async Task<IResult> GetAllOrdersMy(
        HttpContext http,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var callerId = http.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var query = db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                    .ThenInclude(b => b.Author)
            .Where(o => o.UserId == callerId)
            .AsQueryable();

        var list = await query
            .Select(o => o.ToResponseDto())
            .ToListAsync(ct);

        return Results.Ok(list);
    }

    private static async Task<IResult> GetOrderById(
        Guid id,
        HttpContext http,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var userId = http.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isEmpOrAdmin = http.User.IsInRole(Roles.Employee) || http.User.IsInRole(Roles.Admin);

        var order = await db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                    .ThenInclude(b => b.Author)
            .Where(o => o.Id == id)
            .SingleOrDefaultAsync(ct);

        if (order is null)
            return Results.NotFound();

        if (!isEmpOrAdmin && order.UserId != userId)
            return Results.Forbid();

        return Results.Ok(order.ToResponseDto());
    }

    private static async Task<IResult> CreateOrder(
        CreateOrderRequestDto dto,
        HttpContext http,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var userId = http.User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // only allow Employee to create for someone else
        if (!http.User.IsInRole(Roles.Employee))
        {
            if (dto.UserId != null && dto.UserId != userId)
                return Results.Forbid();

            if (dto.UserId != null && userId != null) {
                dto = dto with { UserId = userId };
            }
        }

        var order = dto.ToEntity();
        db.Orders.Add(order);

        foreach (var item in order.Items)
        {
            var book = await db.Books.FindAsync([item.BookId], ct);
            if (book == null)
                return Results.BadRequest($"Book with id {item.BookId} not found.");

            if (book.Stock < item.Quantity)
                return Results.BadRequest($"Not enough stock for book '{book.Title}'. Available: {book.Stock}, requested: {item.Quantity}");

            book.Stock -= item.Quantity;
        }

        await db.SaveChangesAsync(ct);

        await db.Entry(order)
            .Reference(o => o.User)
            .LoadAsync(ct);

        await db.Entry(order).Collection(o => o.Items).Query()
            .Include(i => i.Book).ThenInclude(b => b.Author)
            .LoadAsync(ct);

        return Results.Created($"/orders/{order.Id}", order.ToResponseDto());
    }

    private static async Task<IResult> UpdateOrder(
        Guid id,
        UpdateOrderRequestDto dto,
        HttpContext http,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        if (id != dto.Id)
            return Results.BadRequest();

        var order = await db.Orders
            .Include(o => o.Items)
            .SingleOrDefaultAsync(o => o.Id == id, ct);

        if (order is null)
            return Results.NotFound();

        var userId = http.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isEmpOrAdmin = http.User.IsInRole(Roles.Employee) || http.User.IsInRole(Roles.Admin);

        if (!isEmpOrAdmin)
        {
            // customer can only cancel own and only when status == Pending
            if (order.UserId != userId)
                return Results.Forbid();

            if (dto.Status != OrderStatus.Cancelled || order.Status != OrderStatus.Pending)
                return Results.BadRequest("Customers may only cancel pending orders.");

            order.Status = OrderStatus.Cancelled;

            foreach (var item in order.Items)
            {
                var book = await db.Books.FindAsync([item.BookId], ct);
                if (book != null)
                {
                    book.Stock += item.Quantity;
                }
            }
        }
        else
        {
            var previousStatus = order.Status;
            dto.ApplyToEntity(order);
            if (previousStatus == OrderStatus.Pending && order.Status == OrderStatus.Cancelled)
            {
                foreach (var item in order.Items)
                {
                    var book = await db.Books.FindAsync([item.BookId], ct);
                    if (book != null)
                    {       
                        book.Stock += item.Quantity;
                    }
                }
            }
        }

        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }

    private static async Task<IResult> DeleteOrder(
        Guid id,
        BookStoreDbContext db,
        CancellationToken ct)
    {
        var order = await db.Orders.FindAsync(new object[] { id }, ct);
        if (order is null)
            return Results.NotFound();

        db.Orders.Remove(order);
        await db.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}
