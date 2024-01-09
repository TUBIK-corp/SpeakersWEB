using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpeakersWEB.Models;
using SpeakersWEB.Services;

namespace SpeakersWEB.Controllers
{
    [ApiController]
    [Route("/api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly BellsContext _context;
        private AuthorizationService _service;

        public AuthController(BellsContext context)
        {
            _context = context;
            _service = new AuthorizationService(context);
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginType login)
        {
            var firstAssociatedUser = await _context.Users.FirstOrDefaultAsync(x => x.Login == login.Username);

            if (firstAssociatedUser == null)
            {
                return Unauthorized();
            }

            if (!firstAssociatedUser.Password.Equals(login.PasswordHash))
            {
                return Unauthorized();
            }

            var token = await _service.GenerateTokenAsync(firstAssociatedUser);

            return Ok(new { token });
        }

        public class LoginType
        {
            public string Username { get; set; }
            public string PasswordHash { get; set; }
        }
    }
}
