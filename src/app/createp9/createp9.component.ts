import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import { Page } from "tns-core-modules/ui/page";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';

import { Emigo } from "../appdb/emigo";
import { getEmigoObject } from "../appdb/emigo.util";
import { EmigoLogin } from '../model/emigoLogin';
import { AppContext } from '../model/appContext';
import { AppSettings } from "../app.settings";
import { MonitorService } from "../service/monitor.service";
import { DikotaService } from "../service/dikota.service";
import { CreateService } from "../service/create.service";
import { EmigoService } from "../appdb/emigo.service";
import { RegistryService } from "../appdb/registry.service";
import { AttributeUtil } from "../attributeUtil";

@Component({
    selector: "createp9",
    moduleId: module.id,
    templateUrl: "./createp9.component.xml"
})
export class CreateP9Component implements OnInit, OnDestroy {

  public username: string;
  public code: string;
  private busy: boolean = false;
  private connectFlag: boolean = false;
  public connectColor: string = "#888888";
  private iOS: boolean;

  constructor(private dikotaService: DikotaService, 
      private createService: CreateService,
      private monitorService: MonitorService,
      private emigoService: EmigoService,
      private registryService: RegistryService,
      private router: RouterExtensions) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onUpdateUsername(value: string) {
    this.username = value;
    this.updateButton();
  }

  onUpdateCode(value: string) {
    this.code = value;
    this.updateButton();
  }

  public updateButton() {
    if(this.username != null && this.username != "" && this.code != null && this.code != "") {
      this.connectFlag = true;
      this.connectColor = "#2C508F"
    }
    else {
      this.connectFlag = false;
      this.connectColor = "#888888"
    }
  }

  onCreate() {
    this.router.back();
  }

  onConnect() {
    if(!this.connectFlag) {
      return;
    }

    let registry: string;
    let address: string[] = this.username.split("|");
    if(address.length > 1) {
      registry = "https://registry." + address[1] + "/app";
    }
    else {
      registry = AppSettings.REGISTRY;
    }

    this.busy = true;

    this.registryService.getIdentity(registry, address[0]).then(m => {
      let e: Emigo = getEmigoObject(m);

      let phone: string = this.createService.getPhoneNumber();
      let e164: string = this.dikotaService.getE164(phone);
      let email: string = this.createService.getEmailAddress();
      // client side hash to mitigate compromised reused pass
      var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
      let pass = SHA256("dikota:" + this.createService.getPassword());
      this.dikotaService.attachAccount(e164, email, pass, e.emigoId, e.node, this.code).then(l => {

        let context: AppContext = { emigoId: l.account.emigoId, registry: registry, token: l.account.token,
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
        console.log("DikotaService.attachAccount failed");
        dialogs.alert({ message: "failed to create account", okButtonText: "ok" });
      });
    }).catch(err => {
      this.busy = false;
      console.log("RegistryService.getIdentity failed");
      dialogs.alert({ message: "failed to locate account", okButtonText: "ok" });
    })
  }
  

}
