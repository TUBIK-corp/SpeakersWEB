using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;

namespace SpeakersWEB.Controllers
{
    [ApiController]
    [Route("api/recognize")]
    public class RecognizeController : ControllerBase
    {

        [HttpPost]
        [Route("Retrain")]
        public IActionResult TrainAgain()
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Recognizer/train.py");

                Process process = new Process();
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.FileName = filePath;
                startInfo.RedirectStandardOutput = true;
                startInfo.UseShellExecute = false;
                process.StartInfo = startInfo;
                process.Start();

                string output = process.StandardOutput.ReadToEnd();
                Console.WriteLine(output);
                process.WaitForExit();
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok("Done");
        }


        [HttpPost]
        [Route("Recognize")]
        public IActionResult Recognize(string base64)
        {
            try
            {
                var network = Program.client.GetStream();
                using (StreamWriter writer = new StreamWriter(network))
                {
                    writer.WriteLine(base64);
                }
                using (StreamReader reader = new StreamReader(network))
                {
                    string message = reader.ReadLine();
                    return Ok(message);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
