import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';

import { DikotaService } from "../service/dikota.service";

@Component({
    selector: "passwordreset",
    moduleId: module.id,
    templateUrl: "./passwordreset.component.xml"
})
export class PasswordResetComponent implements OnInit, OnDestroy {

  public resetFlag: boolean = false;
  public resetColor: string = "#888888";
  private email: string;
  private phone: string;
  private iOS: boolean;
  private busy: boolean = false;
  private done: boolean = false;
  private contact: string;

  constructor(private dikotaService: DikotaService, 
      private router: RouterExtensions) { 
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public onReset(): void {
    if(this.resetFlag) {
      this.busy = true;
      this.dikotaService.reset(this.email, this.phone).then(() => {
        this.busy = false;
        if(this.email != null) {
          this.contact = this.email;
        }
        else {
          this.contact = this.phone;
        }
        this.done = true;
      }).catch(err => {
        this.busy = false;
        if(err.status == 404) {
          dialogs.alert({ message: "Sorry but we can't find that account. Please check the phone number or email you used to sign up for Dikota.", okButtonText: "ok" });
        }
        else {
          dialogs.alert({ message: "Failed to reset password", okButtonText: "ok" });
        }
      });
    }
  }

  public onUpdate(value: string) {
    this.email = this.dikotaService.getRFC5322(value);
    this.phone = this.dikotaService.getE164(value);
    if(this.email != null || this.phone != null) {
      this.resetFlag = true;
      this.resetColor="#2C508F";
    }
    else {
      this.resetFlag = false;
      this.resetColor="#888888";
    }
  }

  public onBack() {
    this.router.back();
  }

}
