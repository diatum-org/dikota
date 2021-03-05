import { Component, OnInit } from "@angular/core";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "settings",
    moduleId: module.id,
    templateUrl: "./settings.component.xml"
})
export class SettingsComponent implements OnInit {

  private iOS: boolean;

  constructor(private router: RouterExtensions) { 
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
  }

  onBack() {
    this.router.back();
  }

  onPrivacyControls() {
    this.router.navigate(["/privacycontrols"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }

  onOverview() {
    this.router.navigate(["/overview"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }
  
  onPermissions() {
    this.router.navigate(["/permissionp0"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }
}
