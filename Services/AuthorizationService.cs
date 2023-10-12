namespace SpeakersWEB.Services
{
    public class AuthorizationService
    {
        private readonly SpeakersWEBdbContext _context;

        public AuthorizationService(SpeakersWEBdbContext context)
        {
            _context = context;
        }

        public async Task<UserAuthToken> GenerateTokenAsync(User user, int tokenLifeTime)
        {
            var token = new UserAuthToken
            {
                Token = Guid.NewGuid().ToString(),
                ExpiresAt = DateTime.Now + TimeSpan.FromSeconds(tokenLifeTime)
            };

            await _context.UserAuthTokens.AddAsync(token);

            token.User = user;

            await _context.SaveChangesAsync();

            return token;
        }
    }
}
