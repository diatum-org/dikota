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

  onContactMethod() {
    this.router.navigate(["/contactmethod"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }

  onPrivacyControls() {
    this.router.navigate(["/privacycontrols"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }

  onPasswordUpdate() {
    this.router.navigate(["/passwordupdate"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }
}
