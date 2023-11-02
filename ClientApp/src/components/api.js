class Api {

    async fetchData(endpoint, method = "GET", data = null) {
        const requestOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (data) {
            requestOptions.body = JSON.stringify(data);
        }

        const response = await fetch(endpoint, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
    async Login(username, password) {
        const loginData = {
            Username: username,
            PasswordHash: password
        };

        try {
            let response = await this.fetchData('/api/auth/login', 'POST', loginData);
            alert('Login successful: ' + JSON.stringify(response))
            return response
        } catch (error) {
            alert('Login failed: ' + error.message) // Перехватывать ошибки и обрабатывать их где-то в другом месте
        }
    }

}

const api = new Api();
export default api;