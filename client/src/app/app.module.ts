import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/layout/navbar/navbar.component";
import { RegisterComponent } from "./components/public/register/register.component";
import { LoginComponent } from "./components/public/login/login.component";
import { HomeComponent } from "./components/public/home/home.component";
import { DashboardComponent } from "./components/auth/dashboard/dashboard.component";
import { AuthService } from "./services/auth.service";
import { NetworkService } from "./services/network.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [AuthService, NetworkService],
  bootstrap: [AppComponent]
})
export class AppModule {}
