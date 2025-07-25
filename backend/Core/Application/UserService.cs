using Microsoft.EntityFrameworkCore;
using ATM.Infrastructure.Data;
using ATM.Core.Domain;

namespace ATM.Core.Application;

public class UserService
{
    private readonly AtmDbContext _context;

    public UserService(AtmDbContext context)
    {
        _context = context;
    }

    public async Task<User?> ValidateUserAsync(string username, string pin)
    {
        return await _context.Users.FirstOrDefaultAsync(u => 
            u.Username == username && 
            u.Pin == pin);
    }
} 