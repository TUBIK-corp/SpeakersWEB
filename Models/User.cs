﻿using System.ComponentModel.DataAnnotations;

namespace SpeakersWEB.Models;

public partial class User
{
    public int Id { get; set; }

    public string Login { get; set; }

    public string Password { get; set; }

    public string Email { get; set; }
}
