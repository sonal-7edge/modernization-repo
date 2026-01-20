namespace ContosoUniversity;

public static class Utility
{
    public static string GetLastChars(byte[] token)
    {
        if (token == null || token.Length == 0)
            return "N/A";
        
        return token[Math.Min(7, token.Length - 1)].ToString();
    }
}
