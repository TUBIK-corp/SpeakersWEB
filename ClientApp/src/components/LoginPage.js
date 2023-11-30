import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; // ����������� ��� ����� api
import { CookieHelper } from './CookieHelper';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
                document.cookie = 'access_token='+response.token+';expires=' + now.toUTCString() + ';path=/';
                // ��������� ��������� ������, ��������, ��������������� �� ������ ��������
                console.log('Login successful:', response);
                // ��������������� �� �������� �������� ����� �������� �����������
                navigate('/');
            } else navigate('/');
        } catch (error) {
            // ��������� ������ ��� ������
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;