import { Component, OnInit } from "@angular/core";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { RouterExtensions } from "nativescript-angular/router";

import { DikotaService } from "../service/dikota.service";
import { CreateService } from "../service/create.service";

@Component({
    selector: "createp1",
    moduleId: module.id,
    templateUrl: "./createp1.component.xml"
})
export class CreateP1Component implements OnInit {

  private focus: boolean = false;
  public nextColor: string = "#888888";
  public emailBorder: string = "#DDDDDD";
  private nextFlag: boolean = false;
  public email: string;
  private iOS: boolean;
  private debounce: any = null;

  constructor(private routerExtensions: RouterExtensions,
      private dikotaService: DikotaService,
      private createService: CreateService) { 
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.email = this.createService.getEmailAddress();
  }

  onSetEmail(value: string) {
    this.email = value;
    if(this.debounce != null) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(() => {
      this.debounce = null;
      this.dikotaService.contact(this.email, null).then(f => {
        if(f) {
          this.emailBorder = "#DDDDDD";
          if(this.dikotaService.getRFC5322(this.email) != null) {
            this.nextColor = "#2C508F";
            this.nextFlag = true;
          }
          else {
            this.nextColor = "#888888";
            this.nextFlag = false;
          }
        }
        else {
          this.emailBorder = "#ED5A56";
          this.nextColor = "#888888";
          this.nextFlag = false;
        }
      }).catch(err => {
        console.log("DikotaService.contact failed");
      });
    }, 250);
  } 

  getScreenGrid(): string {
    if((this.focus) && device.os == "iOS") {
      return "*,*";
    }
    else {
      return "*";
    }
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  onClear() {
    this.email = null;
    this.nextColor = "#888888";
    this.nextFlag = false;
  }

  onBack() {
    this.routerExtensions.back();
  }

  onPhone() {
    this.routerExtensions.navigate(["/createp2"], { clearHistory: false });
  }

  onNext() {
    if(this.nextFlag) {
      this.createService.setPhoneNumber(null);
      this.createService.setEmailAddress(this.email);
      this.routerExtensions.navigate(["/createp3"], { clearHistory: false });
    }
  }
}
