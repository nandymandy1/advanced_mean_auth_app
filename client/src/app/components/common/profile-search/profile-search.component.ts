import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-profile-search",
  templateUrl: "./profile-search.component.html",
  styleUrls: ["./profile-search.component.css"]
})
export class ProfileSearchComponent implements OnInit {
  users = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  constructor() {}

  ngOnInit() {}
}
