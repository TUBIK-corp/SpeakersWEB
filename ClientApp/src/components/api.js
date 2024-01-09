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
            localStorage.setItem('username', username);
            //alert('Login successful: ' + JSON.stringify(response))
            return response
        } catch (error) {
            alert('Login failed: ' + error.message) // Перехватывать ошибки и обрабатывать их где-то в другом месте
        }
    }
    async getBells() {
        try {
            const response = await this.fetchData('/api/bells'); // Предполагая, что есть соответствующий API-эндпоинт
            return response;
        } catch (error) {
            console.error('Failed to get bell data:', error);
            throw error;
        }
    }
    async createBell(bellData, audioFile) {
        try {
            bellData.audioFilePath = 'api/audio/' + await api.saveAudio(audioFile);
            const response = await this.fetchData('/api/bells', 'POST', bellData);
            return response;
        } catch (error) {
            throw new Error('Failed to create bell: ' + error.message);
        }
    }
    async saveAudio(audioFile) {
        try {
            const formData = new FormData();
            formData.append("audio", audioFile);

            const response = await fetch('/api/audio/save', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            return result;
        } catch (error) {
            throw new Error('Failed to save audio: ' + error.message);
        }
    }
}

const api = new Api();
export default api;