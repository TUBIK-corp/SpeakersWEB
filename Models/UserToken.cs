using System;
using System.Collections.Generic;

namespace SpeakersWEB.Models;

public partial class UserToken
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Token { get; set; } = null!;
}
