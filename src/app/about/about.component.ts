import { Component, OnInit } from "@angular/core";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { RouterExtensions } from "nativescript-angular/router";
import { AppSettings } from '../app.settings';
import * as utils from "tns-core-modules/utils/utils";

@Component({
    selector: "about",
    moduleId: module.id,
    templateUrl: "./about.component.xml"
})
export class AboutComponent implements OnInit {

  private iOS: boolean;
  private version: string;

  constructor(private router: RouterExtensions) { 
    this.iOS = (device.os == "iOS");
    this.version = AppSettings.VER + " " + AppSettings.ENV;;
  }

  ngOnInit(): void {
  }

  onTour() {
    this.router.navigate(["/boardingp0"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }

  onBack() {
    this.router.back();
  }

  onAbout() {
    utils.openUrl("https://diatum.org/about/");
  }

  onData() {
    utils.openUrl("https://diatum.org/policies-introduction");
  }

  onTerms() {
    utils.openUrl("https://diatum.org/terms-of-service");
  }

  onNotice() {
    this.router.navigate(["/ossnotice"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }
}
