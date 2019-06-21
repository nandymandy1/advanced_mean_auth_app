import { Injectable } from "@angular/core";
import { NetworkService } from "./network.service";
import * as jwt_decode from "jwt-decode";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  /**
   * To Detect the change in Authenticated service varibale Which will be set Initially false
   * And once the use is logged in then it will change the its value to true and on the change
   * of this varibale we can trigger to any event  in that component while subscribing it.
   */
  private _authenticated = new BehaviorSubject<Boolean>(false);
  public authenticated = this._authenticated.asObservable();
  public user: any = {};

  constructor(private network: NetworkService) {
    this.loadingState();
  }

  async loginUser() {
    let res = await this.network.postUnAuthData("users/login", {
      username: "nandymandy",
      password: "nandymandy123"
    });
    if (res.success) {
      console.log(res);
      // Save the user token and user details in localstorage
      this.saveToken(res.token);
      this.saveUser(jwt_decode(res.token));
      this._authenticated.next(true);
      this.user = res.user;
    } else {
      // Send the error message to the user
    }
  }

  loadingState() {
    try {
      let decoded = jwt_decode(localStorage.getItem("token"));
      let currentTime = Date.now();
      if (decoded.exp > currentTime / 1000) {
        // Set the current user
        this.user = JSON.parse(localStorage.getItem("user"));
        this._authenticated.next(true);
        // Redirect to the Profile Page
      } else {
        // This means there is token available but not valid since it is expired
        this._authenticated.next(false);
      }
    } catch {
      // This means there is no token available redirect user to the login screen
      this._authenticated.next(false);
    }
  }

  saveToken(token) {
    localStorage.setItem("token", token);
  }

  saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  logoutUser() {
    this.user = {};
    localStorage.removeItem("token");
  }
}
