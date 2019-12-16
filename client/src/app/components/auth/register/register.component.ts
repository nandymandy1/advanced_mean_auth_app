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

  err: any = {
    topWarning: "",
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: ""
  };

  constructor(private auth: AuthService) {}
  ngOnInit() {}

  register = () => {
    if (this.credentialsNotEmpty()) {
      let data = {
        username: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email
      };
      console.log(data);
    } else {
      this.err.topWarning = "Please fill in all the credentials.";
    }
  };

  credentialsNotEmpty = () => {
    if (
      this.username == "" ||
      this.password == "" ||
      this.confirmPassword ||
      this.email == "" ||
      this.username == "" ||
      this.firstname == "" ||
      this.lastname == ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  onImageSelected = (e: any) => {
    this.userImage = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (event: any) => {
      this.imageURL = event.target.result;
    };
  };

  // validateFirstName = (e: any) => {
  //   let firstname: string = e.target.value;
  //   if (firstname.length == 0) {
  //     this.err.firstname = "First Name is required.";
  //   } else {
  //     this.err.firstname = "";
  //   }
  // };

  // validateLastName = (e: any) => {
  //   if (this.lastname.length == 0) {
  //     this.err.lastname = "Last Name is required.";
  //   } else {
  //     this.err.lastname = "";
  //   }
  // };

  // validatePassword = (e: any) => {
  //   if (this.password.length == 0) {
  //     this.err.password = "Password field is required.";
  //   } else if (this.password.length > 0) {
  //     let pwdRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  //     if (!pwdRegEx.test(String(this.password).toLowerCase())) {
  //       this.err.password =
  //         "Password must contain atleast one capital letter, atleast one special character and atleast one number.";
  //     } else {
  //       this.err.password = "";
  //     }
  //   } else {
  //     this.err.password = "Password field is required.";
  //   }
  // };

  // validateConfirmPassword = e => {
  //   let confirmPassword = e.target.value;
  //   if (confirmPassword.length != 0) {
  //     if (this.password !== confirmPassword) {
  //       this.err.confirmPassword = "Passwords do not match.";
  //     } else {
  //       this.err.confirmPassword = "";
  //     }
  //   } else {
  //     this.err.confirmPassword = "Confirm Password is required.";
  //   }
  // };

  // validateUsername = async (e: any) => {
  //   let username: string = e.target.value;
  //   if (username.length == 0) {
  //     this.err.username = "Username field is required.";
  //   } else if (username.length >= 6) {
  //     let response = await this.auth.usernameValidation(username);
  //     response.subscribe((res: any) => {
  //       if (!res.success) {
  //         this.err.username = res.message;
  //       } else {
  //         this.err.username = "";
  //       }
  //     });
  //   } else {
  //     this.err.username = "Username Should be of atleast 6 characters";
  //   }
  // };

  // validateEmail = async (e: any) => {
  //   let email: string = e.target.value;
  //   if (email.length == 0) {
  //     this.err.email = "Email field is required.";
  //   } else if (this.validEmailExp(email)) {
  //     let response = await this.auth.emailValidation(email);
  //     response.subscribe((res: any) => {
  //       if (!res.success) {
  //         this.err.email = res.message;
  //       } else {
  //         this.err.email = "";
  //       }
  //     });
  //   } else {
  //     this.err.email = "Please enter a valid email.";
  //   }
  // };

  // validEmailExp = (email: string) => {
  //   let regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   let match = regx.test(String(email).toLowerCase());
  //   return match;
  // };
}
