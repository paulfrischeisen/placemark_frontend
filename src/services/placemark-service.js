// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import axios from "axios";
import { user, latestPlacemark } from "../stores.js";
import {goto} from "$app/navigation";

export const placemarkService = {
    //baseUrl: "http://localhost:4000",
    baseUrl: "https://placemark-backend-8u8c.onrender.com",

    async login(email, password) {
        try {
            const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
            axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
            if (response.data.success) {
                console.log(`auth. for login complete. User, localStorage stores now user: ${email} and the token ${response.data.token}`);
                user.set({
                    email: email,
                    token: response.data.token
                });
                localStorage.user = JSON.stringify({ email: email, token: response.data.token });
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    async logout() {
        user.set({
            email: "",
            token: ""
        });
        axios.defaults.headers.common["Authorization"] = "";
        localStorage.removeItem("user");
    },

    async signup(firstName, lastName, email, password) {
        try {
            const userDetails = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            };
            await axios.post(this.baseUrl + "/api/users", userDetails);
            return true;
        } catch (error) {
            return false;
        }
    },

    reload() {
        const userCredentials = localStorage.user;
        if (userCredentials) {
            const savedUser = JSON.parse(userCredentials);
            user.set({
                email: savedUser.email,
                token: savedUser.token
            });
            axios.defaults.headers.common["Authorization"] = "Bearer " + savedUser.token;
        }
    },

    async getUser(user){
        try{
            const response = await axios.get(this.baseUrl + "/api/users/" + user);
            return response.data;
        } catch(error){
            return [];
        }
    },

    async getAllUsers(){
        try {
            const response = await axios.get(this.baseUrl + "/api/users");
            return response.data;
        } catch (error){
            return [];
        }
    },

    async getPlacemark(placemarkID){
        try {
            const response = await axios.get(this.baseUrl + "/api/placemarks/" + placemarkID);
            return response.data;
        } catch (error) {
            return [];
        }
    },

    async getPlacemarks(){
        try {
            const response = await axios.get(this.baseUrl + "/api/placemarks");
            return response.data;
        } catch (error) {
            return [];
        }
    },

    async addPlacemark(placemark){
        console.log("test123");
        console.log(placemark.data);
        try {
            const response = await axios.post(this.baseUrl + "/api/placemarks", placemark);
            if (response.data) {
                latestPlacemark.set(response.data);
                console.log("drinnen");
                console.log(response.data);
            }
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    async updatePlacemark(id, placemark){
        try {
            const response = await axios.put(this.baseUrl + "/api/placemarks/" + id, placemark);
            if (response.data) {
                latestPlacemark.set(response.data);
            }
            return response.data;
        } catch (error) {
            return [];
        }
    },

    async getPlacemarkByCategory(placemarkCategory) {
        try {
            const response = await axios.get(this.baseUrl + "/api/placemarks/getByCategory/" + placemarkCategory);
            return response.data;
        } catch (error) {
            return [];
        }
    },

    async addImage(id, dataForm) {
        try {
            let response = await axios.post(this.baseUrl + "/api/placemarks/addImage/" + id, dataForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch(error) {
            return [];
        }
    },

    async deleteImage(id, imageURL) {
        try {
            let response = await axios.delete(this.baseUrl + "/api/placemarks/deleteImage/" + id, {
                data: {
                    imageURL: imageURL
                }
            });
            return response.data;
        } catch(error) {
            return [];
        }
    }
};
