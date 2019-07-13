import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  userImage: any = null;
  imageURL: string = "";
  firstname: string = "";
  lastname: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  err: any = {};

  constructor(private auth: AuthService) {}
  ngOnInit() {}

  register = () => {
    // this.err = {};
    // if (this.credentialsNotEmpty()) {
    //   let data = {
    //     username: this.username,
    //     password: this.password,
    //     firstname: this.firstname,
    //     lastname: this.lastname,
    //     email: this.email
    //   };
    // }
  };

  credentialsNotEmpty = () => {
    // this.firstname == ""
    //   ? (this.err["firstname"] = "First Name cannot be empty.")
    //   : delete this.err["firstname"];
    // this.lastname == ""
    //   ? (this.err["lastname"] = "Last Name cannot be empty.")
    //   : delete this.err["lastname"];
    // this.email == "" ? (this.err["email"] = "Email cannot be empty.") : null;
    // this.password == ""
    //   ? (this.err["password"] = "Password cannot be empty.")
    //   : delete this.err["password"];
    // this.username == ""
    //   ? (this.err["username"] = "Username cannot be empty.")
    //   : delete this.err["username"];
    // return this.err == {} ? true : false;
  };

  onImageSelected = e => {
    this.userImage = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (event: any) => {
      this.imageURL = event.target.result;
    };
  };

  validatePassword = e => {
    let password = e.target.value;
    let pwdRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    !pwdRegEx.test(String(password).toLowerCase())
      ? (this.err["password"] =
          "Password must contain atleast one capital letter, atleast one special character and atleast one number.")
      : delete this.err["password"];
  };

  validateConfirmPassword = e => {
    let confirmPassword = e.target.value;
    this.password !== confirmPassword
      ? (this.err["confirmPassword"] = "Password do not match.")
      : delete this.err["confirmPassword"];
  };

  validateUsername = async e => {
    let username = e.target.value;
    if (username.length > 4) {
      let response = await this.auth.usernameValidation(username);
      response.subscribe((res: any) => {
        !res.success
          ? (this.err["username"] = res.message)
          : delete this.err["username"];
      });
    }
  };

  validateEmail = async e => {
    let email = e.target.value;
    if (this.validEmailExp(email)) {
      let response = await this.auth.emailValidation(email);
      response.subscribe((res: any) => {
        !res.success
          ? (this.err["email"] = res.message)
          : delete this.err["email"];
      });
    }
  };

  validEmailExp = email => {
    let regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let match = regx.test(String(email).toLowerCase());
    match
      ? delete this.err["email"]
      : (this.err["email"] = "Please enter a valid email.");
    return match;
  };
}
