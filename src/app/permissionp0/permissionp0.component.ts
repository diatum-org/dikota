import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "permissionp0",
    moduleId: module.id,
    templateUrl: "./permissionp0.component.xml"
})
export class PermissionP0Component implements OnInit {

  constructor(private router: RouterExtensions) { 
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.back();
  }

  onNext() {
    this.router.navigate(["/permissionp1"], { clearHistory: true,
      transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
  }
}
