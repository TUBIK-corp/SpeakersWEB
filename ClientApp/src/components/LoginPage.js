import React, { Component, useEffect, useState } from 'react';
import api from './api'
import { useNavigate } from 'react-router-dom';
import { CookieHelper } from './CookieHelper';

function Form() {
    const navigate = useNavigate();
    const [login, setLogin] = useState(null);
    const [password, setPassword] = useState(null);


    function updateLogin(e) {
        setLogin(e.target.value);
    }

    function updatePassword(e) {
        setPassword(e.target.value);
    }

    function getLogin() {
        return login;
    }
    function getPassword() {
        return password;
    }

    async function handleClick() {
        var response = await api.logInAsync(getLogin(), getPassword());
        navigator()
    }

    function navigator() {
        navigate('/')
    }

    return <div>
        <h2>Login</h2>
        <form onSubmit={handleClick}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    onChange={updateLogin}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    onChange={updatePassword}
                    required
                />
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
}

export class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Redirect: false
        };
        this.api = new api(); // Замените на ваш базовый URL
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    //handleFormSubmit = async (event) => {
    //    event.preventDefault();
    //    const { username, password } = this.state;

    //    try {
    //        let response = await this.api.Login(username, password);
    //        document.cookie = 'token=' + response.Token + ';path=/'
    //        history.push('/')
    //        // Обработка успешного входа
    //    } catch { }
    //};

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    componentDidMount() {
        const cookieService = new CookieHelper();
        if (cookieService.canAuthByCookie()) {
            this.setRedirect();
        }
    }
    render() {
        if (this.state.redirect === true) return navigator()
        return (
            <div>
                <Form></Form>
            </div>
        );
    }
}
