import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";

import { AppSettings } from "../app.settings";

import { AmigoUtil } from '../amigoUtil';
import { AttributeUtil } from '../attributeUtil';

import { getAmigoObject } from "../appdb/amigo.util";
import { RegistryService } from "../appdb/registry.service";
import { AmigoService } from "../appdb/amigo.service";
import { AmigoMessage } from "../appdb/amigoMessage";

import { DikotaService } from "../service/dikota.service";

import { Amigo } from "../appdb/amigo";

import { AppContext } from "../model/appContext";
import { AmigoLogin } from "../model/amigoLogin";

@Component({
    selector: "agree",
    moduleId: module.id,
    templateUrl: "./agree.component.xml"
})
export class AgreeComponent implements OnInit, OnDestroy {

  private interval: any = null;
  public busy: boolean = false;
  private sub: Subscription[];
  private username: string;
  private code: string
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private route: ActivatedRoute,
      private amigoService: AmigoService,
      private registryService: RegistryService,
      private dikotaService: DikotaService) { 
    this.sub = [];
    this.iOS = isIOS;
  }

  ngOnInit(): void {

    // retrieve params
    this.route.params.forEach(p => {
      this.username = p.username;
      this.code = p.code;
    });
  }

  ngOnDestroy(): void {
  }

  goBack() {
    this.router.back();
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

  async onAgree() {

    let msg: AmigoMessage;
    let login: AmigoLogin;
    try {
      this.busy = true;

      // get registry params
      let u: string[] = this.username.split("@");
      let reg: string = u.length > 1 ? "https://registry." + u[1] + "/app" : AppSettings.REGISTRY;
   
      // retrieve identity 
      msg = await this.registryService.getIdentity(reg, u[0]);
      let e: Amigo = getAmigoObject(msg);

      // attach app to account
      login = await this.dikotaService.attach(e.amigoId, e.node, this.code);

      // setup local store
      let ctx: AppContext = { amigoId: login.account.amigoId, registry: reg, token: login.account.token,
          appNode: login.service.node, appToken: login.service.token, serviceToken: login.token };
      await this.amigoService.setAmigo(ctx.amigoId, ctx.registry, ctx.token, ctx.appNode, ctx.appToken,
          AttributeUtil.getSchemas(), [], null, AmigoUtil.getSearchableAmigo, s => {});
      await this.amigoService.setAppContext(ctx);
      this.dikotaService.setToken(login.token);

      // nav to home page
      this.router.navigate(["/home"], { clearHistory: true });
    }
    catch(err) {
      this.busy = false;
      console.log(err);
      if(msg == null) {
        dialogs.alert({ message: "failed to locate identity", okButtonText: "ok" });
      }
      else if(login == null) {
        dialogs.alert({ message: "failed to attach identity", okButtonText: "ok" });
      }
      else {
        dialogs.alert({ message: "failed to set identity", okButtonText: "ok" });
      }
    }
  }

}
