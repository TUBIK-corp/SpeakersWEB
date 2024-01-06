using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpeakersWEB.Models;

namespace SpeakersWEB.Controllers
{
    [ApiController]
    [Route("api/bells")]
    public class BellsController : ControllerBase
    {
        private readonly BellsContext _context;

        public BellsController(BellsContext context)
        {
            _context = context;
        }

        // GET: api/bells
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bell>>> GetBells()
        {
            var serverTime = DateTime.Now; // Время сервера

            var bells = await _context.Bells
                .OrderBy(b => b.Time)
                .ToListAsync();

            foreach (var bell in bells)
            {
                bell.IsUpcoming = bell.Time > serverTime;
            }

            await _context.SaveChangesAsync();

            return bells;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBell([FromBody] Bell bell)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Bells.Add(bell);
                    await _context.SaveChangesAsync();
                    return Ok(bell);
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating bell: {ex}");
                return StatusCode(500, $"Internal Server Error: {ex}");
            }
        }
    }
}
