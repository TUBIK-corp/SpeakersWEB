import api from './api'
export class CookieHelper {
    getCookie(cookieName) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + cookieName.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
        ))
        return matches ? decodeURIComponent(matches[1]) : undefined
    }

    canAuthByCookie() {
        let cookie = this.getCookie('Token')

        return !(cookie === undefined || cookie === null || cookie === '')
    }

    async checkIfCookieCanUseForAuth() {
        const api = new api()

        return await api.isTokenActive(this.getCookie("Token"))
    }

    deleteAllCookies() {
        const cookies = document.cookie.split(";")

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
            document.cookie = name + "=;Max-Age=0; path = /; domain=" + window.location.hostname
        }
    }
}