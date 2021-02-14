import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import { Page } from "tns-core-modules/ui/page";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';

import { EmigoLogin } from '../model/emigoLogin';
import { AppContext } from '../model/appContext';
import { AppSettings } from "../app.settings";
import { DikotaService } from "../service/dikota.service";
import { CreateService } from "../service/create.service";
import { MonitorService } from "../service/monitor.service";
import { EmigoService } from "../appdb/emigo.service";
import { RegistryService } from "../appdb/registry.service";
import { AttributeUtil } from '../attributeUtil';

@Component({
    selector: "login",
    moduleId: module.id,
    templateUrl: "./login.component.xml"
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginFocus: boolean = false;
  public passFocus: boolean = false;
  public login: string;
  public password: string;
  private sub: Subscription[];
  private busy: boolean = false;
  public loginColor: string = "#888888";
  public loginFlag: boolean = false;
  public show: boolean = false;
  public hint: string = "Username / Phone / Email";
  @ViewChild("lgn", {static: false}) loginRef: ElementRef;
  @ViewChild("pas", {static: false}) passRef: ElementRef;
  private version: string = "";

  constructor(private dikotaService: DikotaService, 
      private createService: CreateService,
      private emigoService: EmigoService,
      private monitorService: MonitorService,
      private registryService: RegistryService,
      private router: RouterExtensions,
      private page: Page) { 
    this.page.actionBarHidden = true;
    this.version = "Version: " + AppSettings.VER + " " + AppSettings.ENV;
    this.sub = [];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  getScreenGrid(): string {
    if((this.loginFocus || this.passFocus) && isIOS) {
      return "*,*";
    }
    else {
      return "*";
    }
  }

  onUpdateLogin(value: string) {
    this.login = value;
    this.validateLogin();
  }

  onUpdatePassword(value: string) {
    this.password = value;
    this.validateLogin();
  }

  onShow(flag: boolean) {
    this.show = flag;
  }

  validateLogin() {

    // some password must be set
    if(this.password == null || this.password.length == 0) {
      this.loginFlag = false;
      this.loginColor = "#888888";
      return;
    }

    // some login must be set
    if(this.login == null || this.login.length == 0) {
      this.loginFlag = false;
      this.loginColor = "#888888";
      return;
    }

    // we can try
    this.loginFlag = true;
    this.loginColor = "#2C508F";
  }

  onLoginSet() {
    let view = <TextField>this.passRef.nativeElement;
    view.focus();
  }

  onPasswordSet() {
    if(this.loginFlag) {
      this.onLogin();
    }
    else {
      let view = <TextField>this.loginRef.nativeElement;
      view.focus();
    }
  }

  private applyLogin(l: EmigoLogin): void {

    // stop activity indicator
    this.busy = false;   
 
    // context for next time app starts
    let context: AppContext = { emigoId: l.account.emigoId, registry: l.account.registry, token: l.account.token, 
        appNode: l.service.node, appToken: l.service.token, serviceToken: l.token};
    
    this.dikotaService.setToken(l.token);
    this.emigoService.setEmigo(context.emigoId, context.registry, context.token, AttributeUtil.getSchemas(),
        context.appNode, context.appToken).then(p => {
     
      // save context 
      this.emigoService.setAppContext(context).then(() => {
        this.monitorService.start();
        this.router.navigate(["/home"], { clearHistory: true });
      }).catch(err => {
        console.log("EmigoService.setAppContext failed");
        dialogs.alert({ message: "Internal Error [EmigoService.setAppContext]", okButtonText: "ok" });
      });
    }).catch(err => {
      console.log("EmigoService.setEmigo failed");
      dialogs.alert({ message: "Internal Error [EmigoService.setEmigo]", okButtonText: "ok" });
    });
  }

  onLogin() {

    // have strings been entered
    if(!this.loginFlag) {
      return;
    }

    // setup request
    this.busy = true;
    var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
    let pass = SHA256("dikota:" + this.password);

    // regex
    var at = /^(?=.*[@])/
    var reg = /^(?=.*[|])/
    var alpha = /^(?=.*[a-zA-Z])/

    if(at.test(this.login)) {
      // assume email login if contains '@'
      this.dikotaService.emailLogin(this.login, pass).then(l => {
        this.applyLogin(l);  
      }).catch(err => {
        this.busy = false;
        dialogs.alert({ message: "Error: account login failed", okButtonText: "ok" });
      });
    }
    else if(reg.test(this.login)) {
      // assume username login at specified registry
      let address: string[] = this.login.split("|");
      this.registryService.getEmigoId("https://registry." + address[1] + "/app", address[0]).then(i => {
        this.dikotaService.emigoIdLogin(i, pass).then(l => {
          this.applyLogin(l);
        }).catch(err => {
          this.busy = false;
          dialogs.alert({ message: "Error: account login failed", okButtonText: "ok" });
        });
      }).catch(err => {
        this.busy = false;
        dialogs.alert({ message: "Error: could not find user", okButtonText: "ok" });
      });
    }
    else if(!alpha.test(this.login)) {
      // assume phone if does not contain any alpha
      let e164: string = this.dikotaService.getE164(this.login);
      this.dikotaService.phoneLogin(e164, pass).then(l => {
        this.applyLogin(l);
      }).catch(err => {
        this.busy = false;
        dialogs.alert({ message: "Error: account login failed", okButtonText: "ok" });
      });
    }
    else {
      // assume username at coredb.org registry
      this.registryService.getEmigoId(AppSettings.REGISTRY, this.login).then(i => {
        this.dikotaService.emigoIdLogin(i, pass).then(l => {
          this.applyLogin(l);
        }).catch(err => {
          this.busy = false;
          dialogs.alert({ message: "Error: account login failed", okButtonText: "ok" });
        });
      }).catch(err => {
        this.busy = false;
        dialogs.alert({ message: "Error: could not find user", okButtonText: "ok" });
      });
    }
  }

  onReset() {
    this.router.navigate(["/passwordreset"], { clearHistory: false });
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

  onCreate() {
    this.createService.setEmailAddress(null);
    this.createService.setPhoneNumber(null);
    this.createService.setPassword(null);
    this.router.navigate(["/createp0"], { clearHistory: false });
  }

}
