import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import { Page } from "tns-core-modules/ui/page";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";

import { AppSettings } from "../app.settings";

@Component({
    selector: "login",
    moduleId: module.id,
    templateUrl: "./login.component.xml"
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginFocus: boolean = false;
  public passFocus: boolean = false;
  public login: string = "";
  public password: string = "";
  @ViewChild("lgn", {static: false}) loginRef: ElementRef;
  @ViewChild("pas", {static: false}) passRef: ElementRef;
  private version: string = "";

  constructor(private router: RouterExtensions,
      private page: Page) { 
    this.page.actionBarHidden = true;
    this.version = "Version: " + AppSettings.VER + " " + AppSettings.ENV;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onUpdateLogin(value: string) {
    this.login = value;
  }

  onUpdatePassword(value: string) {
    this.password = value;
  }

  onLoginSet() {
    let view = <TextField>this.passRef.nativeElement;
    view.focus();
  }

  onPasswordSet(args) {
    const textField: TextField = <TextField>args.object;
    textField.dismissSoftInput();
  }

  onLoginBlur() {
    this.loginFocus = false;
  }

  onLoginFocus() {
    this.loginFocus = true;
  }

  onPassBlur() {
    this.passFocus = false;
  }

  onPassFocus() {
    this.passFocus = true;
  }

  getColor(): string {
    if(this.login == "" || this.password == "") {
      return "#888888";
    }
    return "#447390";
  }

  onDismiss() {
    if(this.loginFocus) {
      let view = <TextField>this.loginRef.nativeElement;
      view.dismissSoftInput();
      this.loginFocus = false;
    }
    if(this.passFocus) {
      let view = <TextField>this.passRef.nativeElement;
      view.dismissSoftInput();
      this.passFocus = false;
    }
  }

  onPortal() {
    utils.openUrl("https://portal.diatum.net/app/#/account");
  }

  onAttach() {
    if(this.login != "" && this.password != "") {
      this.router.navigate(["/agree", this.login, this.password], 
          { clearHistory: false });
    }
  }

}
