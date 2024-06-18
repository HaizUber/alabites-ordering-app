import axios from 'axios';

const api = axios.create({
    baseURL: 'https://alabites-api.vercel.app',  // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
