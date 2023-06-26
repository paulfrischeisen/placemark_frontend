import { writable } from "svelte/store";

export const user = writable({
    email: "",
    token: ""
});

export const latestPlacemark = writable(null);
export const imageSuccessfullyUploaded = writable(null);
export const loggedIn = writable(null);
export const currentUsername = writable(null);
export const isAdmin = writable(null);