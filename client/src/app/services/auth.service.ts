import { Injectable } from "@angular/core";
import { ApiCallsService } from "./api-calls.service";
import "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private api: ApiCallsService) {}

  usernameValidation = async username => {
    let params = { username: username };
    return await this.api.getUnAuthData(`users/validate-username`, params);
  };

  emailValidation = async email => {
    let params = { email: email };
    return await this.api.getUnAuthData(`users/validate-email`, params);
  };
}
