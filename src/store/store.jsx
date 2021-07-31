import { makeAutoObservable } from "mobx";
import AuthService from "../service/AuthService";
import CoordinationsService from "../service/CoordinationsSetvice";
import axios from "axios";
import { API_URL } from "../http";

export default class Store {
  coordinates = {};

  constructor() {
    makeAutoObservable(this);
  }

  async login(email, password) {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("user", response.data.user.id);
      localStorage.setItem("isActivated", response.data.user.isActivated)
      localStorage.setItem("token", response.data.accessToken);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async registration(email, password) {
    try {
      const response = await AuthService.registration(email, password);
      localStorage.setItem("user", response.data.user.id);
      localStorage.setItem("isActivated", response.data.user.isActivated)
      localStorage.setItem("token", response.data.accessToken);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.accessToken);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async getAllCoordinates(userId) {
    try {
      const response = await CoordinationsService.getAllCoordinates(userId);
      this.coordinates = response.data.data;
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async createNewCoordinates(name, longitude, latitude, userId, metka) {
    try {
      await CoordinationsService.createNewCoordinates(name, longitude, latitude, userId, metka);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async editCoordinate(editParams, userId) {
    try {
      const response = await CoordinationsService.editCoordinate(editParams, userId);
      this.coordinates = response.data.data;
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async deleteCoordinates(id) {
    try {
      const response = await CoordinationsService.deleteCoordinates(id);
      this.coordinates = response.data.data;
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }
}
