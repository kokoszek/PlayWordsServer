import axios from 'axios';

const client = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://travelgeek:443' : 'http://localhost:5000',
    withCredentials: true
})

export default client;