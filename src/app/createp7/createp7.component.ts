import { Component, OnInit } from "@angular/core";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { RouterExtensions } from "nativescript-angular/router";

import { CreateService } from "../service/create.service";

@Component({
    selector: "createp7",
    moduleId: module.id,
    templateUrl: "./createp7.component.xml"
})
export class CreateP7Component implements OnInit {

  private allow: boolean = false;
  private nallow: boolean = false;
  private deny: boolean = false;
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
    this.router.navigate(["/createp8"], { clearHistory: false });
  }
}
