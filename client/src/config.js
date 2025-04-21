const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://doanwebck-production.up.railway.app'
    : 'http://localhost:5000';

export default API_URL;