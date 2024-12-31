import { writable } from "svelte/store";

export const token  = writable(localStorage.getItem('token'))

export const isAuthenticated = writable(false);

export const loginToken = (newToken) =>{
    localStorage.setItem('token', newToken);
    token.set(newToken);
    isAuthenticated.set(true);
};