﻿namespace SpeakersWEB.Types
{
    public class LoginType
    {
        public string Username { get; set; }

        /// <summary>
        /// Md5-хэш пароля
        /// </summary>
        public string PasswordHash { get; set; }
    }
}
