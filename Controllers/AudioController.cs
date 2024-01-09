using Azure.Core;
using Microsoft.AspNetCore.Mvc;

namespace SpeakersWEB.Controllers
{
    [ApiController]
    [Route("api/audio")]
    public class AudioController : ControllerBase
    {
        [HttpPost]
        [Route("save")]
        public async Task<IActionResult> SaveAudio()
        {
            try
            {
                var files = Request.Form.Files;
                if (files != null && files.Count > 0)
                {
                    var file = files[0];
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "audio", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    return Ok(fileName);
                }

                return BadRequest("No audio file received");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("{filename}")]
        public IActionResult GetAudio(string filename)
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "audio", filename);

                if (System.IO.File.Exists(filePath))
                {
                    // Отправляем аудиофайл как ответ
                    var fileStream = System.IO.File.OpenRead(filePath);
                    return File(fileStream, "audio/mp3");
                }
                else
                {
                    return NotFound("Audio file not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
