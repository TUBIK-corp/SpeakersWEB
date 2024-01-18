using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpeakersWEB.Models;

public partial class Bell
{
    public int Id { get; set; }
    public string Info { get; set; }
    public DateTime Time { get; set; }
    public string AudioFilePath { get; set; }
    public TimeSpan Duration { get; set; }
    public string UploaderName { get; set; }
    public bool IsUpcoming { get; set; }
}
