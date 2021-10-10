import axios from 'axios';

export function getHost() {
    return `${window.location.protocol}//${window.location.hostname}`;
}

const API = axios.create({
    withCredentials: true,
});

export default API;
