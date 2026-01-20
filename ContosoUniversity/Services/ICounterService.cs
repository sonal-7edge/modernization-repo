namespace ContosoUniversity.Services;

public interface ICounterService
{
    Task<int> GetNextSequenceValueAsync(string sequenceName);
}