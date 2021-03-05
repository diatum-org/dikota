import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "permissionp1",
    moduleId: module.id,
    templateUrl: "./permissionp1.component.xml"
})
export class PermissionP1Component implements OnInit {

  constructor(private router: RouterExtensions) { 
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.back();
  }

  onNext() {
    this.router.navigate(["/home"], { clearHistory: true });
  }
}
