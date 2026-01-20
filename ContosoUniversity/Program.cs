using ContosoUniversity.Data;
using ContosoUniversity.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// MongoDB services
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddSingleton<ICounterService, CounterService>();

// CORS configuration for React development
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDevelopment", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173") // Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("ReactDevelopment");
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Database initialization
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<MongoDbContext>();
    var counterService = services.GetRequiredService<ICounterService>();
    await MongoDbInitializer.InitializeAsync(context, counterService);
}

app.Run();
