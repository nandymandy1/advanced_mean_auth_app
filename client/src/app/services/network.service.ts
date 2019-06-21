import { Injectable } from "@angular/core";
// import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class NetworkService {
  baseURL: string = "http://localhost:5000/api/";
  constructor() {}

  /**
   * @DESC Dedicated Method to make UnAuthenticated POST Request
   * @Access Public
   */
  async postUnAuthData(endpt, data) {
    let res: any = {};
    try {
      res = await fetch(this.baseURL + endpt, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json());
      return res;
    } catch {
      return res;
    }
  }

  /**
   * @DESC Dedicated Method to make Authenticated POST Request
   * @Access Private
   */
  async postAuthData(endpt, data) {
    let res: any = {};
    try {
      res = await fetch(this.baseURL + endpt, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthToken()
        },
        body: JSON.stringify(data)
      }).then(res => res.json());
      return res;
    } catch {
      return res;
    }
  }

  /**
   * @DESC Dedicated Method to make UnAuthenticated GET Request
   * @Access Public
   */
  async getUnAuthData(endpt) {
    let res: any = {};
    try {
      res = await fetch(this.baseURL + endpt).then(res => res.json());
      return res;
    } catch {
      return res;
    }
  }

  /**
   * @DESC Dedicated Method to make Authenticated POST Request
   * @Access Private
   */
  async getAuthData(endpt) {
    let res: any = {};
    try {
      res = await fetch(this.baseURL + endpt, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthToken()
        }
      }).then(res => res.json());
      return res;
    } catch {
      return res;
    }
  }

  getAuthToken() {
    return localStorage.getItem("token");
  }
}
