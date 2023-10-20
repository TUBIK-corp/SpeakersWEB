using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpeakersWEB.Models;
using SpeakersWEB.Types;

namespace SpeakersWEB.Controllers
{
    [ApiController]
    [Route("/api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly BellsContext _context;

        public AuthController(BellsContext context)
        {
            _context = context;
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

            return Ok();

        }
        public class FuckOff
        {
            public string Who { get; set; }
        }
    }
}
