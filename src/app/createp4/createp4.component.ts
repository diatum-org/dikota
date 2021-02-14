import { Component, OnInit } from "@angular/core";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { RouterExtensions } from "nativescript-angular/router";

import { CreateService } from "../service/create.service";

@Component({
    selector: "createp4",
    moduleId: module.id,
    templateUrl: "./createp4.component.xml"
})
export class CreateP4Component implements OnInit {

  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private createService: CreateService) { 
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
  }

  onBack() {
    this.router.back();
  }

  onNext() {
    this.router.navigate(["/createp5"], { clearHistory: false });
  }
}
