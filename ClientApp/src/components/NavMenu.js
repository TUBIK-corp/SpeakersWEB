import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { CookieHelper } from './CookieHelper';

export class NavMenu extends Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    handleLogout = () => {
        // Удаляем имя пользователя из localStorage при разлогинивании
        localStorage.removeItem('username');

        const cookieHelper = new CookieHelper();
        cookieHelper.deleteAllCookies();

        // Дополнительные шаги по разлогиниванию, например, перенаправление на страницу логина
        // ...
        this.setState({ key: Date.now() });
        console.log('User logged out');
    }

    render() {
        // Получим имя пользователя из localStorage
        const username = localStorage.getItem('username');

        return (
            <header key={this.state.key}>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                    <NavbarBrand tag={Link} to="/">SpeakersWEB</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="nav-logout" to="/login" onClick={this.handleLogout}>Выйти</NavLink>
                            </NavItem>
                        </ul>
                        {/* Отображаем имя пользователя в NavMenu */}
                        {username && <span className="nav-username">{username}</span>}
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
