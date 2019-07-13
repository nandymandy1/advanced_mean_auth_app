import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ApiCallsService {
  baseURL: string = "http://localhost:5000/api/";
  constructor(private http: HttpClient) {}

  postUnAuthData = async (url, data) => {
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(`${this.baseURL}${url}`, data, { headers });
  };

  getUnAuthData = async (url, params?: Object) => {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {};
    httpOptions["headers"] = headers;
    if (params) {
      let sParams: HttpParams = new HttpParams();
      for (let key in params) {
        sParams = sParams.append(key, params[key]);
      }
      httpOptions["params"] = sParams;
    }
    return await this.http.get(`${this.baseURL}${url}`, httpOptions);
  };

  postAuthData = async (url, data, params?: Object) => {
    let token = this.getToken();
    let body = JSON.stringify(data);

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token
    });
    let options;
    if (params) {
      let sParams: HttpParams = new HttpParams();
      for (var key in params) {
        sParams = sParams.append(key, params[key]);
      }
      options = {
        headers: headers,
        params: sParams
      };
    } else {
      options = { headers: headers };
    }
    return this.http.post(`${this.baseURL}${url}`, body, options);
  };

  getAuthData = async (url, params?: Object) => {
    let httpOptions = {};
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: this.getToken()
    });
    httpOptions["headers"] = headers;
    if (params) {
      let sParams: HttpParams = new HttpParams();
      for (let key in params) {
        sParams = sParams.append(key, params[key]);
      }
      httpOptions["params"] = sParams;
    }
    return this.http.get(`${this.baseURL}${url}`, httpOptions);
  };

  getToken = () => {
    return JSON.parse(localStorage.getItem("token"));
  };
}
