import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { CookieHelper } from './CookieHelper';
import { NavMenu } from './NavMenu';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cookieService = new CookieHelper();
        if (cookieService.canAuthByCookie()) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const cookie = new CookieHelper();
            if (!cookie.canAuthByCookie()) {
                const response = await api.Login(username, password);
                var now = new Date();
                var time = now.getTime();
                var expireTime = time + 1000 * 36000;
                now.setTime(expireTime);
                document.cookie = 'access_token=' + response.token + ';expires=' + now.toUTCString() + ';path=/';
                // Обработка успешного логина, например, перенаправление на другую страницу
                console.log('Login successful:', response);
                // Перенаправление на домашнюю страницу после успешной логинизации
                navigate('/');
            } else navigate('/');
        } catch (error) {
            // Обработка ошибки при логине
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="home-container">
            <div className="login-form">
                <h1 className="title">Авторизация</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Имя пользователя:</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;