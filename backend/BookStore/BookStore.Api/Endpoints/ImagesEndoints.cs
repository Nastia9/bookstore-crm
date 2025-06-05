
namespace BookStore.Api.Endpoints;

public static class ImagesEndpoints
{
    public static RouteGroupBuilder MapImagesEndpoints(this WebApplication app)
    {
        var grp = app.MapGroup("/images").WithTags("Images");

        grp.MapPost("/", async (HttpRequest request, IWebHostEnvironment env, CancellationToken ct) =>
        {
            var file = request.Form.Files.FirstOrDefault();
            if (file is null || file.Length == 0)
                return Results.BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine(env.WebRootPath ?? "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream, ct);

            var imageUrl = $"/uploads/{fileName}";
            return Results.Ok(new { imagePath = imageUrl });
        })
        .WithName("UploadBookImage")
        .RequireAuthorization("RequireEmployee")
        .Accepts<IFormFile>("multipart/form-data")
        .Produces(200);

        return grp;
    }
}