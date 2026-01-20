using MongoDB.Bson;
using MongoDB.Driver;

namespace ContosoUniversity.Services;

public class CounterService : ICounterService
{
    private readonly IMongoCollection<BsonDocument> _counters;

    public CounterService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB") ?? "mongodb://localhost:27017";
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "ContosoUniversity";
        
        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);
        _counters = database.GetCollection<BsonDocument>("counters");
    }

    public async Task<int> GetNextSequenceValueAsync(string sequenceName)
    {
        var filter = Builders<BsonDocument>.Filter.Eq("_id", sequenceName);
        var update = Builders<BsonDocument>.Update.Inc("sequence_value", 1);
        var options = new FindOneAndUpdateOptions<BsonDocument>
        {
            IsUpsert = true,
            ReturnDocument = ReturnDocument.After
        };

        var result = await _counters.FindOneAndUpdateAsync(filter, update, options);
        return result["sequence_value"].AsInt32;
    }
}