import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/layout/navbar/navbar.component";
import { HomeComponent } from "./components/layout/home/home.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { ProfileComponent } from "./components/auth/profile/profile.component";
import { ProfileSearchComponent } from "./components/common/profile-search/profile-search.component";

import { ApiCallsService } from "./services/api-calls.service";
import { AuthService } from "./services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileSearchComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [ApiCallsService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
