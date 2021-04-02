import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import { Page } from "tns-core-modules/ui/page";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";
import { RegistryService } from '../appdb/registry.service';
import { NgZone } from "@angular/core";


import { getAmigoObject } from "../appdb/amigo.util";
import { AmigoMessage } from "../appdb/amigoMessage";
import { Amigo } from "../appdb/amigo";
import { AppSettings } from "../app.settings";

@Component({
    selector: "login",
    moduleId: module.id,
    templateUrl: "./login.component.xml"
})
export class LoginComponent implements OnInit, OnDestroy {

  public busy: boolean = false;
  public loginFocus: boolean = false;
  public passFocus: boolean = false;
  public username: string = "";
  public code: string = "";
  public login: string = "";
  public password: string = "";
  @ViewChild("lgn", {static: false}) loginRef: ElementRef;
  @ViewChild("pas", {static: false}) passRef: ElementRef;
  private version: string = "";

  constructor(private router: RouterExtensions,
      private registryService: RegistryService,
      private zone: NgZone,
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

  showControls(): boolean {
    if(isIOS) {
      return true;
    }
    if(this.loginFocus || this.passFocus) {
      return false;
    }
    return true;
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
    dialogs.login({
        title: "portal.diatum.net",
        message: "Use your portal login to generate an attachment code.",
        okButtonText: "Ok",
        cancelButtonText: "Cancel",
        userName: this.login
    }).then(r => {
      if(r.result) {
        this.zone.run(async () => {
          this.busy = true;
          try {
            // get registry params
            let u: string[] = r.userName.split("@");
            let reg: string = u.length > 1 ? "https://registry." + u[1] + "/app" : AppSettings.REGISTRY;

            // retrieve identity
            let msg: AmigoMessage = await this.registryService.getIdentity(reg, u[0]);
            let e: Amigo = getAmigoObject(msg);

            // retrieve code
            this.code = await this.registryService.getPassCode(AppSettings.PORTAL, e.amigoId, r.password);
            
            // set login
            this.login = r.userName;
            this.username = r.userName;
            this.password = this.code;
          }
          catch(err) {
            dialogs.alert({ message: "failed to retrieve attachment code", okButtonText: "ok" });
          }
         this.busy = false;
        });
      }
    });
  }

  onAttach() {
    if(this.login != "" && this.password != "") {
      this.router.navigate(["/agree", this.login, this.password], 
          { clearHistory: false });
    }
  }

}
