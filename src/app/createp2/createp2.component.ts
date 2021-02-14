import { Component, OnInit } from "@angular/core";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { RouterExtensions } from "nativescript-angular/router";

import { DikotaService } from "../service/dikota.service";
import { CreateService } from "../service/create.service";

@Component({
    selector: "createp2",
    moduleId: module.id,
    templateUrl: "./createp2.component.xml"
})
export class CreateP2Component implements OnInit {

  private focus: boolean = false;
  public nextColor: string = "#888888";
  private nextFlag: boolean = false;
  public phoneBorder: string = "#DDDDDD";
  public phone: string;
  public e164: string;
  private iOS: boolean;
  private phoneUtil: any;
  private pnf: any;
  private debounce: any;

  constructor(private routerExtensions: RouterExtensions,
      private dikotaService: DikotaService,
      private createService: CreateService) { 
    this.pnf = require('google-libphonenumber').PhoneNumberFormat;
    this.phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.phone = this.createService.getPhoneNumber();
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

  onSetPhone(value: string) {
    this.phone = value;
    this.e164 = this.dikotaService.getE164(value);

    if(this.debounce != null) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(() => {
      this.debounce = null;
      if(this.e164 == null) {
        this.nextColor = "#888888";
        this.nextFlag = false;
      }
      else {  
        this.dikotaService.contact(null, this.e164).then(f => {
          if(f) {
            this.phoneBorder = "#DDDDDD";
            if(this.phone != null && this.phone.length > 0) {
              this.nextColor = "#2C508F";
              this.nextFlag = true;
            }
            else {
              this.nextColor = "#888888";
              this.nextFlag = false;
            }
          }
          else {
            this.phoneBorder = "#ED5A56";
            this.nextColor = "#888888";
            this.nextFlag = false;
          }
        }).catch(err => {
          console.log(err);
          this.nextColor = "#888888";
          this.nextFlag = false;
        });
      }
    }, 250);
  }

  onClear() {
    this.phone = null;
    this.nextColor = "#888888";
    this.nextFlag = false;
  }

  onBack() {
    this.routerExtensions.back();
  }

  onEmail() {
    this.routerExtensions.navigate(["/createp1"], { clearHistory: false });
  }

  onNext() {
    if(this.nextFlag) {
      this.createService.setEmailAddress(null);
      this.createService.setPhoneNumber(this.phone);
      this.routerExtensions.navigate(["/createp3"], { clearHistory: false });
    }
  }
}
