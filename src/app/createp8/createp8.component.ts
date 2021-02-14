import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";

import { AppSettings } from "../app.settings";

import { AttributeUtil } from "../attributeUtil";
import { getEmigoObject } from "../appdb/emigo.util";
import { IdentityService } from "../appdb/identity.service";
import { RegistryService } from "../appdb/registry.service";
import { EmigoService } from "../appdb/emigo.service";

import { CreateService } from "../service/create.service";
import { DikotaService } from "../service/dikota.service";
import { MonitorService } from "../service/monitor.service";

import { Emigo } from "../appdb/emigo";

import { AppContext } from "../model/appContext";
import { EmigoLogin } from "../model/emigoLogin";

@Component({
    selector: "createp8",
    moduleId: module.id,
    templateUrl: "./createp8.component.xml"
})
export class CreateP8Component implements OnInit, OnDestroy {

  private interval: any = null;
  public agreeFlag: boolean = false;
  public agreeColor: string = "#888888";
  public busy: boolean = false;
  private sub: Subscription[];
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private createService: CreateService,
      private monitorService: MonitorService,
      private emigoService: EmigoService,
      private identityService: IdentityService,
      private registryService: RegistryService,
      private dikotaService: DikotaService) { 
    this.sub = [];
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.checkAvailability();
    }, 15000);
    this.checkAvailability();
  }

  ngOnDestroy(): void {
    if(this.interval != null) {
      clearInterval(this.interval);
    }
  }

  onBack() {
    this.router.back();
  }

  onCancel() {
    this.router.navigate(["/login"], { clearHistory: true });
  }

  onAttach() {
    this.router.navigate(["/createp9"], { clearHistory: false });
  }

  onData() {
    utils.openUrl("https://diatum.org/policies-introduction");
  }

  onTerms() {
    utils.openUrl("https://diatum.org/terms-of-service");
  }

  private checkAvailability() {
    this.dikotaService.getAvailable().then(n => {
      if(n > 0) {
        this.agreeFlag = true;
        this.agreeColor = "#2C508F";
      }
      else {
        this.agreeFlag = false;
        this.agreeColor = "#888888";
      }
    }).catch(err => {
      console.log("DikotaService.getAvailable failed");
    });
  }

  onAgree() {

    // only can proceed if slots available
    if(!this.agreeFlag) {
      return;
    }

    this.busy = true;
    let phone: string = this.createService.getPhoneNumber();
    let e164: string = this.dikotaService.getE164(phone);
    let email: string = this.createService.getEmailAddress();
    // client side hash to mitigate compromised reused pass
    var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
    let pass = SHA256("dikota:" + this.createService.getPassword());
    this.dikotaService.createAccount(e164, email, pass).then(l => {
      this.identityService.setRegistry(l.account.node, l.account.token, AppSettings.REGISTRY).then(m => {
        let emigo: Emigo = getEmigoObject(m);
        this.registryService.setMessage(emigo.registry, m).then(() => {
          this.busy = false;
        
          let context: AppContext = { emigoId: emigo.emigoId, registry: emigo.registry, token: l.account.token,
              appNode: l.service.node, appToken: l.service.token, serviceToken: l.token };
         
          this.dikotaService.setToken(l.token); 
          this.emigoService.setEmigo(context.emigoId, context.registry, context.token, AttributeUtil.getSchemas(), 
              context.appNode, context.appToken).then(p => {
            this.emigoService.setAppContext(context).then(() => {
              this.monitorService.start();
              this.router.navigate(["/home"], { clearHistory: true });
            }).catch(err => {
              console.log("EmigoService.setAppContext failed");
              dialogs.alert({ message: "internal error [EmigoService.setAppContext]", okButtonText: "ok" });
            });
          }).catch(err => {
            console.log("EmigoService.setEmigo failed");
            dialogs.alert({ message: "internal error [EmigoService.setEmigo]", okButtonText: "ok" });
          });

        }).catch(err => {
          this.busy = false;
          console.log("RegistryService.setMessage failed");
          dialogs.alert({ message: "failed to update registry", okButtonText: "ok" });
        });
      }).catch(err => {
        this.busy = false;
        console.log("IdentityService.setRegistry failed");
        dialogs.alert({ message: "failed to set account registry", okButtonText: "ok" });
      });
    }).catch(err => {
      this.busy = false;
      console.log("DikotaService.createAccount failed");
      dialogs.alert({ message: "failed to create account", okButtonText: "ok" });
    });
  }
}
