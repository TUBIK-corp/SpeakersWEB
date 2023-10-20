using SpeakersWEB.Models;

namespace SpeakersWEB.Services
{
    public class AuthorizationService
    {
        private readonly BellsContext _context;

        public AuthorizationService(BellsContext context)
        {
            _context = context;
        }

        public async Task<UserToken> GenerateTokenAsync(User user, int tokenLifeTime)
        {
            var token = new UserToken
            {
                Token = Guid.NewGuid().ToString()
            };

            await _context.UserTokens.AddAsync(token);

            token.UserId = user.Id;

            await _context.SaveChangesAsync();

            return token;
        }
    }
}
