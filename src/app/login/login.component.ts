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

  public show: boolean = false;
  public busy: boolean = false;
  public loginFocus: boolean = false;
  public passFocus: boolean = false;
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
    if(value == null) {
      value = "";
    }
    this.login = value;
  }

  onUpdatePassword(value: string) {
    if(value == null) {
      value = "";
    }
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
        title: "Diatum Attachment Code",
        message: "Set attachment code generated with your Diatabase.",
        okButtonText: "Ok",
        cancelButtonText: "Cancel",
        userName: this.login
    }).then(r => {
      if(r.result) {
        this.router.navigate(["/agree", r.userName, r.password], { clearHistory: false });
      }
    });
  }

  async onAttach() {
    if(this.login != "" && this.password != "") {
      this.busy = true;
      try {
        // get registry params
        let u: string[] = this.login.split("@");
        let reg: string = u.length > 1 ? "https://registry." + u[1] + "/app" : AppSettings.REGISTRY;

        // retrieve identity
        let msg: AmigoMessage = await this.registryService.getIdentity(reg, u[0]);
        let e: Amigo = getAmigoObject(msg);

        // retrieve code
        let code: string = await this.registryService.getPassCode(AppSettings.PORTAL, e.amigoId, this.password);
        
        this.busy = false;
        this.router.navigate(["/agree", this.login, code], { clearHistory: false });
      }
      catch(err) {
        this.busy = false;
        dialogs.alert({ message: "failed to retrieve attachment code", okButtonText: "ok" });
      }
    }
  }

}
