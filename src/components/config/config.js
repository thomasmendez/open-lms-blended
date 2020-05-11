
import config from 'config'

export const apiURL = `${config.apiUrl}`

export const corsOptionsGET = {
    method: 'GET', 
    mode: 'cors',
    credentials: 'include',
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `${config.apiUrl}`,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Credentials": true
    }
}

export const corsOptionsPOST = {
    method: 'POST', 
    mode: 'cors',
    credentials: 'include',
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `${config.apiUrl}`,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Credentials": true
    }
}