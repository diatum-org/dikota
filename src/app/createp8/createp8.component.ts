import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";

import { AppSettings } from "../app.settings";

import { EmigoUtil } from "../emigoUtil";
import { AttributeUtil } from "../attributeUtil";
import { getEmigoObject } from "../appdb/emigo.util";
import { IdentityService } from "../appdb/identity.service";
import { RegistryService } from "../appdb/registry.service";
import { EmigoService } from "../appdb/emigo.service";

import { CreateService } from "../service/create.service";
import { DikotaService } from "../service/dikota.service";
import { EntryService } from '../service/entry.service';

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
  private username: string;
  private code: string;
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private createService: CreateService,
      private emigoService: EmigoService,
      private identityService: IdentityService,
      private registryService: RegistryService,
      private entryService: EntryService,
      private dikotaService: DikotaService) { 
    this.sub = [];
    this.iOS = isIOS;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onBack() {
    this.router.back();
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
      this.agreeFlag = true;
      this.agreeColor = "#2C508F"
    }
    else {
      this.agreeFlag = false;
      this.agreeColor = "#888888"
    }
  }

  onCancel() {
    this.router.navigate(["/login"], { clearHistory: true });
  }

  onData() {
    utils.openUrl("https://diatum.org/policies-introduction");
  }

  onTerms() {
    utils.openUrl("https://diatum.org/terms-of-service");
  }

  onAgree() {

    // only can proceed when username and code set
    if(!this.agreeFlag) {
      return;
    }
    this.busy = true;

    // construct registry url
    let registry: string;
    let address: string[] = this.username.split("@");
    if(address.length > 1) {
      registry = "https://registry." + address[1] + "/app";
    }
    else {
      registry = AppSettings.REGISTRY;
    }

    // client side hash to mitigate compromised reused pass
    var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
    let pass = SHA256("dikota:" + this.createService.getPassword());

    // attach to specified account
    this.registryService.getIdentity(registry, address[0]).then(m => {
      let e: Emigo = getEmigoObject(m);

      this.dikotaService.attachAccount(pass, e.emigoId, e.node, this.code).then(l => {

        let context: AppContext = { emigoId: l.account.emigoId, registry: registry, token: l.account.token,
            appNode: l.service.node, appToken: l.service.token, serviceToken: l.token };

        this.dikotaService.setToken(l.token);
        this.emigoService.setEmigo(context.emigoId, context.registry, context.token, context.appNode, context.appToken,
            AttributeUtil.getSchemas(), [], null, EmigoUtil.getSearchableEmigo, s => {}).then(p => {
          this.entryService.init();
          this.emigoService.setAppContext(context).then(() => {
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
    });

  }
}
