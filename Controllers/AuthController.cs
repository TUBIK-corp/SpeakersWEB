using Microsoft.AspNetCore.Mvc;

namespace SpeakersWEB.Controllers
{
    [ApiController]
    [Route("/api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpGet]
        [Route("login")]
        public async Task<IActionResult> Login()
        {
            return Ok(new FuckOff() { Who="ur mom"});
        }
        public class FuckOff
        {
            public string Who { get; set; }
        }
    }
}
