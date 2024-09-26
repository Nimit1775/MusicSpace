import axios  from "axios";

const API_URL = 'https://musicspace-duog.onrender.com/api' ; 

export const api = axios.create({
    baseURL: API_URL  
}) ;